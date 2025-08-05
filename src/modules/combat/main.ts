import {
  Player,
  PlayerLeaveBeforeEvent,
  PlayerSpawnAfterEvent,
  system,
  type EntityHitEntityAfterEvent,
} from "@minecraft/server";
import Member from "../../utils/wrappers/member/main";
import Cache from "../cache/main";
import World from "../../utils/wrappers/world/main";
import Config from "../../lib/config";
import Logger from "../../utils/logger/main";
import { CombatLogDatabase } from "../../assets/constants";
import type { MixedItem } from "../../utils/wrappers/member/types";
import Sleep from "../../utils/sleep/main";

export default class Combat {
  public constructor() {
    Combat.UpdateCombatTime();
  }

  public static async OnSpawn(event: PlayerSpawnAfterEvent): Promise<void> {
    const { player, initialSpawn } = event;

    if (!initialSpawn) {
      return;
    }

    const member = new Member(player);
    const logged = CombatLogDatabase.Get(member.EntityID());

    if (!logged) {
      return;
    }

    member.ClearAll();

    await member.Moved();

    member.SendWarning(
      "You have been punished by a inventory drop due to you combat logging!",
    );
  }
  public static async OnLeave(event: PlayerLeaveBeforeEvent): Promise<void> {
    const {
      player: {
        id: entity_id,
        location,
        name: username,
        dimension: { id: dimensionID },
      },
    } = event;

    const inventory = Cache.InventoryCache[entity_id];
    const time = Cache.CombatCache[entity_id];

    if (!inventory) {
      Logger.Error(`Could not find ${username}:${entity_id}'s inventory!`);
      return;
    }
    if (!time) {
      return;
    }

    CombatLogDatabase.Set(entity_id, { entity_id, created_at: new Date() });

    const dimension =
      dimensionID === "minecraft:overworld"
        ? World.Overworld()
        : dimensionID === "minecraft:nether"
          ? World.Nether()
          : dimensionID === "minecraft:the_end"
            ? World.End()
            : undefined;

    if (!dimension) {
      Logger.Error(`Could not find dimension "${dimensionID}"`);
      return;
    }

    switch (Config.CombatPunishDropType) {
      case "instant":
        for (const item of inventory) {
          World.SpawnItem(item.data, location, dimension);
        }
        break;
      case "flow":
        for (let i = 0; i < inventory.length; i++) {
          const item = inventory[i] as MixedItem;

          system.runTimeout(() => {
            World.SpawnItem(item.data, location, dimension);
          }, i * Config.CombatPunishDropSpeed);
        }
        break;
    }

    await Sleep(0);

    World.BroadcastWarning(`${username} has combat logged!`);
  }

  public static OnHit(event: EntityHitEntityAfterEvent): void {
    const { hitEntity: targetPlayer, damagingEntity: sourcePlayer } = event;

    if (
      !(targetPlayer instanceof Player) ||
      !(sourcePlayer instanceof Player)
    ) {
      return;
    }

    const source = new Member(sourcePlayer);
    const target = new Member(targetPlayer);

    source.SetCombatTime();
    target.SetCombatTime();
  }

  private static UpdateCombatTime(): void {
    system.runInterval(() => {
      for (const [entity_id, time] of Object.entries(Cache.CombatCache)) {
        const member = World.FindMember(entity_id);

        if (!member) {
          delete Cache.CombatCache[entity_id];

          continue;
        }
        if (time === 1) {
          member.SendInfo("You are now out of combat!");

          delete Cache.CombatCache[entity_id];

          continue;
        }

        member.SetCombatTime(time - 1);

        if (Config.CombatUpdateSound) {
          member.PlaySound(Config.CombatUpdateSound);
        }
      }
    }, 20);
  }
}

import { system } from "@minecraft/server";
import type { MixedItem } from "../../utils/wrappers/member/types";
import World from "../../utils/wrappers/world/main";
import Config from "../../lib/config";

export default class Cache {
  public static CombatCache: Record<string, number>;
  public static InventoryCache: Record<string, MixedItem[]>;

  public constructor() {
    Cache.CombatCache = {};
    Cache.InventoryCache = {};

    this.UpdateInventories();
  }

  private UpdateInventories(): void {
    system.runInterval(() => {
      const members = World.Members();
      const inventories: Record<string, MixedItem[]> = {};

      for (const member of members) {
        const items = member.AllItems();

        inventories[member.EntityID()] = items;
      }

      Cache.InventoryCache = inventories;
    }, Config.CacheInventorySpeed);
  }
}

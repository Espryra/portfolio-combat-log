import { world } from "@minecraft/server";
import Combat from "../modules/combat/main";

world.afterEvents.entityHitEntity.subscribe((event) => {
  Combat.OnHit(event);
});
world.afterEvents.playerSpawn.subscribe((event) => {
  Combat.OnSpawn(event);
});

world.beforeEvents.playerLeave.subscribe((event) => {
  Combat.OnLeave(event);
});

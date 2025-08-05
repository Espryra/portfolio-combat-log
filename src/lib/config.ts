import { type CombatSafeZone } from "../modules/combat/types";

const Config = {
  debug: true,

  // General
  sounds: {
    info: "note.hat",
    success: "note.pling",
    warning: "note.harp",
    error: "note.bass",
  },
  colors: {
    info: "§b",
    success: "§a",
    warning: "§e",
    error: "§c",
  },

  //Cache
  CacheInventorySpeed: 5, // The speed in ticks of updating the inventories cache.

  // Combat
  CombatSetTime: 15, // The time in ticks the member is set at when hit
  CombatPunishDropType: "instant", // "flow" | "instant"
  CombatPunishDropSpeed: 5, // The speed of each itemstack dropped per a tick. Not needed if using instant drop type.
  CombatUpdateSound: "note.hat", // Plays every second the member is in combat, to let them know they are still in combat. If you do not want this, set it to null or undefined.
  EnteredCombatWarning: true, // Warns the member when they enter combat.
  CombatSafeZones: [
    {
      location: {
        x: -17,
        y: -60,
        z: 12,
      },
      range: 5,
      dimension: "minecraft:overworld",
    },
  ] as CombatSafeZone[],
};

export default Config;

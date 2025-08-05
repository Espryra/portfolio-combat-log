import type { Dimension, Vector3 } from "@minecraft/server";

export type CombatLog = {
  entity_id: string;
  created_at: Date;
};
export type CombatSafeZone = {
  location: Vector3;
  range: number;
  dimension: "minecraft:the_end" | "minecraft:nether" | "minecraft:overworld";
};

("hello!"); // Putting this here because the file is empty and gives an error when compiled to javascript :))))

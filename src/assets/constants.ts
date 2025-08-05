import { type CombatLog } from "../modules/combat/types";
import Database from "../utils/database/main";

export const TIMESTARTED = new Date();

export const CombatLogDatabase = new Database<CombatLog>("combatLog");

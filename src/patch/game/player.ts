/**
 * Patches to the Game_Player class.
 * 
 * Changes:
 *  - Modified to update fog of war.
 */

import type { Game_Character } from "./character";
import { Game_System } from "./system";

declare const $gameSystem: Game_System;

export declare class Game_Player extends Game_Character {}

Game_Player.prototype.fogOfWarRange = function() {
    return $gameSystem.playerVisionRange();
};

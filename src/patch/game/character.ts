/**
 * Patches to the Game_Character class.
 *
 * Changes:
 *  - Modified to update fog of war.
 */

import { Game_Map } from "./map";

declare const $gameMap: Game_Map;

export declare class Game_Character {
    update(): void;

    lightUpFogOfWar(): void;
    fogOfWarRange(): number;
}

const _Game_Character_update = Game_Character.prototype.update;
Game_Character.prototype.update = function(...args) {
    _Game_Character_update.apply(this, args);
    this.lightUpFogOfWar();
};

Game_Character.prototype.lightUpFogOfWar = function() {
    const range = this.fogOfWarRange();
    if (range <= 0) return;
    $gameMap.fogOfWar.lightUp(this.x, this.y, range);
};

Game_Character.prototype.fogOfWarRange = function() {
    return 0;
};

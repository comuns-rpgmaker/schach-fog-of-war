/**
 * Patches to the Spriteset_Map class.
 * 
 * Changes:
 * - Added fog of war sprite.
 */

import { Graphics } from "rmmz";
import { FogOfWar } from "core";
import { Game_Map } from "patch/game";

declare const $gameMap: Game_Map;

declare class Spriteset_Map {
    private _fogOfWar: FogOfWar;

    createUpperLayer(): void;
    createFogOfWar(): void;

    update(): void;
    updateFogOfWar(): void;
}

const _Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function(...args) {
    _Spriteset_Map_createUpperLayer.apply(this, args);
    this.createFogOfWar();
};

Spriteset_Map.prototype.createFogOfWar = function() {
    this._fogOfWar = new FogOfWar();
    this.addChild(this._fogOfWar);
};

const _Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function(...args) {
    _Spriteset_Map_update.apply(this, args);
    this.updateFogOfWar();
};

Spriteset_Map.prototype.updateFogOfWar = function() {
    const tileWidth = $gameMap.tileWidth(), tileHeight = $gameMap.tileHeight();
    const x = $gameMap.displayX(), y = $gameMap.displayY();

    this._fogOfWar.x = -x * tileWidth;
    this._fogOfWar.y = -y * tileHeight;
    const
        startX = Math.floor(x),
        startY = Math.floor(y),
        width = Math.floor(Graphics.width / tileWidth),
        height = Math.floor(Graphics.height / tileHeight);

    this._fogOfWar.setVisibleArea(startX - 1, startY - 1, startX + width + 1, startY + height + 1)
};

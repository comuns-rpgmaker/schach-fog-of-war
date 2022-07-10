/**
 *  Patches to the game object class for a map.
 *
 * Changes:
 *  - Added fog of war game object instance.
 */

import { RPG } from "rmmz";
import { Game_FogOfWar } from "game";

declare const $dataMap: RPG.DataMap;

export declare class Game_Map {
    fogOfWar: Game_FogOfWar;

    initialize(): void;
    setupEvents(): void;

    setupFogOfWar(): void;

    displayX(): number;
    displayY(): number;
    tileWidth(): number;
    tileHeight(): number;
    
    height(): number;
    width(): number;
}

export declare const $gameMap: Game_Map;

const _Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function(...args) {
    _Game_Map_initialize.apply(this, args);
    this._fogOfWar = new Game_FogOfWar();
};

// Note: this is kinda out of place here, but we need to make sure the
//  FoW is setup before the events, and this was the best way I could
//  find to do this.
const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
Game_Map.prototype.setupEvents = function(...args) {
    this.setupFogOfWar();
    _Game_Map_setupEvents.apply(this, args);
};

const FOW_REGEX_MAP_FOW = /\[\s*FoW\s*\]/ig;

Game_Map.prototype.setupFogOfWar = function() {
    if ($dataMap.note.match(FOW_REGEX_MAP_FOW)) {
        this._fogOfWar.reset(this.width(), this.height());
        this._fogOfWar.fill();
    } else {
        this._fogOfWar.reset(0, 0);
    }
};

Object.defineProperties(Game_Map.prototype, {
    fogOfWar: {
        get: function() {
            return this._fogOfWar;
        }
    }
});

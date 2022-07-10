/**
 * Patches to the Game_System class.
 *
 * Changes:
 *  - Added player vision range property.
 *  - Added fog tint property.
 */

import { Game_System as _Game_System } from "rmmz";

import pluginParams from "parameters";

export declare class Game_System extends _Game_System {
    setPlayerVisionRange(range: number): void;
    playerVisionRange(): number;

    setFogTint(red: number, green: number, blue: number): void;
    fogTint(): { red: number, green: number, blue: number };

    setFogDispersionTime(time: number): void;
    fogDispersionTime(): number;
}

const _Game_System_initialize = _Game_System.prototype.initialize;
Game_System.prototype.initialize = function(...args) {
    _Game_System_initialize.apply(this, args);
    this._playerVisionRange = pluginParams.playerVisionRange;
    this._fogTint = pluginParams.fogTint;
    this._fogDispersionTime = pluginParams.fogDispersionTime;
};

Game_System.prototype.setPlayerVisionRange = function(range) {
    this._playerVisionRange = range;
};

Game_System.prototype.playerVisionRange = function() {
    return this._playerVisionRange;
};

Game_System.prototype.setFogTint = function(red, green, blue) {
    this._fogTint = { red, green, blue };
};

Game_System.prototype.fogTint = function() {
    return this._fogTint;
};

Game_System.prototype.setFogDispersionTime = function(time) {
    this._fogDispersionTime = time;
};

Game_System.prototype.fogDispersionTime = function() {
    return this._fogDispersionTime;
};

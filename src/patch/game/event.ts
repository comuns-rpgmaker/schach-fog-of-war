/**
 * Patches to the Game_Event class.
 * 
 * Changes:
 *  - Modified to update fog of war.
 */

import type { Game_Character } from "./character";

export declare class Game_Event extends Game_Character {
    setupPage(): void;
    setupFogOfWar(): void;
}

const _Game_Event_setupPage = Game_Event.prototype.setupPage;
Game_Event.prototype.setupPage = function(...args) {
    _Game_Event_setupPage.apply(this, args);
    this.setupFogOfWar();
};

const FOW_REGEX_EVENT_LIGHT_SOURCE = /\[\s*FoW\s+light\s+source\s+\(range\s*=\s*(\d+)\)\s*\]/i;
    
Game_Event.prototype.setupFogOfWar = function() {
    this._fogOfWarRange = 0;
    const list = this.list();
    const comments = list.filter(cmd => cmd.code === 108 || cmd.code === 408);
    for (const cmd of comments) {
        const comment = cmd.parameters[0];
        const g = comment.match(FOW_REGEX_EVENT_LIGHT_SOURCE);
        if (!g) continue;
        const range = Number(g[1]);
        this._fogOfWarRange = range;
    }
};

Game_Event.prototype.fogOfWarRange = function() {
    return this._fogOfWarRange;
};

import { Game_System } from "patch/game/system";
import { Rect } from "utils";

declare const $gameSystem: Game_System;

export class Game_FogOfWar {
    private static readonly FOW_MAX_DARKNESS = 0xff;

    private _width: number;
    private _height: number;
    private _data: Uint8Array;
    private _invalidated: boolean;

    constructor() {
        this._width = 0;
        this._height = 0;
        this._data = new Uint8Array(0);
        this._invalidated = false;
    }

    static from(width: number, height: number, contourRects: Rect[][], contourValues: number[]): Game_FogOfWar {
        const fog = new Game_FogOfWar();
        fog.reset(width, height);
        fog._data.fill(Game_FogOfWar.FOW_MAX_DARKNESS);

        const contours = contourValues
            .map((value, i) => [value, contourRects[i]] as [number, Rect[]])
            .sort(([a,], [b,]) => b - a);

        for (const [value, rects] of contours) {
            for (const [left, top, right, bottom] of rects) {
                for (let j = top; j <= bottom; j++) {
                    for (let i = left; i <= right; i++) {
                        fog._data[i + j * width] = value * Game_FogOfWar.FOW_MAX_DARKNESS;
                    }
                }
            }
        }

        return fog;
    }

    reset(width: number, height: number): void {
        this._width = width;
        this._height = height;
        this._data = new Uint8Array(width * height);
        this._invalidated = true;
    }

    fill(): void {
        this._data.fill(Game_FogOfWar.FOW_MAX_DARKNESS);
        this._invalidated = true;
    }

    at(x: number, y: number): number {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) return 0;
        return this._data[x + y * this._width] / Game_FogOfWar.FOW_MAX_DARKNESS;
    }

    lightUp(x: number, y: number, radius: number): void {
        const
            left    = Math.max(0,                   Math.floor(x - radius)),
            right   = Math.min(this._width - 1,     Math.ceil(x + radius)),
            top     = Math.max(0,                   Math.floor(y - radius)),
            bottom  = Math.min(this._height - 1,    Math.ceil(y + radius));

        let changed = false;

        for (let i = left; i <= right; i++) {
            for (let j = top; j <= bottom; j++) {
                const dx = i - x, dy = j - y;
                const idx = i + j * this._width;
                const intensity = this._lightIntensity(radius, dx, dy);
                if (intensity === 0) continue;
                if (this._data[idx] === 0) continue;
                changed = true;
                const fogDelta = intensity * Game_FogOfWar.FOW_MAX_DARKNESS / (60 *  $gameSystem.fogDispersionTime());
                this._data[idx] = Math.max(0, this._data[idx] - fogDelta)|0;
            }
        }

        if (changed) {
            this._invalidated = true;
        }
    }

    private _lightIntensity(radius: number, dx: number, dy: number): number { 
        const d = Math.hypot(dx, dy);
        return 1 - Math.min(1, d / radius);
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get invalidated(): boolean {
        return this._invalidated;
    }

    revalidate(): void {
        this._invalidated = false;
    }

    data(): Uint8Array {
        return this._data;
    }
}

/**
 * Patches to JsonEx.
 * 
 * Changes:
 *  - Optimize fog of war encoding.
 */

import { Game_FogOfWar } from "game";
import { RectCover } from "utils";

import pluginParams from "parameters";

declare class JsonEx {
    static _encode(value: unknown, depth: number): string
    static _decode(value: unknown): unknown
}

const _JsonEx_encode = JsonEx._encode;
JsonEx._encode = function(value, depth): string {
    if (typeof value === "object" && !(value instanceof Array) && value != null) {
        const constructor = value.constructor;
        value = Object.assign({}, value);
        Object.setPrototypeOf(value, constructor.prototype);
    }

    if (value instanceof Game_FogOfWar) {
        const width = value.width;
        const height = value.height;
        const contours = pluginParams.advanced.saveRectCoverThresholds.map(threshold => {
            const cover = new RectCover(value as Game_FogOfWar, threshold);
            return cover.minimize();
        });
        return _JsonEx_encode.call(this, { '@': 'Game_FogOfWar', width, height, contours }, depth + 1);
    }

    return _JsonEx_encode.call(this, value, depth);
};

const _JsonEx_decode = JsonEx._decode;
JsonEx._decode = function(value): unknown {
    if (typeof value === "object" && value != null) {
        if (value["@"] === 'Game_FogOfWar') {
            return Game_FogOfWar.from(
                value['width'],
                value['height'],
                value['contours'],
                pluginParams.advanced.saveRectCoverThresholds);
        }
    }
    return _JsonEx_decode.call(this, value);
};

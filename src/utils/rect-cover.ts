import { Rect } from "./rect";
import { RectTrie } from "./rect-trie";

export type Grid = {
    width: number,
    height: number,
    at(x: number, y: number): number
}

type Strip = { x: number, top: number, bottom: number };

export class RectCover {
    private readonly _grid: Grid
    private readonly _threshold: number;

    constructor(grid: Grid, threshold: number) {
        this._grid = grid;
        this._threshold = threshold;
    }

    private _slice(): Strip[] {
        const strips: Strip[] = [];

        for (let x = 0; x < this._grid.width; x++) {
            for (let y = 0; y < this._grid.height; y++) {
                const sy = y;

                while (this._grid.at(x, y) <= this._threshold) y++;

                if (sy != y) {
                    strips.push({
                        x,
                        top: sy,
                        bottom: y - 1
                    });
                }
            }
        }
        
        return strips;
    }

    minimize(): RectTrie<number> {
        const strips = this._slice();
        const rectangles = new RectTrie<number>();
        for (const { x: sx, top, bottom } of strips) {
            const rect: Rect = [sx, top, sx, bottom];

            let x = sx;
            right: while (x < this._grid.width) {
                for (let y = top; y <= bottom; y++) {
                    if (this._grid.at(x, y) > this._threshold) break right;
                }
                x++;
            }
            rect[2] = x - 1;

            x = sx;
            left: while (x >= 0) {
                for (let y = top; y <= bottom; y++) {
                    if (this._grid.at(x, y) > this._threshold) break left;
                }
                x--;
            }
            rect[0] = x + 1;

            rectangles.insert(rect, this._threshold);
        }
        return rectangles;
    }
}

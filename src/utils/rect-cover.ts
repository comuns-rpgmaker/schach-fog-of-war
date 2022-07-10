import { Rect } from "./rect";
import { RectTrie } from "./rect-trie";

export type Grid = {
    width: number,
    height: number,
    at(x: number, y: number): number
}

type Strip = { x: number, top: number, bottom: number };

export class RectCover {
    private _grid: Grid

    constructor(grid: Grid) {
        this._grid = grid;
    }

    private _slice(): Strip[] {
        const strips: Strip[] = [];

        for (let x = 0; x < this._grid.width; x++) {
            for (let y = 0; y < this._grid.height; y++) {
                const sy = y;

                while (this._grid.at(x, y))
                    y++;

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

    minimize(): Rect[] {
        const strips = this._slice();
        const rectangles = new RectTrie();
        for (const { x: sx, top, bottom } of strips) {
            const rect: Rect = [top, bottom, 0, 0];

            let x = sx;
            right: while (x < this._grid.width) {
                for (let y = top; y <= bottom; y++)
                    if (!this._grid.at(x, y)) break right;
                
                x++;
            }
            rect[2] = x - 1;

            x = sx;
            left: while (x >= 0) {
                for (let y = top; y <= bottom; y++)
                    if (!this._grid.at(x, y)) break left;
                x--;
            }
            rect[0] = x + 1;

            rectangles.insert(rect);
        }
        return [...rectangles];
    }
}

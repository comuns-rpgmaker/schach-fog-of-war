import { Rect } from "./rect";

export class RectTrie {
    private _root: RectTrieNode

    constructor() {
        this._root = new RectTrieNode();
    }

    insert([ left, top, right, bottom ]: Rect): void {
        let node = this._root;
        node = node.insert(left);
        node = node.insert(top);
        node = node.insert(right);
        node.insert(bottom);
    }

    *[Symbol.iterator](): Iterator<Rect> {
        for (const [left, a] of this._root) {
            for (const [top, b] of a) {
                for (const [right, c] of b) {
                    for (const [bottom,] of c) {
                        yield [ left, top, right, bottom ];
                    }
                }
            }
        }
    }
}

class RectTrieNode {
    private _children: RectTrieNode[];

    constructor() {
        this._children = [];
    }

    child(n: number) {
        return this._children[n];
    }

    insert(n: number) {
        if (!this._children[n]) {
            this._children[n] = new RectTrieNode();
        }

        return this._children[n];
    }

    *[Symbol.iterator](): Iterator<[number, RectTrieNode]> {
        for (const [value, child] of Object.entries(this._children)) {
            yield [Number(value), child];
        }
    }
}

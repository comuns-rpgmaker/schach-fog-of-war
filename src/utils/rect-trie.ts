import { Rect } from "./rect";

export type RectTrieArray<V> =
    [
        left: number,
        children: [
            top: number,
            children: [
                right: number,
                children: [
                    bottom: number,
                    value: V
                ][]
            ][]
        ][]
    ][];

export class RectTrie<V> {
    private _root: RectTrieNode<V>

    constructor() {
        this._root = new RectTrieNode<V>();
    }

    insert(key: Rect, value: V, combine: (a: V, b: V) => V = (_, b) => b): void {
        let node = this._root;
        for (const symbol of key) {
            node = node.next(symbol);
        }
        node.update(value, combine);
    }

    merge(other: RectTrie<V>, combine: (a: V, b: V) => V = (_, b) => b): void {
        for (const [key, value] of other) {
            this.insert(key, value, combine);
        }
    }

    encode(): RectTrieArray<V> {
        const arr: RectTrieArray<V> = [];
        for (const [left, t] of this._root.entries()) {
            const l1: (typeof arr)[0][1] = []
            for (const [top, r] of t.entries()) {
                const l2: (typeof l1)[0][1] = []
                for (const [right, b] of r.entries()) {
                    const l3: (typeof l2)[0][1] = []
                    for (const [bottom, value] of b.values()) {
                        l3.push([bottom, value]);
                    }
                    l2.push([right, l3]);
                }
                l1.push([top, l2]);
            }
            arr.push([left, l1]);
        }
        return arr;
    }

    static decode<V>(arr: RectTrieArray<V>): RectTrie<V> {
        const trie: RectTrie<V> = new RectTrie<V>();
        for (const [left, t] of arr) {
            for (const [top, r] of t) {
                for (const [right, b] of r) {
                    for (const [bottom, value] of b) {
                        trie.insert([left, top, right, bottom], value);
                    }
                }
            }
        }
        return trie;
    }

    *[Symbol.iterator](): Iterator<[Rect, V]> {
        for (const [left, t] of this._root.entries()) {
            for (const [top, r] of t.entries()) {
                for (const [right, b] of r.entries()) {
                    for (const [bottom, value] of b.values()) {
                        yield [[left, top, right, bottom], value];
                    }
                }
            }
        }
    }
}

class RectTrieNode<V> {
    private _children: RectTrieNode<V>[];
    private _value: V | undefined;

    constructor() {
        this._children = [];
        this._value = undefined;
    }

    child(n: number) {
        return this._children[n];
    }

    *entries(): Generator<[number, RectTrieNode<V>]>  {
        for (const symbol in this._children) {
            const node = this._children[symbol];
            yield [symbol as unknown as number, node];
        }
    }

    *values(): Generator<[number, V]> {
        for (const [symbol, node] of this.entries()) {
            if (node._value === undefined) continue;
            yield [symbol as unknown as number, node._value];
        }
    }

    next(n: number): RectTrieNode<V> {
        if (!this._children[n]) {
            this._children[n] = new RectTrieNode();
        }

        return this._children[n];
    }

    update(value: V, combine: (a: V, b: V) => V = (_, b) => b): V {
        if (this._value === undefined) {
            return this._value = value;
        }

        return this._value = combine(this._value, value);
    }
}

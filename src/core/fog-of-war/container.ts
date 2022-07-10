import { Game_Map, Game_System } from "patch/game";

declare const $gameMap: Game_Map;
declare const $gameSystem: Game_System;

import { Rect } from "utils";
import { FogOfWarRenderer } from "./renderer";
import { FogOfWarResource } from "./resource";

export class FogOfWar extends PIXI.Container {
    private static readonly FOW_VERTEX_STRIDE = 2 * 4;

    private _indexBuffer: PIXI.Buffer;
    private _indexArray: Uint16Array | Uint32Array;
    private _vertexBuffer: PIXI.Buffer;
    private _vertexArray: Float32Array;
    private _vao: PIXI.Geometry;
    private _visibleArea: Rect;
    private _resource: FogOfWarResource;
    private _texture: PIXI.BaseTexture;

    constructor() {
        super();
        this._indexArray = new Uint16Array(0);
        this._vertexArray = new Float32Array(0);
        this._visibleArea = [0, 0, 0, 0];
        this._createVao();
        this.refresh();
    }

    private _createVao(): void {
        // @ts-ignore
        const ib = new PIXI.Buffer(null, true, true);
        // @ts-ignore
        const vb = new PIXI.Buffer(null, false, false);
        const stride = FogOfWar.FOW_VERTEX_STRIDE;
        const type = PIXI.TYPES.FLOAT;
        const geometry = new PIXI.Geometry();
        this._indexBuffer = ib;
        this._vertexBuffer = vb;
        this._vao = geometry
            .addIndex(this._indexBuffer)
            .addAttribute("aVertexPosition", vb, 2, false, type, stride, 0);
    }

    refresh(): void {
        this._resetVertexBuffer();
        this._setupTexture();
    }

    private _setupTexture(): void {
        this._resource = new FogOfWarResource($gameMap.fogOfWar);
        this._texture = new PIXI.BaseTexture(this._resource, {
            // @ts-ignore
            scaleMode: PIXI.SCALE_MODES.BILINEAR
        });
    }

    destroy(): void {
        this._vao?.destroy();
        this._indexBuffer?.destroy();
        this._vertexBuffer?.destroy();
        this._texture?.destroy();
        this._resource?.destroy();
    }

    render(renderer: PIXI.Renderer): void {
        const gl = renderer.gl;
        const fowRenderer: FogOfWarRenderer = renderer.plugins.fow;
        const shader = fowRenderer.shader;
        const matrix: PIXI.Matrix = shader.uniforms.uProjectionMatrix;

        this._setUniforms(shader);

        renderer.batch.setObjectRenderer(fowRenderer);
        renderer.projection.projectionMatrix.copyTo(matrix);
        matrix.append(this.worldTransform);
        renderer.shader.bind(shader);

        if ($gameMap.fogOfWar.invalidated) {
            this._texture.update();
            $gameMap.fogOfWar.revalidate();
        }

        renderer.texture.bind(this._texture, 0);
        this._updateIndexBuffer();
        renderer.geometry.bind(this._vao, shader);
        // renderer.geometry.updateBuffers();

        const [l, t, r, b] = this._visibleArea;
        const numElements = (r - l + 2) * (b - t + 2);
        if (numElements > 0) {
            renderer.geometry.draw(gl.TRIANGLES, numElements * 6, 0);
        }
    }

    private _setUniforms(shader: PIXI.Shader): void {
        const tileSize: ArrayBuffer = shader.uniforms.uGridSize;
        tileSize[0] = $gameMap.tileWidth();
        tileSize[1] = $gameMap.tileHeight();

        const mapSize: ArrayBuffer = shader.uniforms.uMapSize;
        mapSize[0] = $gameMap.width();
        mapSize[1] = $gameMap.height();
        
        const tint: ArrayBuffer = shader.uniforms.uTint;
        const { red, green, blue } = $gameSystem.fogTint();
        tint[0] = red;
        tint[1] = green;
        tint[2] = blue;
    }

    private _updateIndexBuffer(): void {
        const [l, t, r, b] = this._visibleArea;
        const numElements = (r - l + 2) * (b - t + 2);
        if (this._indexArray.length < numElements * 6 * 2) {
            this._indexArray = PIXI.utils.createIndicesForQuads(numElements * 2);
            this._indexBuffer.update(this._indexArray);
        }
    }

    private _resetVertexBuffer(): void {
        const [l, t, r, b] = this._visibleArea;
        const required = (r - l + 2) * (b - t + 2) * FogOfWar.FOW_VERTEX_STRIDE;
        if (this._vertexArray.length < required * 2) {
            this._vertexArray = new Float32Array(required * 2);
        }
        const vertexArray = this._vertexArray;
        let index = 0;
        for (let y = t - 1; y <= b; y++) {
            for (let x = l - 1; x <= r; x++) {
                if (x < 0 || x >= $gameMap.fogOfWar.width) continue;
                if (y < 0 || y >= $gameMap.fogOfWar.height) continue;
                vertexArray[index++] = x;
                vertexArray[index++] = y;
                vertexArray[index++] = x + 1;
                vertexArray[index++] = y;
                vertexArray[index++] = x + 1;
                vertexArray[index++] = y + 1;
                vertexArray[index++] = x;
                vertexArray[index++] = y + 1;
            }
        }
        this._vertexBuffer.update(vertexArray);
    }

    setVisibleArea(l: number, t: number, r: number, b: number): void { 
        const [ol, ot, or, ob] = this._visibleArea;
        if (ol === l && ot === t && or === r && ob === b) return;
        this._visibleArea = [l, t, r, b];
        this._resetVertexBuffer();
    }
}

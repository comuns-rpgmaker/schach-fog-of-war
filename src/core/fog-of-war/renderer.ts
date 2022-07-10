import vertexSrc from "../../shaders/fog-of-war/vertex.vert";
import fragmentSrc from "../../shaders/fog-of-war/bicubic.frag";

export class FogOfWarRenderer extends PIXI.ObjectRenderer {
    private _shader: PIXI.Shader

    constructor(renderer: PIXI.Renderer) {
        super(renderer);
        this.contextChange();
    }

    contextChange(): void {
        this._shader = this._createShader();
    }

    private _createShader(): PIXI.Shader {
        return PIXI.Shader.from(vertexSrc, fragmentSrc, {
            uProjectionMatrix: new PIXI.Matrix(),
            uTint: new Float32Array([0, 0, 0]),
            uDarkness: 0,
            uGridSize: new Float32Array([48, 48]),
            uMapSize: new Float32Array([0, 0])
        });
    }

    get shader(): PIXI.Shader {
        return this._shader;
    }

    destroy(): void {
        super.destroy();
        // @ts-ignore
        this._shader.destroy();
    }
}

PIXI.Renderer.registerPlugin("fow", (renderer: PIXI.Renderer) => new FogOfWarRenderer(renderer));

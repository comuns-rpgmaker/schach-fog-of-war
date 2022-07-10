import { Game_FogOfWar } from "game";

export class FogOfWarResource extends PIXI.resources.Resource {
    private _fogOfWar: Game_FogOfWar
    
    constructor(fogOfWar: Game_FogOfWar) {
        super(fogOfWar.width, fogOfWar.height);
        this._fogOfWar = fogOfWar;
    }

    upload(renderer: PIXI.Renderer, baseTexture: PIXI.BaseTexture, glTexture: PIXI.GLTexture): boolean {
        const { width, height } = this;
        glTexture.width = width;
        glTexture.height = height;
    
        const { gl } = renderer;

        gl.pixelStorei(gl.UNPACK_ALIGNMENT, baseTexture.alphaMode);
        gl.texImage2D(
            baseTexture.target,
            0,
            // @ts-ignore
            gl.R8,
            width,
            height,
            0,
            // @ts-ignore
            gl.RED,
            gl.UNSIGNED_BYTE,
            this._fogOfWar.data());
    
        this._fogOfWar.revalidate();
        return true;
    }
}

import { CoreRender } from "../index";
import { DrawImage, RenderCoordsResult } from "../../models/index";
export class ImageRender extends CoreRender<DrawImage, RenderCoordsResult> {
    async doRender(): Promise<RenderCoordsResult> {
        const img = new Image();
        img.src = this.data.src;
        return new Promise((resolve, reject) => {
            img.addEventListener("load", () => {
                if (!this.data.srcCoords.size) {
                    this.data.srcCoords.size = { width: img.width, height: img.height };
                }
                if (!this.data.destCoords.size) {
                    this.data.destCoords.size = this.data.srcCoords.size;
                }
                this.context.drawImage(
                    img,
                    this.data.srcCoords.pos.x, this.data.srcCoords.pos.y,
                    this.data.srcCoords.size.width, this.data.srcCoords.size.height,
                    this.data.destCoords.pos.x, this.data.destCoords.pos.y,
                    this.data.destCoords.size.width, this.data.destCoords.size.height
                );
                resolve({ success: true, result: this.data.destCoords });
            });
            img.addEventListener("error", e => {
                reject(e);
            });
        });
    }
}

import { CoreRender } from "./CoreRender";
import { RenderCoordsResult, DrawRect, CoordinateData } from "../models/index";
export class RectRender extends CoreRender<DrawRect, RenderCoordsResult> {
    async render(): Promise<RenderCoordsResult> {
        return new Promise((resolve, reject) => {
            this.updateFillStyle(this.data.fill);
            this.context.fillRect(this.data.pos.x, this.data.pos.y, this.data.size.width, this.data.size.height);
            resolve({ success: true, result: new CoordinateData(this.data.pos, this.data.size) });
        });
    }
}

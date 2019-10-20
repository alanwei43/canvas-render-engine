import { CoreRender } from "./CoreRender";
import { RenderCoordsResult, DrawRect, CoordinateData } from "../models/index";
export class RectRender extends CoreRender<DrawRect, RenderCoordsResult> {
    async render(): Promise<RenderCoordsResult> {
        return new Promise((resolve, reject) => {
            let call = this.context.fillRect;
            if (this.updateFillStyle(this.data.fill)) {
                call = this.context.fillRect;
            }
            if (this.updateStrokeStyle(this.data.stroke)) {
                call = this.context.strokeRect;
            }
            call.apply(this.context, [this.data.pos.x, this.data.pos.y, this.data.size.width, this.data.size.height]);
            resolve({ success: true, result: new CoordinateData(this.data.pos, this.data.size) });
        });
    }
}

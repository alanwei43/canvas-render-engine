import { CoreRender } from "./CoreRender";
import { RenderCoordsResult, DrawRect, CoordinateData, DrawType } from "../models/index";
export class RectRender extends CoreRender<DrawRect, RenderCoordsResult> {
    async doRender(): Promise<RenderCoordsResult> {
        return new Promise((resolve, reject) => {
            this.updateFillStyle(this.data.fill);
            this.updateStrokeStyle(this.data.stroke)
            
            if (this.data.drawType === DrawType.Fill) {
                this.context.fillRect(this.data.pos.x, this.data.pos.y, this.data.size.width, this.data.size.height);
            }
            if (this.data.drawType === DrawType.Stroke) {
                this.context.strokeRect(this.data.pos.x, this.data.pos.y, this.data.size.width, this.data.size.height);
            }
            resolve({ success: true, result: new CoordinateData(this.data.pos, this.data.size) });
        });
    }
}

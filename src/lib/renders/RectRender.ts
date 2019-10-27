import { CoreRender } from "../index";
import { RenderCoordsResult, DrawRect, CoordinateData, DrawType } from "../../models/index";
export class RectRender extends CoreRender<DrawRect, RenderCoordsResult> {
    async doRender(): Promise<RenderCoordsResult> {
        return new Promise((resolve, reject) => {
            this.updateFillStyle(this.data.fillStyle);
            this.updateStrokeStyle(this.data.strokeStyle)
            
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

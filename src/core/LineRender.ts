import { CoreRender } from "./CoreRender";
import { RenderCoordsResult, DrawLine, DrawType } from "../models/index";

export class LineRender extends CoreRender<DrawLine, RenderCoordsResult>{
    doRender(): Promise<RenderCoordsResult> {
        this.updateFillStyle(this.data.fill);
        this.updateStrokeStyle(this.data.stroke)

        if (typeof this.data.lineWidth === "number") {
            this.context.lineWidth = this.data.lineWidth;
        }
        this.context.beginPath();
        this.data.positions.forEach((pos, index) => {
            if (index === 0) {
                this.context.moveTo(pos.x, pos.y);
            } else {
                this.context.lineTo(pos.x, pos.y);
            }
        });
        if (this.data.closePath) {
            this.context.closePath();
        }

        if (this.data.drawType === DrawType.Fill) {
            this.context.fill();
        }
        if (this.data.drawType === DrawType.Stroke) {
            this.context.stroke();
        }
        return Promise.resolve(new RenderCoordsResult());
    }
}
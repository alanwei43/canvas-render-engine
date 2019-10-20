import { CoreRender } from "./CoreRender";
import { RenderCoordsResult, DrawLine } from "../models/index";

export class LineRender extends CoreRender<DrawLine, RenderCoordsResult>{
    render(): Promise<RenderCoordsResult> {
        let call = this.context.stroke;
        if (this.updateFillStyle(this.data.fill)) {
            call = this.context.fill;
        }
        if (this.updateStrokeStyle(this.data.stroke)) {
            call = this.context.stroke;
        }
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
        call.apply(this.context);
        return Promise.resolve(new RenderCoordsResult());
    }
}
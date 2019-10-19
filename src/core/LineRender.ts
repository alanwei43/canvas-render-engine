import { CoreRender } from "./CoreRender";
import { RenderCoordsResult, DrawLine } from "../models/index";

export class LineRender extends CoreRender<DrawLine, RenderCoordsResult>{
    render(): Promise<RenderCoordsResult> {
        this.context.beginPath();
        this.data.positions.forEach((pos, index) => {
            if (index === 0) {
                this.context.moveTo(pos.x, pos.y);
            } else {
                this.context.lineTo(pos.x, pos.y);
            }
        });
        this.context.lineWidth = 0.5;
        this.context.strokeStyle = "#333";
        if (this.data.closePath) {
            this.context.closePath();
        }
        if (this.data.stroke) {
            this.context.stroke();
        }
        if (this.data.fill) {
            this.context.fill();
        }
        return Promise.resolve(new RenderCoordsResult());
    }
}
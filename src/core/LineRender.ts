import { CoreRender } from "./CoreRender";
import { RenderCoordsResult, DrawLine, DrawType, CoordinateData } from "../models/index";

export class LineRender extends CoreRender<DrawLine, RenderCoordsResult>{
    doRender(): Promise<RenderCoordsResult> {
        this.updateFillStyle(this.data.fillStyle);
        this.updateStrokeStyle(this.data.strokeStyle)

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
            console.log("this.data.closePath: ", this.data.closePath);
            this.context.closePath();
        }

        if (this.data.drawType === DrawType.Fill) {
            this.context.fill();
        }
        if (this.data.drawType === DrawType.Stroke) {
            this.context.stroke();
        }
        let minPosX = 0, minPosY = 0, maxPosX = 0, maxPosY = 0;
        this.data.positions.forEach(pos => {
            if (pos.x < minPosX) {
                minPosX = pos.x;
            }
            if (pos.x > maxPosX) {
                maxPosX = pos.x;
            }

            if (pos.y < minPosY) {
                minPosY = pos.y;
            }
            if (pos.y > maxPosY) {
                maxPosY = pos.y;
            }
        });

        const renderResult = new RenderCoordsResult();
        renderResult.success = true;
        renderResult.result = CoordinateData.init({
            x: minPosX,
            y: minPosY
        }, {
            x: maxPosX,
            y: maxPosY
        });
        return Promise.resolve(renderResult);
    }
}
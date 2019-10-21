import { DrawText, RenderCoordsResult, CoordinateData, DrawType, TextAlignType } from "../models/index";
import { CoreRender } from "./CoreRender";
export class TextRender extends CoreRender<DrawText, RenderCoordsResult> {
    async doRender(): Promise<RenderCoordsResult> {
        this.updateFont(this.data.font);
        this.updateFillStyle(this.data.fillStyle);

        const textWidth = this.context.measureText(this.data.font.text).width;
        let destX = this.data.pos.x;
        
        if (this.data.font.align === TextAlignType.Right) {
            destX = this.context.canvas.width - this.data.pos.x - textWidth;
        }
        if(this.data.font.align === TextAlignType.Center){
            destX = this.data.pos.x - (textWidth / 2);
        }

        const destY = this.data.pos.y + this.data.font.size;

        if (this.data.drawType === DrawType.Fill) {
            this.context.fillText(this.data.font.text, destX, destY);
        }
        if (this.data.drawType === DrawType.Stroke) {
            this.context.strokeText(this.data.font.text, destX, destY);
        }
        const result: RenderCoordsResult = {
            success: true,
            result: new CoordinateData({
                x: destX,
                y: this.data.pos.y
            }, {
                height: this.data.font.size,
                width: textWidth
            })
        };
        return Promise.resolve(result);
    }
}

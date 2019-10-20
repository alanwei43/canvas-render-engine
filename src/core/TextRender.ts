import { DrawText, RenderCoordsResult, CoordinateData } from "../models/index";
import { CoreRender } from "./CoreRender";
export class TextRender extends CoreRender<DrawText, RenderCoordsResult> {
    textRightAlign: boolean = false
    async render(): Promise<RenderCoordsResult> {
        this.updateFont(this.data.font);
        this.updateFillStyle(this.data.fill);

        const textWidth = this.context.measureText(this.data.font.text).width;
        if (this.textRightAlign) {
            this.data.pos.x -= textWidth;
        }

        const destY = this.data.pos.y + this.data.font.size;

        this.context.fillText(this.data.font.text, this.data.pos.x, destY);
        const result: RenderCoordsResult = {
            success: true,
            result: new CoordinateData({
                x: this.data.pos.x,
                y: this.data.pos.y
            }, {
                height: this.data.font.size,
                width: textWidth
            })
        };
        return Promise.resolve(result);
    }
}

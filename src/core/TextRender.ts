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

        this.context.fillText(this.data.font.text, this.data.pos.x, this.data.pos.y);
        const result: RenderCoordsResult = {
            success: true,
            result: new CoordinateData(this.data.pos, {
                height: this.data.font.size,
                width: textWidth
            })
        };
        return Promise.resolve(result);
    }
}

import { DrawText, RenderStringResult } from "../models/index";
import { CoreRender } from "./CoreRender";
export class TextRender extends CoreRender<DrawText, RenderStringResult> {
    async render(): Promise<RenderStringResult> {
        this.updateFont(this.data.font);
        this.updateFillStyle(this.data.fill);
        this.context.fillText(this.data.font.text, this.data.pos.x, this.data.pos.y);
        return Promise.resolve({ success: true });
    }
}

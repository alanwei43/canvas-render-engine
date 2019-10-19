import { CoreRender } from "./CoreRender";
import { RenderStringResult, DrawRect } from "../models/index";
export class RectRender extends CoreRender<DrawRect, RenderStringResult> {
    async render(): Promise<RenderStringResult> {
        this.updateFillStyle(this.data.fill);
        this.context.fillRect(this.data.pos.x, this.data.pos.y, this.data.size.width, this.data.size.height);
        return Promise.resolve({ success: true });
    }
}

import { CoreRender } from "./CoreRender";
import { DrawImage, RenderResult, RenderStringResult } from "../models/index";
export class ImageRender extends CoreRender<DrawImage, RenderStringResult> {
    async render(): Promise<RenderStringResult> {
        // this.context.drawImage()
        return Promise.resolve({ success: true });
    }
}

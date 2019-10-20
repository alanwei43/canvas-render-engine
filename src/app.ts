import { RectRender, TextRender, ImageRender, CoreRender, LineRender, IRender, RenderChain } from "./core/index";
import { CoordinateData, RenderCoordsResult, DrawImage, DrawLine } from "./models/index";

const canvas1: HTMLCanvasElement = document.querySelector("#canvas1");
const context = canvas1.getContext("2d");

const chain = new RenderChain<RenderCoordsResult>();

chain.push(params => new ImageRender(context, {
    src: "./resources/280TSI.jpg",
    srcCoords: new CoordinateData({ x: 0, y: 0 }),
    destCoords: new CoordinateData({ x: 0, y: 0 }, { width: 300, height: 225 })
}), "main-image").push(params => {
    return new ImageRender(context, {
        src: "http://vw.faw-vw.com/content/dam/vw-ngw/faw-vw/homepage/site_logo/pc_logo.png",
        srcCoords: new CoordinateData({ x: 0, y: 0 }),
        destCoords: new CoordinateData({ x: 10, y: 8 })
    });
}).push(params => {
    const response = chain.getLastRenderResultById("main-image");
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x - 5, y: pos.y + 12 },
        font: { text: "大众 凌渡 280TSI DSG舒适版国VI", size: 14, family: "sans-serif" }
    });
    textRender.textRightAlign = true;
    return textRender;
}).push(params => {
    const response = chain.lastRenderResult;
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x - 50, y: pos.y + 15 },
        font: { text: "12.48万", size: 18, family: "sans-serif" },
        fill: { color: "red" }
    });
    textRender.textRightAlign = true;
    return textRender;
}).push(params => {
    const response = chain.lastRenderResult;
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: 250, y: pos.y - response.result.size.height },
        font: { text: "18.00万", size: 12, family: "sans-serif" },
        fill: { color: "gray" }
    });
    return textRender;
}).push(params => {
    const response = params.chain.lastRenderResult;
    const data: DrawLine = new DrawLine();
    data.positions = [
        { x: 250, y: response.result.getCenterPos().y + 2 },
        { x: 295, y: response.result.getCenterPos().y + 2 }];
    return new LineRender(context, data);
});
chain.execute();
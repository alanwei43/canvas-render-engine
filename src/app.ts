import { RectRender, TextRender, ImageRender, CoreRender, LineRender, IRender, RenderChain } from "./core/index";
import { CoordinateData, RenderCoordsResult, DrawImage, DrawLine, DrawRect, DrawText } from "./models/index";

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
}, "logo").push(params => {
    const response = chain.getLastRenderResultById("main-image");
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x - 5, y: pos.y + 12 },
        font: { text: "大众 凌渡 280TSI DSG舒适版国VI", size: 14, family: "sans-serif" }
    });
    textRender.textRightAlign = true;
    return textRender;
}, "title").push(params => {
    const logoResult = params.chain.getLastRenderResultById("logo").result;
    const data = new DrawRect();
    data.pos = logoResult.pos;
    data.size = logoResult.size;
    data.stroke = { color: "gray" };
    return new RectRender(context, data);
}, "rect").push(params => {
    const response = params.chain.getLastRenderResultById("title");
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x, y: pos.y + 5 },
        font: { text: "18.00万", size: 12, family: "sans-serif" },
        fill: { color: "gray" }
    });
    textRender.textRightAlign = true;
    return textRender;
}, "small-price").push(params => {
    const response = params.chain.getLastRenderResultById("small-price");
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x, y: pos.y },
        font: { text: "12.48万", size: 18, family: "sans-serif" },
        fill: { color: "red" }
    });
    textRender.textRightAlign = true;
    return textRender;
}, "large-price").push(params => {
    const response = params.chain.getLastRenderResultById("small-price");
    console.log(response);
    const data: DrawLine = new DrawLine();
    data.positions = [
        response.result.getLeftTopPos(),
        response.result.getRightTopPos(),
        response.result.getRightBottomPos(),
        response.result.getLeftBottomPos()
    ];
    data.stroke = { color: "#999" };
    data.lineWidth = 0.5;
    return new LineRender(context, data);
}).push(params => {
    const data = new DrawText();
    data.pos = { x: 0, y: 0 };
    data.font = { text: "Alan", size: 12 };
    return new TextRender(context, data);
}, "test-font");

chain.execute().then(() => {
    const result = chain.getLastRenderResultById("large-price").result;
    console.log(result.toString());
    // const result = chain.getLastRenderResultById("rect").result;
    // const center = result.getCenterPos();
    // context.fillStyle = "red";
    // context.strokeStyle = "red";
    // context.beginPath();
    // context.arc(center.x, center.y, result.size.height / 2, 0, Math.PI * 2, false);
    // context.closePath();
    // context.stroke();
});
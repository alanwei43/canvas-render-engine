import { RectRender, TextRender, ImageRender, CoreRender, LineRender, IRender, RenderChain } from "./core/index";
import { CoordinateData, RenderCoordsResult, DrawImage, DrawLine, DrawRect, DrawText, DrawType } from "./models/index";

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
    const response = chain.getRenderResultById("main-image");
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x - 5, y: pos.y + 12 },
        font: { text: "大众 凌渡 280TSI DSG舒适版国VI", size: 14, family: "sans-serif" },
        drawType: DrawType.Fill
    });
    textRender.textRightAlign = true;
    return textRender;
}, "title").push(params => {
    const logoResult = params.chain.getRenderResultById("logo").result;
    const data = new DrawRect();
    data.pos = logoResult.pos;
    data.size = logoResult.size;
    data.strokeStyle = "gray";
    return new RectRender(context, data);
}, "rect").push(params => {
    const response = params.chain.getRenderResultById("title");
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x, y: pos.y + 10 },
        font: { text: "18.00万", size: 12, family: "sans-serif" },
        fillStyle: "gray",
        drawType: DrawType.Fill
    });
    textRender.textRightAlign = true;
    return textRender;
}, "small-price").push(params => {
    const smallPriceResult = params.chain.getRenderResultById("small-price").result;
    const smallPricePos = smallPriceResult.getLeftBottomPos();
    const titleResult = params.chain.getRenderResultById("title").result;
    const titlePos = titleResult.getRightBottomPos();

    const textRender = new TextRender(context, {
        pos: { x: smallPricePos.x - 5, y: titlePos.y + 5 },
        font: { text: "12.48万", size: 18, family: "sans-serif" },
        fillStyle: "red",
        drawType: DrawType.Fill
    });
    textRender.textRightAlign = true;
    return textRender;
}, "large-price").push(params => {
    const smallPriceResult = params.chain.getRenderResultById("small-price").result;
    const data: DrawLine = new DrawLine();
    data.positions = [
        { x: smallPriceResult.getLeftTopPos().x, y: smallPriceResult.getCenterPos().y + 2 },
        { x: smallPriceResult.getRightBottomPos().x, y: smallPriceResult.getCenterPos().y + 2 }
    ];
    data.strokeStyle = "gray";
    data.drawType = DrawType.Stroke;
    data.lineWidth = .8;
    return new LineRender(context, data);
}).push(params => {
    const largePriceResult = params.chain.getRenderResultById("large-price");
    const posY = largePriceResult.result.getRightBottomPos().y + 15;
    const data: DrawLine = new DrawLine();
    data.positions = [{
        x: 5, y: posY
    }, {
        x: context.canvas.width - 5, y: posY
    }];
    data.drawType = DrawType.Stroke;
    data.lineWidth = 1;
    data.strokeStyle = "#ddd";
    return new LineRender(context, data);
}, "splitor");

chain.execute().then(() => {
    const result = chain.getRenderResultById("large-price").result;
    // console.log(result.toJSON());
    // const result = chain.getLastRenderResultById("rect").result;
    // const center = result.getCenterPos();
    // context.fillStyle = "red";
    // context.strokeStyle = "red";
    // context.beginPath();
    // context.arc(center.x, center.y, result.size.height / 2, 0, Math.PI * 2, false);
    // context.closePath();
    // context.stroke();
});
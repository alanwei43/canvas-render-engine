import { RectRender, TextRender, ImageRender, CoreRender, LineRender } from "./core/index";
import { CoordinateData, RenderCoordsResult, DrawImage, DrawLine } from "./models/index";

const canvas1: HTMLCanvasElement = document.querySelector("#canvas1");
const context = canvas1.getContext("2d");

const renders: Array<(response: RenderCoordsResult) => Promise<RenderCoordsResult>> = [];
let positions: Map<string, RenderCoordsResult> = new Map();
renders.push(() => {
    return new ImageRender(context, {
        src: "./resources/280TSI.jpg",
        srcCoords: new CoordinateData({ x: 0, y: 0 }),
        destCoords: new CoordinateData({ x: 0, y: 0 }, { width: 300, height: 225 })
    }).render();
});
renders.push((response: RenderCoordsResult) => {
    let render = new ImageRender(context, {
        src: "http://vw.faw-vw.com/content/dam/vw-ngw/faw-vw/homepage/site_logo/pc_logo.png",
        srcCoords: new CoordinateData({ x: 0, y: 0 }),
        destCoords: new CoordinateData({ x: 10, y: 8 }/*, {width: 50, height: 30}*/)
    });
    render.render();
    return Promise.resolve(response);
});
renders.push((response: RenderCoordsResult) => {
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x - 5, y: pos.y + 12 },
        font: { text: "大众 凌渡 280TSI DSG舒适版国VI", size: 14, family: "sans-serif" }
    });
    textRender.textRightAlign = true;
    return textRender.render();
});

renders.push((response: RenderCoordsResult) => {
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x - 50, y: pos.y + 15 },
        font: { text: "12.46万", size: 18, family: "sans-serif" },
        fill: { color: "red" }
    });
    textRender.textRightAlign = true;
    return textRender.render();
});
renders.push((response: RenderCoordsResult) => {
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: 250, y: pos.y - response.result.size.height },
        font: { text: "18.00万", size: 12, family: "sans-serif" },
        fill: { color: "gray" }
    });
    return textRender.render();
});
renders.push(response => {
    const data: DrawLine = new DrawLine();
    data.positions = [
        { x: 250, y: response.result.getCenterPos().y + 2 },
        { x: 295, y: response.result.getCenterPos().y + 2 }];
    return new LineRender(context, data).render();
});
// renders.push(response => {
//     const data: DrawLine = new DrawLine();
//     data.positions = [{ x: 10, y: 20 }, { x: 10, y: 50 }, { x: 50, y: 50 }];
//     data.closePath = false;
//     const lineR = new LineRender(context, data);
//     return lineR.render();
// });

renders.reduce((prev, next) => {
    return prev.then(response => next(response));
}, Promise.resolve(new RenderCoordsResult()));
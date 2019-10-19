import { RectRender, TextRender, ImageRender } from "./core/index";
import { CoordinateData } from "./models/index";

const context = document.querySelector("canvas").getContext("2d");


new ImageRender(context, {
    src: "https://www.baidu.com/img/bd_logo1.png?where=super",
    srcCoords: new CoordinateData({ x: 0, y: 0 }),
    destCoords: new CoordinateData({ x: 10, y: 10 })
}).render().then(response => {
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: pos.x, y: pos.y + 12 },
        font: { text: "hello world: " + new Date().toISOString(), size: 12, family: "sans-serif" }
    });
    textRender.textRightAlign = true;
    return textRender.render();
}).then(response => {
    return new RectRender(context, {
        // pos: { y: 16, x: response.result.getRightBottomPos().x },
        pos: response.result.getRightBottomPos(),
        size: { width: 100, height: 100 }, fill: { color: "#aaa" }
    }).render();
});
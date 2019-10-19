import { RectRender, TextRender } from "./core/index";
import { DrawText } from "./models/index";

const context = document.querySelector("canvas").getContext("2d");
const draw: DrawText = { pos: { x: 10, y: 18 }, font: { text: "hello world " + new Date().toISOString(), size: 18, family: "sans-serif" } };
const engines = [
    new TextRender(context, draw),
    new RectRender(context, { pos: { x: 10, y: 50 }, size: { width: 100, height: 100 }, fill: { color: "#aaa" } })
];

engines.forEach(e => e.render());

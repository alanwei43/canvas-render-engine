import { RectRender, TextRender, ImageRender, LineRender, RenderChain, RenderChainDirective } from "./core/index";
import { CoordinateData, RenderCoordsResult, DrawLine, DrawRect, DrawText, DrawType, TextAlignType, PositionData } from "./models/index";


const canvas1: HTMLCanvasElement = document.querySelector("#canvas1");
const context = canvas1.getContext("2d");

const directiveRender = new RenderChainDirective(context);
directiveRender.render("#canvas-temp");

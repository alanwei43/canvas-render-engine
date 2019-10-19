import { FontStyle, FillStyle } from "../models/Draw";
import { IRender } from "./IRender";

export abstract class CoreRender<TData, TResult> implements IRender<TData, TResult> {
    protected context: CanvasRenderingContext2D
    protected data: TData

    abstract render(): Promise<TResult>

    constructor(element: HTMLCanvasElement | CanvasRenderingContext2D, data: TData) {
        if (element instanceof HTMLCanvasElement) {
            this.context = element.getContext("2d");
        }
        if (element instanceof CanvasRenderingContext2D) {
            this.context = element;
        }
        this.data = data;
    }
    protected updateFont(font: FontStyle) {
        let value: string = "";
        if (font.size) {
            value += font.size + "px";
        }
        if (font.family) {
            value += " " + font.family;
        }
        this.context.font = value;
    }
    protected updateFillStyle(fillStyle: FillStyle) {
        if (fillStyle && fillStyle.color) {
            this.context.fillStyle = fillStyle.color;
        }
    }
}

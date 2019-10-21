import { FontStyle, FillStyle, StrokeStyle, StrokeFillStyleMix, DrawType } from "../models/index";
import { IRender } from "./IRender";

export abstract class CoreRender<TData, TResult> implements IRender<TResult> {
    protected context: CanvasRenderingContext2D
    protected data: TData

    abstract doRender(): Promise<TResult>
    public async render(): Promise<TResult> {
        const renderResult: TResult = await this.doRender();

        return renderResult;
    }

    constructor(element: HTMLCanvasElement | CanvasRenderingContext2D, data: TData) {
        if (element instanceof HTMLCanvasElement) {
            this.context = element.getContext("2d");
        }
        if (element instanceof CanvasRenderingContext2D) {
            this.context = element;
        }
        this.data = data;
    }
    protected updateFont(font: FontStyle): void {
        let value: string = "";
        if (font.size) {
            value += font.size + "px";
        }
        if (font.family) {
            value += " " + font.family;
        }
        this.context.font = value;
    }
    protected updateFillStyle(fill: FillStyle): boolean {
        if (fill) {
            this.context.fillStyle = fill.color;
            return true;
        }
        return false;
    }
    protected updateStrokeStyle(stroke: StrokeStyle): boolean {
        if (stroke) {
            this.context.strokeStyle = stroke.color;
            return true;
        }
        return false;
    }
}

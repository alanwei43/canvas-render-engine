import { ImageRender, RenderChain } from "./index";
import { PositionData, CoordinateData, RenderCoordsResult, SizeData, DrawText, DrawType, TextAlignType, DrawImage, DrawLine } from "../models/index";
import { TextRender } from "./index";
import { ElementConverter } from "./directives/ElementConverter";
import { Logger } from "./utils/Log";
import { FunctionContext } from "./directives/FunctionContext";
import { LineRender } from "./renders/LineRender";

export class RenderDirectives {
    private context: CanvasRenderingContext2D
    private chain: RenderChain<RenderCoordsResult>
    constructor(element: HTMLCanvasElement | CanvasRenderingContext2D) {
        if (element instanceof HTMLCanvasElement) {
            this.context = element.getContext("2d");
        }
        if (element instanceof CanvasRenderingContext2D) {
            this.context = element;
        }
    }

    async render(templateIdOrChildren: string | HTMLElement[]): Promise<string> {
        let elements: HTMLElement[] = [];
        if (typeof templateIdOrChildren === "string") {
            const template: HTMLTemplateElement = document.querySelector(templateIdOrChildren);
            elements = Array.from(template.content.children).filter(ele => ele instanceof HTMLElement) as HTMLElement[];
        }
        if (Array.isArray(templateIdOrChildren)) {
            elements = elements;
        }

        this.chain = new RenderChain<RenderCoordsResult>();
        const converter = new ElementConverter(new FunctionContext(this.chain, this.context));
        elements.forEach(element => {
            const id = element.getAttribute("id");
            if (element.nodeName === "IMG") {
                this.chain.push(params => {
                    Logger.debug("image element: ", id);
                    const data = new DrawImage();
                    converter.generateAttributes(element, data);
                    return new ImageRender(this.context, data);
                }, id);
            }
            if (element.nodeName === "TEXT") {
                this.chain.push(params => {
                    Logger.debug("text element: ", id);
                    const data = new DrawText();
                    data.font = { text: element.textContent };
                    converter.generateAttributes(element, data);
                    return new TextRender(this.context, data);
                }, id);
            }
            if (element.nodeName === "PATH") {
                this.chain.push(params => {
                    Logger.debug("path element: ", id);
                    const data = new DrawLine();
                    converter.generateAttributes(element, data);
                    return new LineRender(this.context, data);
                }, id);
            }
        });

        return this.chain.execute();
    }
}
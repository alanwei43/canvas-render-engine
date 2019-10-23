import { ImageRender, RenderChain } from "./index";
import { PositionData, CoordinateData, RenderCoordsResult, SizeData, DrawText, DrawType, TextAlignType, DrawImage } from "../models/index";
import { TextRender } from "./index";
import { ElementConverter } from "./directives/ElementConverter";
import { Logger } from "./utils/Log";

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

        const converter = new ElementConverter();
        this.chain = new RenderChain<RenderCoordsResult>();
        elements.forEach(element => {
            const id = element.getAttribute("id");
            if (element.nodeName === "IMG") {
                console.log("start")
                const data = new DrawImage();
                console.log("data: ", data);
                converter.generateAttributes(element, data);
                console.log("end")
                this.chain.push(params => {
                    return new ImageRender(this.context, data);
                }, id);
            }
        });

        return this.chain.execute();
    }
}
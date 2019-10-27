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

        Logger.debug(`总共接收到${elements.length}个元素`);

        this.chain = new RenderChain<RenderCoordsResult>();
        const converter = new ElementConverter(new FunctionContext(this.chain, this.context));
        elements.forEach((element, index) => {
            const id = element.getAttribute("id");
            const renderType = element.getAttribute("type") || element.nodeName.toLowerCase();
            Logger.debug(`第${index + 1}个元素, id: ${id}, render type: ${renderType}`);
            if (renderType === "img") {
                this.chain.push(params => {
                    Logger.debug(`[${id}] 返回 ImageRender`);
                    const data = new DrawImage();
                    converter.generateAttributes(element, data);
                    return new ImageRender(this.context, data);
                }, id);
            }
            if (renderType === "text") {
                this.chain.push(params => {
                    Logger.debug(`[${id}] 返回 TextRender`);
                    const data = new DrawText();
                    data.font = { text: element.textContent };
                    converter.generateAttributes(element, data);
                    return new TextRender(this.context, data);
                }, id);
            }
            if (renderType === "path") {
                this.chain.push(params => {
                    Logger.debug(`[${id}] 返回 LineRender`);
                    const data = new DrawLine();
                    converter.generateAttributes(element, data);
                    return new LineRender(this.context, data);
                }, id);
            }
        });

        return this.chain.execute();
    }
}
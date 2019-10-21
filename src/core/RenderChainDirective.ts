import { ImageRender, RenderChain } from "./index";
import { PositionData, CoordinateData, RenderCoordsResult, SizeData } from "../models/index";

export class RenderChainDirective {
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

    calculate<T>(code: string, def?: T): T {
        const fn = new Function(code);
        const result = fn.apply(this);
        if (result === null || result === undefined || result === "") {
            return def;
        }
        return result as T;
    }

    convert2Image(element: HTMLImageElement): ImageRender {
        const srcCoordsPos = this.calculate<PositionData>(element.getAttribute("src-coords-pos"));
        const destCoordsPos = this.calculate<PositionData>(element.getAttribute("dest-coords-pos"));
        const destCoordsSize = this.calculate<SizeData>(element.getAttribute("dest-coords-size"));
        return new ImageRender(this.context, {
            src: element.getAttribute("src"),
            srcCoords: new CoordinateData(srcCoordsPos),
            destCoords: new CoordinateData(destCoordsPos, destCoordsSize)
        });
    }
    async render(templateIdOrChildren: string | HTMLElement[]): Promise<string> {
        let childrenNodes: ChildNode[] = [];
        if (typeof templateIdOrChildren === "string") {
            const template: HTMLTemplateElement = document.querySelector(templateIdOrChildren);
            childrenNodes = Array.from(template.content.childNodes);
        }
        if (Array.isArray(templateIdOrChildren)) {
            childrenNodes = childrenNodes;
        }

        this.chain = new RenderChain<RenderCoordsResult>();
        childrenNodes.forEach(node => {
            if (node.nodeName === "IMG") {
                this.chain.push(params => this.convert2Image(node as HTMLImageElement));
            }
        });

        return this.chain.execute();
    }
}
import { ImageRender, RenderChain } from "./index";
import { PositionData, CoordinateData, RenderCoordsResult, SizeData, DrawText, DrawType, TextAlignType } from "../models/index";
import { TextRender } from "./index";

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

    calculate<T>(code: string, def?: T): T {
        const fn = new Function(code);
        const result = fn.apply(this);
        if (result === null || result === undefined || result === "") {
            return def;
        }
        return result as T;
    }

    getResultById(id: string) {
        return (this.chain.getRenderResultById(id) || {}).result;
    }
    generateAttributes<TData>(element: HTMLElement, data: TData): TData {
        /**
         * @field-name:type  
         * data:attr-name:type
         *  @font-size:number="12"
         *  @fill-type:string="stroke"
         * 
         * [] => expression
         * expression:field-name => expression
         * 
         * () => function
         * $ => with
         */
        const validAttrName = /([A-Za-z.\d\-]+)/;
        const map = {
            property: () => new RegExp(`@${validAttrName.source}:(\\w+)`),
            expression: () => new RegExp(`\\[${validAttrName.source}\\]`),
            function: () => new RegExp(`\\(${validAttrName.source}\\)`),
        };
        element.getAttributeNames().forEach(attrName => {
            const attrValue: string = element.getAttribute(attrName);
            let value: any = "";
            let filedName: string = "";
            if (map.property().test(attrName)) {
                const matches = map.property().exec(attrName);
                filedName = matches[1];
                const typeName = matches[2];
                value = attrValue;
                if (typeName === "number") {
                    value = parseInt(attrValue);
                }
                if (typeName === "boolean") {
                    value = attrValue === "false" || value === "0" ? false : true;
                }
            } else if (map.expression().test(attrName)) {
                filedName = map.expression().exec(attrName)[1];
                value = new Function(`return (${attrValue})`).apply(this); //TODO this for new class
            } else if (map.function().test(attrName)) {
                filedName = map.function().exec(attrName)[1];
                value = new Function(attrValue).apply(this);
            } else {
                console.warn("invalid attribute name: " + attrName);
            }
        });
        return data;
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
    convert2Text(element: HTMLElement): TextRender {
        const data: DrawText = new DrawText();
        data.font = {
            text: element.textContent,
            size: parseInt(element.getAttribute("font-size")),
            family: element.getAttribute("font-family"),
            align: TextAlignType.Right
        };
        data.pos = this.calculate<PositionData>(element.getAttribute("pos"));
        data.drawType = DrawType.Fill;
        data.fillStyle = element.getAttribute("color");
        console.log("data: ", data);
        return new TextRender(this.context, data);
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
        elements.forEach(element => {
            const id = element.getAttribute("id");
            if (element.nodeName === "IMG") {
                this.chain.push(params => this.convert2Image(element as HTMLImageElement), id);
            }
            if (element.nodeName === "TEXT") {
                this.chain.push(params => this.convert2Text(element as HTMLElement), id);
            }
        });

        return this.chain.execute();
    }
}
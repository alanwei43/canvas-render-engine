import { RenderChain, Logger } from "../index";
import { RenderCoordsResult, CoordinateData, SizeData, PositionData } from "../../models/index";

export class FunctionContext {
    private chain: RenderChain<RenderCoordsResult>
    private context: CanvasRenderingContext2D
    constructor(chain: RenderChain<RenderCoordsResult>, context: CanvasRenderingContext2D) {
        this.chain = chain;
        this.context = context;
    }
    getCoors(id: string): CoordinateData {
        const result = this.chain.getRenderResultById(id).result;
        Logger.debug(`获取${id}对应的 CoordinateData 数据, pos: `, result);
        return new CoordinateData(result.pos, result.size);
    }
    get canvas(): SizeData {
        return { height: this.context.canvas.height, width: this.context.canvas.width };
    }
    pos(id: string): PositionData {
        return this.getCoors(id).pos;
    }
    size(id: string): SizeData {
        return this.getCoors(id).size;
    }
    posLeftTop(id: string): PositionData {
        return this.getCoors(id).leftTop();
    }
    posLeftBottom(id: string): PositionData {
        return this.getCoors(id).leftBottom();
    }
    posRightTop(id: string): PositionData {
        return this.getCoors(id).rightTop();
    }
    posRightBottom(id: string): PositionData {
        return this.getCoors(id).rightBottom();
    }
    posCenter(id: string): PositionData {
        return this.getCoors(id).center();
    }
}
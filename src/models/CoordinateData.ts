import { PositionData, SizeData } from "./Draw";

export class CoordinateData {
    constructor(start: PositionData, size?: SizeData) {
        this.pos = start;
        this.size = size;
    }
    pos: PositionData
    size: SizeData
    data?: any
    private getSize(): SizeData {
        return this.size || { height: 0, width: 0 };
    }
    leftTop(): PositionData {
        return this.pos;
    }
    leftBottom(): PositionData {
        return { x: this.pos.x, y: this.pos.y + this.getSize().height };
    }
    rightTop(): PositionData {
        return { x: this.pos.x + this.getSize().width, y: this.pos.y };
    }
    rightBottom(): PositionData {
        return { x: this.pos.x + this.getSize().width, y: this.pos.y + this.getSize().height };
    }
    center(): PositionData {
        return { x: this.pos.x + (this.size.width / 2), y: this.pos.y + (this.size.height / 2) };
    }
    increaseX(value: number): CoordinateData {
        this.pos.x += value;
        return this;
    }
    increaseY(value: number): CoordinateData {
        this.pos.y += value;
        return this;
    }
    static init(start: PositionData, end: PositionData): CoordinateData {
        const size: SizeData = { width: end.x - start.x, height: end.y - start.y };
        return new CoordinateData(start, size);
    }
    toJSON(): string {
        return JSON.stringify({
            pos: this.pos,
            size: this.size,
            leftTopPos: this.leftTop(),
            leftBottomPos: this.leftBottom(),
            rightBottomPos: this.rightBottom(),
            rightTopPos: this.rightTop()
        }, null, "\t");
    }
}
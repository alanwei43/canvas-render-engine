import { PositionData, SizeData } from "./Draw";

export class CoordinateData {
    constructor(start: PositionData, size?: SizeData) {
        this.pos = start;
        this.size = size;
    }
    pos: PositionData
    size: SizeData
    private getSize(): SizeData {
        return this.size || { height: 0, width: 0 };
    }
    getLeftTopPos(): PositionData {
        return this.pos;
    }
    getLeftBottomPos(): PositionData {
        return { x: this.pos.x, y: this.pos.y + this.getSize().height };
    }
    getRightTopPos(): PositionData {
        return { x: this.pos.x + this.getSize().width, y: this.pos.y };
    }
    getRightBottomPos(): PositionData {
        return { x: this.pos.x + this.getSize().width, y: this.pos.y + this.getSize().height };
    }
    getCenterPos(): PositionData {
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

    toString(): string {
        return JSON.stringify({
            pos: this.pos,
            size: this.size,
            leftTopPos: this.getLeftTopPos(),
            leftBottomPos: this.getLeftBottomPos(),
            rightBottomPos: this.getRightBottomPos(),
            rightTopPos: this.getRightTopPos()
        }, null, "\t");
    }
}
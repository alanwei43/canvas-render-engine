import { PositionData, SizeData } from "./Draw";

export class CoordinateData {
    constructor(start: PositionData, size?: SizeData) {
        this.pos = start;
        this.size = size;
    }
    pos: PositionData
    size: SizeData
    getLeftTopPos(): PositionData {
        return this.pos;
    }
    getLeftBottomPos(): PositionData {
        return { x: 0, y: this.pos.y + this.size.height || 0 };
    }
    getRightTopPos(): PositionData {
        return { x: this.pos.x + this.size.width || 0, y: this.pos.y };
    }
    getRightBottomPos(): PositionData {
        return { x: this.pos.x + this.size.width || 0, y: this.pos.y + this.size.height || 0 };
    }
    increaseX(value: number): CoordinateData {
        this.pos.x += value;
        return this;
    }
    increaseY(value: number): CoordinateData {
        this.pos.y += value;
        return this;
    }
}
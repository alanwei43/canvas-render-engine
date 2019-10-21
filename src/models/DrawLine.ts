import { PositionData, DrawType, StrokeFillStyleMix } from "./Draw";

export class DrawLine extends StrokeFillStyleMix {
    positions: PositionData[]
    drawType: DrawType
    closePath?: boolean = false
    lineWidth?: number
}
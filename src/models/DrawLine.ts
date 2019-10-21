import { PositionData, StrokeStyle, FillStyle, DrawType, StrokeFillStyleMix } from "./Draw";

export class DrawLine extends StrokeFillStyleMix {
    positions: PositionData[]
    closePath: boolean = false
    lineWidth?: number
    drawType: DrawType
}
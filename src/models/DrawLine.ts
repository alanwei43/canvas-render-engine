import { PositionData, StrokeStyle, FillStyle, DrawType } from "./Draw";

export class DrawLine {
    positions: PositionData[]
    closePath: boolean = false
    lineWidth?: number
    drawType: DrawType
    stroke?: StrokeStyle
    fill?: FillStyle
}
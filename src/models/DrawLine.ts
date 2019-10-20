import { PositionData, StrokeStyle, FillStyle } from "./Draw";

export class DrawLine {
    positions: PositionData[]
    closePath: boolean = true
    lineWidth?: number
    stroke?: StrokeStyle
    fill?: FillStyle
}
import { PositionData, FontStyle, FillStyle, DrawType, StrokeStyle } from "./Draw";
export class DrawText {
    pos: PositionData
    font: FontStyle
    fill?: FillStyle
    stroke?: StrokeStyle
    drawType: DrawType
}

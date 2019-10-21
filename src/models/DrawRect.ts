import { PositionData, FillStyle, SizeData, StrokeStyle, DrawType } from "./Draw"
export class DrawRect {
    pos: PositionData;
    size: SizeData;
    fill?: FillStyle;
    stroke?: StrokeStyle;
    drawType: DrawType
}

import { PositionData, FontStyle, FillStyle, DrawType, StrokeStyle, StrokeFillStyleMix } from "./Draw";
export class DrawText extends StrokeFillStyleMix {
    pos: PositionData
    font: FontStyle
    drawType: DrawType
}

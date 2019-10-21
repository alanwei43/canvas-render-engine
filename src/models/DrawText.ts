import { PositionData, FontStyle, DrawType, StrokeFillStyleMix } from "./Draw";
export class DrawText extends StrokeFillStyleMix {
    pos: PositionData
    font: FontStyle
    drawType: DrawType
}

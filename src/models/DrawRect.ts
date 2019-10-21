import { PositionData, SizeData, DrawType, StrokeFillStyleMix } from "./Draw"
export class DrawRect extends StrokeFillStyleMix {
    pos: PositionData
    size: SizeData
    drawType: DrawType
}

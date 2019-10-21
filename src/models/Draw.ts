export interface PositionData {
    x: number
    y: number
}
export interface FontStyle {
    size?: number
    family?: string
    text: string
    align?: TextAlignType 
}

export interface SizeData {
    width: number
    height: number
}
export enum DrawType {
    Stroke,
    Fill
}
export enum TextAlignType{
    Center,
    Right,
    Left
}
export class StrokeFillStyleMix {
    fillStyle?: string
    strokeStyle?: string
}
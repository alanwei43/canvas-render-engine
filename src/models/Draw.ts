export interface PositionData {
    x: number
    y: number
}
export interface FontStyle {
    size?: number
    family?: string
    text: string
}

export interface SizeData {
    width: number
    height: number
}
export enum DrawType {
    Stroke,
    Fill,
    None
}
export class StrokeFillStyleMix {
    fillStyle?: string
    strokeStyle?: string
}
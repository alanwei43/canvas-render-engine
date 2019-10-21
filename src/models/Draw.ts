export interface PositionData {
    x: number
    y: number
}
export interface FillStyle {
    color: string
}
export interface StrokeStyle {
    color: string
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
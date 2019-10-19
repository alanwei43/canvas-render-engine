import { CoordinateData } from "./CoordinateData"

export class RenderResult<T> {
    success: boolean
    result?: T
}
export class RenderCoordsResult extends RenderResult<CoordinateData> { }
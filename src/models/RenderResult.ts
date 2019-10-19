export class RenderResult<T> {
    success: boolean
    result?: T
}
export class RenderStringResult extends RenderResult<string> { }
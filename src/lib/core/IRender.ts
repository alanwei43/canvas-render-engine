export interface IRender<TResult> {
    render(): Promise<TResult>;
}

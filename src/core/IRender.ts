export interface IRender<TData, TResult> {
    render(): Promise<TResult>;
}

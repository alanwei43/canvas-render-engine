import { RenderChain, IRender } from "../core/index";

export interface GetRenderChainParams<TResult> {
    chain: RenderChain<TResult>;
}
export interface ChainItem<TResult> {
    id: string;
    getRender: (params: GetRenderChainParams<TResult>) => IRender<TResult>;
    renderResult?: TResult;
}

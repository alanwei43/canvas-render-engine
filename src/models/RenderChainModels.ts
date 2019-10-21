import { RenderChain, IRender } from "../core/index";

export interface RenderChainParams<TResult> {
    chain: RenderChain<TResult>;
}
export interface ChainItem<TResult> {
    id: string;
    getRender: (params: RenderChainParams<TResult>) => IRender<TResult>;
    renderResult?: TResult;
}

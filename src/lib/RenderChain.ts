import { IRender } from "./core/IRender";
import { ChainItem, RenderChainParams } from "../models/index";

export class RenderChain<TResult> {
    private renders: ChainItem<TResult>[] = []
    push(
        render: (params: RenderChainParams<TResult>) => IRender<TResult>,
        id?: string
    ): RenderChain<TResult> {
        if (!id) {
            id = Date.now().toString();
        }
        this.renders.push({ id: id, getRender: render });
        return this;
    }
    async execute(): Promise<string> {
        return this.renders.reduce((prev, next) => {
            return prev.then(() => {
                return next.getRender({ chain: this }).render().then(result => {
                    next.renderResult = result;
                    return "ok";
                }).catch(() => "fail");
            });
        }, Promise.resolve("first"));
    }

    get renderResults(): ChainItem<TResult>[] {
        return this.renders.filter(item => item.renderResult !== null && item.renderResult !== undefined);
    }
    get lastRenderResult(): TResult {
        const results = this.renderResults;
        const result = results[results.length - 1];
        if (!result) {
            return null;
        }
        return result.renderResult;
    }
    getRenderResultById(id: string): TResult {
        const result = this.renderResults.filter(item => item.id === id)[0];
        if (!result) {
            return null;
        }
        return result.renderResult;
    }
}
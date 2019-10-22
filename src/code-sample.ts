import { RectRender, TextRender, ImageRender, LineRender, RenderChain } from "./lib/index";
import { CoordinateData, RenderCoordsResult, DrawLine, DrawRect, DrawText, DrawType, TextAlignType } from "./models/index";

const canvas1: HTMLCanvasElement = document.querySelector("#canvas1");
const context = canvas1.getContext("2d");

const chain = new RenderChain<RenderCoordsResult>();

chain.push(params => new ImageRender(context, {
    src: "./resources/280TSI.jpg",
    srcCoords: new CoordinateData({ x: 0, y: 0 }),
    destCoords: new CoordinateData({ x: 0, y: 0 }, { width: 300, height: 225 })
}), "main-image").push(params => {
    return new ImageRender(context, {
        src: "http://vw.faw-vw.com/content/dam/vw-ngw/faw-vw/homepage/site_logo/pc_logo.png",
        srcCoords: new CoordinateData({ x: 0, y: 0 }),
        destCoords: new CoordinateData({ x: 10, y: 8 })
    });
}, "logo").push(params => {
    const response = chain.getRenderResultById("main-image");
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: 5, y: pos.y + 12 },
        font: { text: "大众 凌渡 280TSI DSG舒适版国VI", size: 14, family: "sans-serif", align: TextAlignType.Right },
        drawType: DrawType.Fill
    });
    return textRender;
}, "title").push(params => {
    const logoResult = params.chain.getRenderResultById("logo").result;
    const data = new DrawRect();
    data.pos = logoResult.pos;
    data.size = logoResult.size;
    data.strokeStyle = "gray";
    return new RectRender(context, data);
}, "rect").push(params => {
    const response = params.chain.getRenderResultById("title");
    const pos = response.result.getRightBottomPos();
    const textRender = new TextRender(context, {
        pos: { x: 5, y: pos.y + 10 },
        font: { text: "18.00万", size: 12, family: "sans-serif", align: TextAlignType.Right },
        fillStyle: "gray",
        drawType: DrawType.Fill
    });
    return textRender;
}, "small-price").push(params => {
    const smallPriceResult = params.chain.getRenderResultById("small-price").result;
    const titleResult = params.chain.getRenderResultById("title").result;
    const titlePos = titleResult.getRightBottomPos();

    const textRender = new TextRender(context, {
        pos: { x: smallPriceResult.size.width + 10, y: titlePos.y + 5 },
        font: { text: "12.48万", size: 18, family: "sans-serif", align: TextAlignType.Right },
        fillStyle: "red",
        drawType: DrawType.Fill,
    });
    return textRender;
}, "large-price").push(params => {
    const smallPriceResult = params.chain.getRenderResultById("small-price").result;
    const data: DrawLine = new DrawLine();
    data.positions = [
        { x: smallPriceResult.getLeftTopPos().x, y: smallPriceResult.getCenterPos().y + 2 },
        { x: smallPriceResult.getRightBottomPos().x, y: smallPriceResult.getCenterPos().y + 2 }
    ];
    data.strokeStyle = "gray";
    data.drawType = DrawType.Stroke;
    data.lineWidth = .8;
    return new LineRender(context, data);
}).push(params => {
    const renderResult = params.chain.getRenderResultById("small-price").result;
    const data: DrawText = {
        drawType: DrawType.Fill,
        pos: { x: 5, y: renderResult.getRightBottomPos().y + 10 },
        fillStyle: "#F5594E",
        font: {
            size: 10,
            text: "总优惠可达5.63万  低于同城4S店报价1.83万",
            family: "Helvetica",
            align: TextAlignType.Right
        }
    };
    return new TextRender(context, data);
}, "sub-title").push(params => {
    const largePriceResult = params.chain.getRenderResultById("sub-title");
    const posY = largePriceResult.result.getRightBottomPos().y + 15;
    const data: DrawLine = new DrawLine();
    data.positions = [{
        x: 5, y: posY
    }, {
        x: context.canvas.width - 5, y: posY
    }];
    data.drawType = DrawType.Stroke;
    data.lineWidth = .5;
    data.strokeStyle = "#ccc";
    return new LineRender(context, data);
}, "splitor").push(params => {
    const renderResult = params.chain.getRenderResultById("splitor");
    const baseY = renderResult.result.getRightBottomPos().y + 15;
    const baseX = 5;
    const perWidth = context.canvas.width / 4;
    const data: DrawLine = new DrawLine();
    data.positions = [{
        x: baseX, y: baseY + 20
    }, {
        x: baseX + perWidth, y: baseY + 20
    }, {
        x: baseX + perWidth + perWidth, y: baseY + 40
    }, {
        x: baseX + perWidth + perWidth + perWidth, y: baseY + 0
    }, {
        x: baseX + perWidth + perWidth + perWidth + perWidth - 10, y: baseY + 0
    }, {
        x: baseX + perWidth + perWidth + perWidth + perWidth - 10, y: baseY + 72
    }, {
        x: baseX, y: baseY + 72
    }, {
        x: baseX, y: baseY + 20
    }];
    data.drawType = DrawType.Fill;
    data.fillStyle = "#fdeeed";
    return new LineRender(context, data);
}, "fold-line").push(params => {
    const data = params.chain.getRenderResultById("fold-line").result.data as DrawLine;
    return new TextRender(context, {
        pos: { x: data.positions[1].x, y: data.positions[1].y - 15 },
        font: { text: "14.78万", size: 10, align: TextAlignType.Center },
        fillStyle: "#f5594e",
        drawType: DrawType.Fill,
    });
}).push(params => {
    const data = params.chain.getRenderResultById("fold-line").result.data as DrawLine;
    return new TextRender(context, {
        pos: { x: data.positions[2].x, y: data.positions[2].y },
        font: { text: "12.48万", size: 10, align: TextAlignType.Center },
        fillStyle: "#f5594e",
        drawType: DrawType.Fill,
    });
}).push(params => {
    const data = params.chain.getRenderResultById("fold-line").result.data as DrawLine;
    return new TextRender(context, {
        pos: { x: data.positions[3].x, y: data.positions[3].y - 12 },
        font: { text: "16.27万", size: 10, align: TextAlignType.Center },
        fillStyle: "#f5594e",
        drawType: DrawType.Fill,
    });
}).push(params => {
    const renderResult = params.chain.getRenderResultById("main-image").result;
    return new ImageRender(context, {
        src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAB8CAYAAACrHtS+AAADFklEQVR4nO2WS27FMAwDc/9Lt/ugBeSQluhkCHinD8XJA951XddPwlNUnef24t7b9MYNABzgawI4wKXgp/aOAO+QEpRSV+11f7juD1y8LcNIR121F+ANRjrqqr0AbzDSUVftBXiDkY66au/ngb85gA5/yl53zgBv8AdwgJfrAC4I4ABv8QfwrACsOw64N8PIYAAAnzAyGADAJ4wMBgDwCSODAQB8wog7vI55h37gGUaqAjjAy71TXgAO8HIdwAG+H7hb7gCSepV73QI4wAHu7lXudQvgAAe4u1e5160S8KmnBHVi3eAbN3AEIIADHOAABzjA04D/6TBY7o+qukOpS1K+w5sArinf4U0A15Tv8CaAa8p3eBPANV1KgE9DntrRIbe/DXUAdwrgRXMABzjA99QB3KnjgCvDFCk73B9axx2DewEO8M3m3DsADvByHcAbzLl3ANz8L33D0pG6am/6E+8A+GlPvAPgpz3xDoCf9sQ7AH7aE+/wLVXUsde9ww3ILYADHOAAB3jLPIADXLptwZ8PeMexU/46PLv9ARzgAHfvUOYBXDjW7Q/g5kDd4bn9fQq4clhH75Q67t1QB/CnAjjA7b0ADxLAAW7v3Q68Oiz92K95XugH+Bs8A/xjngH+Mc8A/5jnGOAdAaTDTdoBcLPn9B0AN3tO3wFws+f0HQA3e07fUQK+MOwVMBQvHbmI+QH8qQAOcIADHOAAnwTuOn6H3AFMAVLutf9gJIebBXCA2+sAHiSAA9xe9zngHSE8NZwUcrXXXbfhzcMG+JoXgAsCOMABDvAXA+9QB7RqneLl0I8P4ADfLIDX5wFcmAdwgANcMbLBXPSHkfQW7gC4816Am4NXBHCA2+8FuDl4RQB/CXD3h6FoEGT1AdwpgBfnddR1CODFeR11HQJ4cV5HXYcAXpyn1Cmek+a5ewEePs/dC/Dwee5egIfPc/cCPHyeu/cxcLemgCu97g/cvWNhL8ArvQAXBHCAS3UdvQAXBPAg4FNPgeYOqkODWc/DBjjA/w1FCS9JAC+GooSXJIAXQ1HCS9JUzr/WYmyK3t9blgAAAABJRU5ErkJggg==",
        srcCoords: new CoordinateData({ x: 0, y: 0 }),
        destCoords: new CoordinateData({
            x: renderResult.getLeftBottomPos().x + 5, y: renderResult.getLeftBottomPos().y
        }, {
            width: 70,
            height: 70
        })
    })
});

const start = Date.now();
chain.execute().then(() => {
    const end = Date.now();
    console.log(`time: ${(end - start) / 1000}s`);
});
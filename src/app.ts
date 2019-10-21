import { RectRender, TextRender, ImageRender, CoreRender, LineRender, IRender, RenderChain } from "./core/index";
import { CoordinateData, RenderCoordsResult, DrawImage, DrawLine, DrawRect, DrawText, DrawType, TextAlignType, PositionData } from "./models/index";

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
});

chain.execute().then(() => {
    const result = chain.getRenderResultById("sub-title").result;
    // new LineRender(context, {
    //     drawType: DrawType.Stroke,
    //     positions:[
    //         result.getLeftTopPos(),
    //         result.getRightTopPos(),
    //         result.getRightBottomPos(),
    //         result.getLeftBottomPos()
    //     ],
    //     lineWidth: 1,
    //     strokeStyle: "#aaa",
    //     closePath: true
    // }).render();
    // console.log(result.toJSON());
    // const result = chain.getLastRenderResultById("rect").result;
    // const center = result.getCenterPos();
    // context.fillStyle = "red";
    // context.strokeStyle = "red";
    // context.beginPath();
    // context.arc(center.x, center.y, result.size.height / 2, 0, Math.PI * 2, false);
    // context.closePath();
    // context.stroke();
});
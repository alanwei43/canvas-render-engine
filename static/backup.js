
/**
 * get canvas
 * @returns {CanvasRenderingContext2D}
 */
function getCanvas() {
    var canvas = document.querySelector("#canvas");
    return canvas.getContext("2d")
}

function drawImage() {
    var context = getCanvas();

    var img = new Image();
    img.src = "./car1.jpg";
    img.addEventListener("load", function () {
        let height = (img.height / img.width) * 250;
        context.drawImage(img, 0, 0, img.width, img.height, 15, 30, 250, height);

        context.font = "12px sans-serif";
        context.fillText("推荐一个好物给你，请查收", 65, 20);

        context.fillStyle = "red";
        context.font = "12px sans-serif";
        context.fillText("$", 15, 250)
        context.font = "16px serif";
        context.fillText("27.", 27, 250)
        context.font = "12px sans-serif";
        context.fillText("00万", 50, 250)
        context.font = "10px sans-serif";
        context.fillStyle = "#aaa";
        context.fillText("价格具有时效性", 15, 265)
        var qrCode = new Image();
        qrCode.src = "data:image/png;base64,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";
        qrCode.addEventListener("load", function () {
            context.drawImage(qrCode, 0, 0, 124, 124, (280 - 62) / 2, 280, 62, 62);

            context.font = "10px sans-serif";
            context.fillStyle = "#aaa";
            context.fillText("长按识别二维码", 105, 360)
        });
    });
}
drawImage();

/**
 * 
 * @param { CanvasRenderingContext2D } context
 */
function Draw(context){
    this.context = context;
}
var canvas = document.getElementById("user-canvas-video");
var ctx = canvas.getContext("2d");
var costume = new Image();

function updateCanvasVideo() {
    ctx.drawImage(videoUser, 0, 0, 500, 400);
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(costume, 0, 0, 500, 400);
}
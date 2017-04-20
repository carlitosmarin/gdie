var canvas = document.getElementById("user-canvas-video");
var ctx = canvas.getContext("2d");
var costume = new Image();
costume.src = 'images/costumes/jon.png';

function updateCanvasVideo() {
    ctx.drawImage(videoUser, 0, 0, 500, 400);
    ctx.globalCompositeOperation = "source-in";
    ctx.drawImage(costume, 0, 0, 500, 400);
    ctx.globalCompositeOperation = "destination-atop";
}
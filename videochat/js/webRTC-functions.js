var videoUser = null;

var constraints = {
    video: true,
    audio: true
};

function successCallback(localMediaStream) {
    window.stream = localMediaStream; // stream available to console
    videoUser = document.getElementById("video-user-video");
    videoUser.src = window.URL.createObjectURL(localMediaStream);
    costume.src = 'images/costumes/'+($('#request-helpdesk').attr('data-name')).toLowerCase()+'.png';
    videoUser.play();

    videoUser.ontimeupdate = function () {
        updateCanvasVideo();
    };
}

function errorCallback(error){
    console.log("navigator.getUserMedia error: ", error);
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
function initWebRTC() {
    navigator.getUserMedia(constraints, successCallback, errorCallback);
}

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
    video: true,
    audio: true
};

function successCallback(localMediaStream) {
    window.stream = localMediaStream; // stream available to console
    var video = document.getElementById("video-user-video");
    video.src = window.URL.createObjectURL(localMediaStream);
    video.play();
}

function errorCallback(error){
    console.log("navigator.getUserMedia error: ", error);
}

function initWebRTC() {
    navigator.getUserMedia(constraints, successCallback, errorCallback);
}

//https://bitbucket.org/webrtc/codelab/src/fc1f8b8b5e8733ac793d2ecadcc9f6057a212d5c/complete/step3/index.html?at=master&fileviewer=file-view-default
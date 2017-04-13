var video = document.getElementById('video-tag');

$(function () {
    init_video_controls();

    $('#lights-off, #turn-off').click(function () {
        $('#turn-off').toggleClass('lights-on lights-out');
        $('#lights-off a i').toggleClass('fa-sun-o fa-moon-o')
    })
});

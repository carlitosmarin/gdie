var audio = new Audio('./media/got-opening.mp3');
var siriOpen = new Audio('./media/siri-open.mp3');
var siriClose = new Audio('./media/siri-close.mp3');
var video = document.getElementById('video-tag');

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    init_easter_eggs();
    init_video_controls();
    init_canvas_functions();
    init_filter_functions();
    init_scene_tracking();
    init_subtitles();
});

function init_easter_eggs() {
    recognition.start();

    $('#raven-img').click(function () {
        if (audio.paused) {
            audio.play();
            $('#raven-img').attr('src', './images/raven-play.png');
        } else {
            audio.pause();
            $('#raven-img').attr('src', './images/raven-pause.png');
        }
    });

    $('#lights-off, #turn-off').click(function () {
        $('#turn-off').toggleClass('lights-on lights-out');
        $('#lights-off a i').toggleClass('fa-sun-o fa-moon-o');
        $('body').toggleClass('night-mode');
    });

    $('#siri-btn, #male-siri, #female-siri').click(function () {
        $('#voice-ratio').toggleClass('ratio-visible');
        if($('#voice-ratio').hasClass('ratio-visible')) {
            openSiri();
            acceptOrder = true;
            setTimeout(function () {
                $('#control-volume-range').val(20);
                update_volume();
                recognition.start();
            }, 500);
        } else {
            recognition.abort();
        }
    })
}


function init_subtitles() {
    // http://ronallo.com/blog/html5-video-caption-cue-settings-tester/ 		Styling cues
    var languages = {'esp': 1, 'eng': 2, 'jp': 3};

    $('.set-subtitle').click(function () {
        for (var i = 0; i < video.textTracks.length; i++) video.textTracks[i].mode = 'hidden';
        video.textTracks[languages[$(this).attr('lan')]].mode = 'showing';
        $(this).attr('data-state', 'active')
    });

    $('#control-no-sub').click(function () {
        for (var i = 0; i < video.textTracks.length; i++) video.textTracks[i].mode = 'hidden';
    })
}

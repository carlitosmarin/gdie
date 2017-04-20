var last_volume = 0;

function init_video_controls () {
    video.addEventListener('loadedmetadata', function() {
        $('#duration').text(get_normalized_time(video.duration));
        $('#filter-btn').prop("disabled", false);
    });

    // By the time the video has ended, it will be back at starter point
    video.onended = function() {
        $('#control-stop').click()
    };

    // Play/Pause Button
    $('#control-play').click(function () {
        $('#control-play').find('i').toggleClass('fa-play fa-pause');
        if (video.paused || video.ended) video.play();
        else video.pause();
    });

    // Stop Button
    $('#control-stop').click(function () {
        $('#control-play').find('i').removeClass('fa-pause').addClass('fa-play');
        video.pause();
        video.currentTime = 0;
    });

    // Mute Button
    $('#control-volume-mute').click(function () {
        if ($('#control-volume-range').val() === 0) {
            video.volume = last_volume;
            $('#control-volume-range').val(last_volume*100);
            $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-' +(last_volume >= 0.5 ? 'up':'down'));
        } else {
            last_volume = parseFloat(($('#control-volume-range').val()/100)).toFixed(1);
            video.volume = 0;
            $('#control-volume-range').val(0);
            $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-off');
        }
    });

    // On change on the volume input range
    $('#control-volume-range').on('change', function() { update_volume() })

    // Full Screen Button
    $('#control-expand').click(function () {
        if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
            $('#video-controls').addClass('full-screen');
        } else if (video.webkitRequestFullScreen) {
            video.webkitRequestFullScreen();
            $('#video-controls').addClass('full-screen');
        }
    });

    // Every time that changes the current time of the video
    $('#video-tag').bind('timeupdate', function () {
        $("#actual-progress").slider('value', (video.currentTime / video.duration)*100);
        $('#actual-time').text(get_normalized_time(video.currentTime))
    });

    /*
     Change the speeds of the video. https://www.w3schools.com/tags/av_prop_playbackrate.asp
     · 0.5 is half speed (slower)
     · 1.0 is normal speed
     · 2.0 is double speed (faster)
     */
    $('#control-vel-0, #control-vel-1, #control-vel-2').click(function () {
        video.playbackRate = $(this).attr('vel');
        $('#collapseVelocimeter .well .btn').removeClass('active-vel');
        $('#control-vel-'+($(this).attr('vel') === 0.5 ? '0' : $(this).attr('vel'))).addClass('active-vel');
    });

    //  If you want open another collapse panel, the others will hide
    $('.collapse').on('show.bs.collapse', function () {
        $('.collapse').collapse('hide')
    });

    // Video time slider
    $("#actual-progress").slider({
        range: "min",
        value: 0,
        min: 0,
        max: 100
    });

    // When you click over the slider, you will be redirected to that specific time
    $("#actual-progress").slider({
        slide: function(event, ui) { video.currentTime = (ui.value * video.duration)/100 }
    });

    // When you unhover the video-container, the opened collapse will hide
    $('#video-container').hover(function () {}, function () {
        $('.collapse').collapse('hide');
    });
}

function update_position (value) {
    video.currentTime = (value*video.duration)/10;
}

function update_volume () {
    if ($('#control-volume-range').val() >= 50) $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-up');
    else if ($('#control-volume-range').val() > 0) $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-down');
    else $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-off');
    video.volume = parseFloat(($('#control-volume-range').val()/100)).toFixed(1);
}

function get_normalized_time (totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = (totalSeconds % 60).toFixed(0);
    if (seconds.length === 1) seconds = '0' + seconds;
    if (minutes < 9) minutes = '0' + minutes;

    return ((hours > 0) ? hours + ':' : '') + ((minutes > 0) ? minutes + ':' : '00:') + seconds
}
var audio = new Audio('./media/got-opening.mp3');
var video = document.getElementById('video-tag');

var last_volume = 0
var character_name = ['None', 'Jon Snow', 'Tyrion Lannister']
var character_url = ['none', 'snow', 'tyrion']
var actual_character = 0

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
	init_video_control()

	$('#raven-img').click(function () {
		if (audio.paused) {
			audio.play();
			$('#raven-img').attr('src', './images/raven-play.png');
		} else {
			audio.pause();
			$('#raven-img').attr('src', './images/raven-pause.png');
		}
	})

	$('#houses-background figure').click(function () {
		$(this).toggleClass('selected');
	})

	$('#cancel-character').click(function () {
		actual_character = 0
		update_character_filter()
	})

	$('#left-arrow-char').click(function () {
		if (actual_character == 0) actual_character = character_name.length-1;
		else actual_character--
		update_character_filter()
	})

	$('#right-arrow-char').click(function () {
		if (actual_character == character_name.length-1) actual_character = 0;
		else actual_character++
		update_character_filter()
	})

	$('#lights-off').click(function () {
		$('#turn-off').toggleClass('lights-on lights-out');
		$('#lights-off a i').toggleClass('fa-sun-o fa-moon-o')
	})

	$('#turn-off').click(function () {
		$('#turn-off').toggleClass('lights-on lights-out');
	})
})

function update_character_filter () {
	$('#actual-character').find('figcaption').text(character_name[actual_character])
	$('#actual-character').find('img').attr('src','./images/'+character_url[actual_character]+'.png')
}

function init_video_control () {
	video.addEventListener('loadedmetadata', function() {
	    $('#duration').text(get_normalized_time(video.duration))
	});

	$('#control-play').click(function () {
		if (video.paused || video.ended) {
			$('#control-play').find('i').removeClass('fa-play').addClass('fa-pause')
			video.play();
		} else {
			$('#control-play').find('i').removeClass('fa-pause').addClass('fa-play')
			video.pause();
		}
	})

	$('#control-stop').click(function () {
		$('#control-play').find('i').removeClass('fa-pause').addClass('fa-play')
		video.pause();
   		video.currentTime = 0;
	})

	$('#control-volume-mute').click(function () {
		if ($('#control-volume-range').val() == 0) {
			video.volume = last_volume;
			$('#control-volume-range').val(last_volume*100);
			$('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-' +(last_volume >= 0.5 ? 'up':'down'));
		} else {
			last_volume = parseFloat(($('#control-volume-range').val()/100)).toFixed(1);
			video.volume = 0
			$('#control-volume-range').val(0);
			$('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-off');
		}
	})

	$('#control-volume-range').on('change', function() {
	    if ($('#control-volume-range').val() >= 50) $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-up');
	    else if ($('#control-volume-range').val() > 0) $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-down');
	    else $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-off');
	    video.volume = parseFloat(($('#control-volume-range').val()/100)).toFixed(1);
	})

	$('#control-expand').click(function () {
		if (video.mozRequestFullScreen)  video.mozRequestFullScreen();
		else if (video.webkitRequestFullScreen)  video.webkitRequestFullScreen();
	})

	$('#video-tag').bind('timeupdate', function () {
		$("#actual-progress").slider('value', get_normalized_position())
		$('#actual-time').text(get_normalized_time(video.currentTime))

	});

	$('#control-vel-0, #control-vel-1, #control-vel-2').click(function () {
		video.playbackRate = $(this).attr('vel');
		$('#collapseVelocimeter .well .btn').removeClass('active-vel');
		$('#control-vel-'+($(this).attr('vel') == 0.5 ? '0' : $(this).attr('vel'))).addClass('active-vel');
	})

	$('#control-esp, #control-ru, #control-eng').click(function () {
		$('#collapseLanguage .well .btn').removeClass('active-lan');
		$('#control-'+$(this).attr('lan')).addClass('active-lan');
	})

	$('.collapse').on('show.bs.collapse', function () {
		$('.collapse').collapse('hide')
	})

	video.onended = function() {
	    $('#control-stop').click()
	};

	$("#actual-progress").slider({
		range: "min",
		value: 0,
		min: 0,
		max: 100
    });

    $("#actual-progress").slider({
		slide: function(event, ui) {
			video.currentTime = (ui.value * video.duration)/100
		}
	});

	$('#video-container').hover(function () {null}, function () {
		$('.collapse').collapse('hide')
	})
}

function get_normalized_time (totalSeconds) {
	hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	minutes = Math.floor(totalSeconds / 60);
	seconds = totalSeconds % 60;
	seconds = seconds.toFixed(0)
	if (seconds.length == 1) seconds = '0' + seconds;
	if (minutes < 9) minutes = '0' + minutes;

	return ((hours > 0) ? hours + ':' : '') + ((minutes > 0) ? minutes + ':' : '00:') + seconds
}

function get_normalized_position () {
	return (video.currentTime / video.duration)*100;
}
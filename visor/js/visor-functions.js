var last_volume = 0

function init_video_controls () {
	video.addEventListener('loadedmetadata', function() {
	    $('#duration').text(get_normalized_time(video.duration))
	});

	// By the time the video has ended, it will be back at starter point
	video.onended = function() {
	    $('#control-stop').click()
	};

	// Play/Pause Button
	$('#control-play').click(function () {
		if (video.paused || video.ended) {
			$('#control-play').find('i').removeClass('fa-play').addClass('fa-pause')
			video.play();
		} else {
			$('#control-play').find('i').removeClass('fa-pause').addClass('fa-play')
			video.pause();
		}
	})

	// Stop Button
	$('#control-stop').click(function () {
		$('#control-play').find('i').removeClass('fa-pause').addClass('fa-play')
		video.pause();
   		video.currentTime = 0;
	})

	// Mute Button
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

	// On change on the volume input range
	$('#control-volume-range').on('change', function() { update_volume() })

	// Full Screen Button
	$('#control-expand').click(function () {
		if (video.mozRequestFullScreen)  video.mozRequestFullScreen();
		else if (video.webkitRequestFullScreen)  video.webkitRequestFullScreen();
	})

	// Every time that changes the current time of the video
	$('#video-tag').bind('timeupdate', function () {
		$("#actual-progress").slider('value', (video.currentTime / video.duration)*100)
		$('#actual-time').text(get_normalized_time(video.currentTime))
	});

	// Allow shortcuts from the keyboard when hovering the video frame
	$('#video-container').hover(
		function () { document.addEventListener('keyup', doc_keyUp, false);
	},	function () { document.removeEventListener('keyup', doc_keyUp, false);
	})

	/*
		Change the speeds of the video. https://www.w3schools.com/tags/av_prop_playbackrate.asp
		· 0.5 is half speed (slower)
		· 1.0 is normal speed
		· 2.0 is double speed (faster)
	*/
	$('#control-vel-0, #control-vel-1, #control-vel-2').click(function () {
		video.playbackRate = $(this).attr('vel');
		$('#collapseVelocimeter .well .btn').removeClass('active-vel');
		$('#control-vel-'+($(this).attr('vel') == 0.5 ? '0' : $(this).attr('vel'))).addClass('active-vel');
	})

	/*
		Change the language of the subtitles
		· esp: spanish
		· ru: russian
		· eng: english
		· no-sub: subtitles hidden
	*/
	$('#control-esp, #control-ru, #control-eng, #control-no-sub').click(function () {
		$('#collapseLanguage .well .btn').removeClass('active-lan');
		$('#control-'+$(this).attr('lan')).addClass('active-lan');
	})

	//  If you want open another collapse panel, the others will hide
	$('.collapse').on('show.bs.collapse', function () {
		$('.collapse').collapse('hide')
	})

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
	$('#video-container').hover(function () {null}, function () {
		$('.collapse').collapse('hide');
	})

	// When you click over the img character, an information modal will appear
	$('.modaler').click(function () {
		$('#modal-character').modal('show');
	})

	// Before showing the modal to apply filters, we restart the variables
	$('#control-screenshot').click(function () {
		$('#main-screenshot').attr('actual-filter', 'none').attr('actual-value', 0)
		$('#filter-sepia, #filter-grayscale, #filter-invert, #filter-contrast').attr('value', 100)
		$('#filter-blur').attr('value', 2)
		$('#filter-none').click()
		$('#modal-screenshot').modal('show');
	})
}

// The Keyboard SHORTCUTS to improve the UX
function doc_keyUp (e) {
 	if (e.ctrlKey) {
 		if (e.keyCode == 32) $('#control-play').click(); 									// SPACEBAR: Play/Pause
 		else if (e.keyCode == 39) null								// ->: Next chapter TDO
		else if (e.keyCode == 37) null 								// <-: Last chapter TDO
 		else if (e.keyCode == 49) $('#control-vel-0').click(); 								// 1: Low velocity
 		else if (e.keyCode == 50) $('#control-vel-1').click(); 								// 2: Normal velocity
 		else if (e.keyCode == 51) $('#control-vel-2').click(); 								// 3: High velocity
 		else if (e.keyCode == 76) $('#lights-off').click(); 								// L: Lights
 		else if (e.keyCode == 77) $('#control-volume-mute').click(); 						// M: Mute
 		else if (e.keyCode == 83) $('#control-screenshot').click();							// S: Screenshot
 		else if (e.keyCode == 187 || e.keyCode == 191) {									// +: More volume 	-: Less volume
 			var actual_sound = parseInt($('#control-volume-range').val())
			$('#control-volume-range').val((e.keyCode == 187) ? actual_sound + 10 : actual_sound - 10)
 			if (!$('#collapseVolume').hasClass('in')) $('#control-volume-btn').click();
 			update_volume()
 		}
 	}
}

function update_volume () {
	if ($('#control-volume-range').val() >= 50) $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-up');
    else if ($('#control-volume-range').val() > 0) $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-down');
    else $('#control-volume-btn').find('i').removeClass().addClass('fa fa-volume-off');
    video.volume = parseFloat(($('#control-volume-range').val()/100)).toFixed(1);
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
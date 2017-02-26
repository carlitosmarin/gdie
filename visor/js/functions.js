var audio = new Audio('./media/got-opening.mp3');
var video = document.getElementById('video-tag');

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
	init_easter_eggs()
	init_video_controls()
	init_canvas_functions()
	init_filter_functions()
	init_subtitles()

})

function init_easter_eggs () {
	$('#raven-img').click(function () {
		if (audio.paused) {
			audio.play();
			$('#raven-img').attr('src', './images/raven-play.png');
		} else {
			audio.pause();
			$('#raven-img').attr('src', './images/raven-pause.png');
		}
	})

	$('#lights-off, #turn-off').click(function () {
		$('#turn-off').toggleClass('lights-on lights-out');
		$('#lights-off a i').toggleClass('fa-sun-o fa-moon-o')
	})
}


function init_subtitles () {
		var control_esp = document.getElementById('control-esp');
		var control_eng = document.getElementById('control-eng');
		var control_ja = document.getElementById('control-ja');
		var control_none = document.getElementById('control-no-sub');
		
		control_esp.addEventListener('click', function(e) {
			for (var i = 0; i < video.textTracks.length; i++) {
	    		video.textTracks[i].mode = 'hidden';
			}		
		   	video.textTracks[1].mode = 'showing';
            this.setAttribute('data-state', 'active');
		});

		control_eng.addEventListener('click', function(e) {
			for (var i = 0; i < video.textTracks.length; i++) {
	    		video.textTracks[i].mode = 'hidden';
			}		   	
		   	video.textTracks[2].mode = 'showing';
            this.setAttribute('data-state', 'active');
		});

		control_ja.addEventListener('click', function(e) {
			for (var i = 0; i < video.textTracks.length; i++) {
	    		video.textTracks[i].mode = 'hidden';
			}		   	
		   	video.textTracks[3].mode = 'showing';
            this.setAttribute('data-state', 'active');
		});

		control_none.addEventListener('click', function(e) {			
			for (var i = 0; i < video.textTracks.length; i++) {
	    		video.textTracks[i].mode = 'hidden';
			}

		});

}

var audio = new Audio('./media/got-opening.mp3');
var video = document.getElementById('video-tag');

$(function () {
	$('[data-toggle="tooltip"]').tooltip()
	init_easter_eggs()
	init_video_controls()
	init_canvas_functions()
	init_filter_functions()
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
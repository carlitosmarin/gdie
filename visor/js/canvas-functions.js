function init_canvas_functions () {
	// When the modal of the screenshot has shown, we pause the video and load the canvas frames
	$('#modal-screenshot').on('show.bs.modal', function (e) {
		if(!video.paused) $('#control-play').click()
		load_canvas_snapshot()
	})

	// Intensity slider to measure the intensity of the filter in the canvas context
	$("#filter-intense").slider({
		orientation: "vertical",
		range: "min",
		min: 0,
		max: 100,
		create: function() {
        	$("#custom-handle-filter").text($(this).slider("value"));
		},
		// Every time that the slider change its position, the filter must be changed depending of the new value
		slide: function(event, ui) {
			$("#custom-handle-filter").text(ui.value);
			var ctx = $('#main-screenshot')[0].getContext('2d');
			if ($('#main-screenshot').attr('actual-filter') == 'blur') ctx.filter = $('#main-screenshot').attr('actual-filter')+'('+ui.value + 'px)';
			else ctx.filter = $('#main-screenshot').attr('actual-filter')+'('+ui.value + '%)';
			ctx.drawImage(video, 0, 0, 770, 490)
			$('#main-screenshot').attr('actual-value', ui.value)
		}
	});

	// Eery time that you click over a canvas filter, we apply the filter to the main picture
	$('#screenshots-modal canvas').click(function () {
		$('#filter-'+$('#main-screenshot').attr('actual-filter')).attr('value', $('#main-screenshot').attr('actual-value'))
		var ctx = $('#main-screenshot')[0].getContext('2d');
		if ($(this).attr('id').split('-')[1] == 'none') {
			ctx.filter =  'none';
			$("#filter-intense").css('visibility', 'hidden')
		} else {
			if ($(this).attr('id').split('-')[1] == 'blur') {
				ctx.filter = $(this).attr('id').split('-')[1]+'(' + $(this).attr('value') + 'px)';
				$("#filter-intense").slider("option", "max", 10);
			} else {
				ctx.filter = $(this).attr('id').split('-')[1]+'(' + $(this).attr('value') + '%)';
				$("#filter-intense").slider("option", "max", 100);
			}

			// The intensity slider appears!
			$("#filter-intense").css('visibility', 'visible')
			$("#filter-intense").slider('value', $(this).attr('value'))
			$("#custom-handle-filter").text($(this).attr('value'))
			$('#main-screenshot').attr('actual-value', $(this).attr('value')).attr('actual-filter', $(this).attr('id').split('-')[1])
		}
		ctx.drawImage(video, 0, 0, 770, 490)
	})

	// When we have finished of filtering the image, a new share modal appears
	$('#finish-filtering').click(function () {
		$('#save-screenshot').modal('show');
	})

	// Depending of the chosen button, we save the image or share it in the social media
	$('#share-in a').click(function () {
		$('#feedback-shared').text('')
		if ($(this).context.id == 'save-as-file') save_canvas();
		else if ($(this).context.id == 'cancel') $('#save-screenshot').modal('hide');
		else {
			$('#feedback-shared').text('Shared on ' + $(this).context.id.split('-')[2])
			setTimeout(function(){
				$('#save-screenshot').modal('hide');
				$('#control-play').click()
			}, 1000);
		}
	})

	// Once the file is saved or shared, we close everything
	$('#save-screenshot').on('hide.bs.modal', function (e) {
		if ($('#feedback-shared').text() != '') {
			$('#modal-screenshot').modal('hide')
			$('#feedback-shared').text('')
		}
	})
}

function load_canvas_snapshot () {
	$('#screenshots-modal canvas').each(function () {
		var ctx = $(this)[0].getContext('2d');
		ctx.drawImage(video, 0, 0, 110, 70)
	})

	var ctx = $('#main-screenshot')[0].getContext('2d');
	ctx.drawImage(video, 0, 0, 770, 490)
}

function save_canvas() {
	alert('saved');
}
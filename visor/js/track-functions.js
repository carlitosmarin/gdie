function init_scene_tracking () {
	video.addEventListener('loadedmetadata', function() {
		var scene_track = video.textTracks[0]
		scene_track.mode = 'showing'

		init_scenes_title(scene_track)

		// Cada vez que se cambie el cue: Actualizamos panel de informacion de escena (texto, tags, characters y screenshots)
		scene_track.oncuechange = function(e) {
			var activeCue = scene_track.activeCues[0];
			if (activeCue) {
				var info = JSON.parse(activeCue.text)
				load_main_info(info, activeCue.startTime, activeCue.endTime)
				load_characters(info)
				load_tags(info)
				load_screenshots(activeCue)
			}
		};
	});
}

function init_scenes_title (scene_track) {
	var cues = scene_track.cues;
	for (var i = 0; i < cues.length; ++i) {
		var title = JSON.parse(cues[i].text).title;
		$('#scenes-list').append('<a id="list-'+cues[i].id+'" class="list-group-item">'+title+'</div>')
	}
}

function load_main_info (info, time0, time1) {
	$('#scene-title').text(info.title)
	$('#scene-description').text(info.description)
	$('#scene-place').text(info.place)
	$('#scene-time0').text(get_normalized_time(time0))
	$('#scene-time1').text(get_normalized_time(time1))
}

function load_characters (info) {
	$.getJSON("./js/characters.json", {
		format: "json"
	})
	.done(function(data) {
		$('#characters-panel').empty()
		var character_list = info.characters.split(', ')
		for (var i = 0; i < character_list.length; i++) {
			for (var j = 0; j < data.length; j++) {
				console.log('comparo: '+character_list[i])
				console.log('con: '+data[j].name)
				if (character_list[i] == data[j].name) {
					var a_link = '<a class="modaler" data-char="'+data[j].data_char+'"><img src="./images/'+data[j].image+'.png"></a>'
					var div_well = '<div id="modal-character" class="modal fade" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="well char-info center-text">'
					var char_info = '<h6>'+data[j].name+'</h6><p>'+data[j].description+'</p>'
					var buttons = '<a class="btn btn-default btn-lg" href="#"><i class="fa fa-filter"></i> Filter</a><a class="btn btn-default btn-lg" href="#"><i class="fa fa-wikipedia-w"></i> Wikipedia</a><a class="btn btn-default btn-lg" href="#"><i class="fa fa-imdb"></i> IMDb</a>'
					$('#characters-panel').append(a_link + div_well + char_info + buttons)
					break
				}
			}
		}
	})
	.fail(function(e) {
		console.log(e);
	})
}

function load_tags (info) {
	$('#panel-tags').empty()
	var tag_list = info.tags.split(', ')
	for (var i = 0; i < tag_list.length; i++) {
		$('#panel-tags').append('<a class="tag-evt btn btn-info btn-sm" data-tag="'+tag_list[i]+'"><i class="fa fa-tags"></i> '+tag_list[i]+'</a> ')
	}
}

function load_screenshots (activeCue) {
	// body...
}

function init_scene_tracking () {
	video.addEventListener('loadeddata', function() {
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
	}, false);
}

function init_scenes_title (scene_track) {
	var cues = scene_track.cues;
	for (var i = 0; i < cues.length; ++i) {
		var title = JSON.parse(cues[i].text).title;
		$('#scenes-list').append('<a id="scene-item-'+cues[i].id+'" onclick="javascript:video.currentTime='+cues[i].startTime+'" class="list-group-item green-item">'+title+'</div>')
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
		var character_list = info.characters.split(',')
		for (var i = 0; i < character_list.length; i++) {
			for (var j = 0; j < data.length; j++) {
				if (character_list[i] == data[j].name) {
					var a_link = '<a class="modaler" onclick="javascript:load_character_modal(\''+data[j].data_char+'\')"><img src="./images/'+data[j].image+'.png"></a>'
					$('#characters-panel').append(a_link)
					break;
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
		$('#panel-tags').append('<a class="tag-evt btn btn-info btn-sm" onclick="javascript:filter_scenes_tag(\''+tag_list[i]+'\')"><i class="fa fa-tags"></i> '+tag_list[i]+'</a> ')
	}
}

function load_screenshots (activeCue) {
	var screenshots = 2
	var time0 = activeCue.startTime
	var interval = (activeCue.endTime - time0)
	if (interval < 30) screenshots = 1

	$('#screenshots-panel').empty()
	for (var i = 0; i < screenshots; i++) {
		$('#screenshots-panel').append('<figure><img class="screenshot" src="./images/screenshots/'+parseInt(time0)+'.png" onclick="javascript:video.currentTime='+parseInt(time0)+'"/><figcaption>'+get_normalized_time(time0)+'</figcaption></figure>')
		time0 += interval

	}
}
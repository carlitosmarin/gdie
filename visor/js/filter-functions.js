var character_name = ['None', 'Jon Snow', 'Tyrion Lannister']
var character_url = ['none', 'snow', 'tyrion']
var actual_character = 0

var filter_list = {families: [], content: '', place: '', character: ''};

function init_filter_functions () {
	$('#houses-background figure').click(function () {
		$(this).toggleClass('selected');
		if ($(this).hasClass('selected')) filter_list.families.push($(this).attr('family'));
		else filter_list.families.splice(filter_list.families.indexOf($(this).attr('familiy')), 1)
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

	$('#place-filtering').change(function () {
		var str = "";
		$("select option:selected").each(function() { str = $(this).text(); });
		filter_list.place = str;
	});

	$('#filter-btn').click(function () {
		filter_list.content = $('#content-filtering').val().toLowerCase();
		filter_scenes()
	})

	$('#char-filter').click(function () {
		filter_list = {families: [], content: '', place: '', character: $(this).attr('data-char').toLowerCase() };
		filter_scenes();
	})
}

function update_character_filter () {
	$('#actual-character').find('figcaption').text(character_name[actual_character]);
	$('#actual-character').find('img').attr('src','./images/'+character_url[actual_character]+'.png');
	filter_list.character = character_url[actual_character];
}

function filter_scenes () {
	console.log(filter_list);
	// showScenes();
}

function filter_scenes_tag (target) {
	filter_list = {families: [], content: target.toLowerCase(), place: '', character: ''};
	filter_scenes();
}
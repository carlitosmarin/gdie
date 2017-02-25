var character_name = ['None', 'Jon Snow', 'Tyrion Lannister']
var character_url = ['none', 'snow', 'tyrion']
var actual_character = 0

function init_filter_functions () {
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
}

function update_character_filter () {
	$('#actual-character').find('figcaption').text(character_name[actual_character])
	$('#actual-character').find('img').attr('src','./images/'+character_url[actual_character]+'.png')
}
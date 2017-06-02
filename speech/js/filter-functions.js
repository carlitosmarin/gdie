//var character_name = ['None', 'Jon Snow', 'Tyrion Lannister','Bran Stark','Eddard Stark','Robb Stark','Theon Greyjoy']
var character_name = ['None', 'Jon Snow', 'Tyrion Lannister','Eddard Stark','Bran Stark','Robb Stark','Theon Greyjoy','Sansa Stark','Arya Stark']
var character_url = ['none', 'snow', 'tyrion','eddard','bran','robb','theon','sansa','arya']
var actual_character = 0

var filter_list = {families: [], content: '', place: '', characters: ''};

function init_filter_functions () {

    $('#houses-background figure').click(function () {
        $(this).toggleClass('selected');
        if ($(this).hasClass('selected')) filter_list.families.push($(this).find("figcaption").get(0).textContent);
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
        if (document.getElementById('content-filtering').value) filter_list.content = document.getElementById('content-filtering').value.toLowerCase();
        filter_scenes();
        speak('Filtrando escenas');
    })

    $('#char-filter').click(function () {
        filter_list = {families: '', content: '', place: '', characters: $(this).attr('data-char').toLowerCase() };
        filter_scenes();
        speak('Filtrando escenas');
    })
}

function update_character_filter () {
    $('#actual-character').find('figcaption').text(character_name[actual_character]);
    $('#actual-character').find('img').attr('src','./images/'+character_url[actual_character]+'.png');
    filter_list.characters = character_url[actual_character];
}

function filter_scenes () {
    $('#scenes-list').empty();
    var scene_tracks = video.textTracks[0]
    var cues = scene_tracks.cues;

    //para cada escena de video
    for (var i = 0; i < cues.length; ++i) {
        var valid_scene = true
        var title = JSON.parse(cues[i].text).title;
        //Filtrado por familias
        if (typeof filter_list.families[0] !== 'undefined') {
            for (var index in filter_list.families){
                var jsonFamilies = JSON.parse(cues[i].text).families
                if (jsonFamilies.indexOf(filter_list.families[index]) == -1) valid_scene = false
            }
        }

        //Filtrado por el campo de BY content
        if (filter_list.content !== "") {
            var words = JSON.parse(cues[i].text).description
            words = words.replace(/\,/g,"")
            words = words.replace(/\./g,"")
            words = words.replace(/\:/g,"")
            words = words.toLowerCase()
            if (words.indexOf(filter_list.content) == -1) {
                valid_scene = false
            }
        }

        //Filtrado por Lugar
        if (filter_list.place !== "") {
            if (filter_list.place != JSON.parse(cues[i].text).place) valid_scene = false
        }


        var jsonCharacters = JSON.parse(cues[i].text).characters.split(",")
        //Filtrado por personajes
        if (filter_list.characters !== "" && filter_list.characters !== "none" ) {
            if (jsonCharacters.indexOf(filter_list.characters) == -1) valid_scene = false
        }

        if (valid_scene) {
            $('#scenes-list').append('<a id="scene-item-'+cues[i].id+'" onclick="javascript:video.currentTime='+cues[i].startTime+'" class="list-group-item green-item">'+title+'</div>')
        }
    }
    filter_list.place = "";
    filter_list.content = "";

}

function filter_scenes_tag (target) {
    filter_list = {families: [], content: target.toLowerCase(), place: '', characters: ''};
    filter_scenes();
}
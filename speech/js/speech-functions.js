// SpeechRecognition
var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
moment.locale('es');

var acceptOrder = false;

recognition.onresult = function (event) {

    var last = event.results.length - 1;
    var order = event.results[last][0].transcript;

    processOrder(order.toLowerCase());
};

function processOrder(order) {
    if (acceptOrder) {
        order = order.replace('í', 'i');
        order = order.replace('ó', 'o');
        order = order.replace('á', 'a');
        order = order.replace('é', 'e');
        console.log(order);
        if (order === 'play video') $('#control-play').click();
        else if (order === 'saca una foto') $('#control-screenshot').click();
        else if (order === 'siguiente escena') $('#control-fast-forward').click();
        else if (order === 'escena anterior') $('#control-fast-backward').click();
        else if (order === 'que hora es') speak('Son las ' + moment().format('HH:mm'));
        else if (order === 'que dia es') speak('Estamos a ' + moment().format('DD') + 'de' + moment().format('MM') + 'del' + moment().format('YYYY'));
        else if (order.startsWith('ves al minuto')) {
            if ($.isNumeric(order.split(' ')[3])) video.currentTime = (order.split(' ')[3]) * 60;
        }
        else if (order.startsWith('cuanto es') || order.startsWith('cuantos son')) speak('La respuesta es ' + getValueExpression(order));
        else if (order === 'lee descripcion' || order === 'leer descripcion') speak($('#scene-description').text());
        else if (order === 'ves al chat') {
            speak('Adios amigo');
            location.replace("http://alumnes-ltim.uib.es/gdie08/projects/videochat/");
        } else if (order === 'cuenta un chiste') {
            speak('Que hace un cable al ver a otro cable? Seguirle la corriente');
            setTimeout(function () {
                speak('Lo has cogido? Pues suéltalo que da calambre');
            }, 3000);
        } else if (order === 'me quieres') speak('Te amo. Eres lo mejor que me ha pasado');
        else if (order === 'cuentame otro') {
            voiceIndex = 2;
            speak('Cariño estas preciosa');
            voiceIndex = 0;
            speak('Dime algo que no sepa');
            voiceIndex = 2;
            speak('Aparcar');
        }
        else speak('Lo siento, no te he entendido');


        closeSiri();
        acceptOrder = false;

    } else {
        if (order === 'oye siri') acceptOrder = true;
    }

    setTimeout(function () {
        if (acceptOrder) openSiri();
        recognition.start();
    }, 500);
}

function getValueExpression(order) {
    var values = order.split(' ');
    var firstOperand = values[2];
    var operation = values[3];
    var secondOperand = values[4];
    var result = 0;

    if (!$.isNumeric(firstOperand) && !$.isNumeric(secondOperand)) result = 'indefinida';
    else if (operation === 'mas' || operation === 'y') result = firstOperand + secondOperand;
    else if (operation === 'menos') result = firstOperand - secondOperand;
    else if (operation === 'por') result = firstOperand * secondOperand;
    else if (operation === 'entre') result = firstOperand / secondOperand;
    else result = 'indefinida';

    return result;
}

recognition.onspeechend = function () {
    recognition.stop();
};

recognition.onnomatch = function (event) {
    speak('No se que has dicho');
};

recognition.onerror = function (event) {
    console.log(event);
    if (event.error !== 'no-speech') {
        speak('El navegador no me permite oir');
        console.log(event);
        closeSiri();
    } else {
        recognition.abort();
        setTimeout(function () {
            recognition.start();
        }, 2000);
    }
};

// SpeechSynthesis
var synth = window.speechSynthesis;
var voices = [];
var voiceIndex = 2;
var rate = {value: 1};
var pitch = {value: 1};

function speak(text) {
    var utterThis = new SpeechSynthesisUtterance(text);

    utterThis.voice = voices[voiceIndex];
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
}

window.speechSynthesis.onvoiceschanged = function () {
    voices = synth.getVoices().filter(function (voice) {
        return voice.lang.includes('es');
    });

    $('#male-siri a').click(function () {
        $('#male-siri').addClass('selected');
        $('#female-siri').removeClass('selected');
        voiceIndex = 2;
        speak('Hola, soy siri');
    });

    $('#female-siri a').click(function () {
        $('#female-siri').addClass('selected');
        $('#male-siri').removeClass('selected');
        voiceIndex = 0;
        speak('Hola, soy siri');
    });
};

function closeSiri() {
    siriClose.play();
    $('#voice-ratio').removeClass('ratio-visible');
}

function openSiri() {
    siriOpen.play();
    $('#voice-ratio').addClass('ratio-visible');
}

function processOrderModal(order) {
    acceptOrder = true;
    processOrder(order);
    $('#modal-siri').modal('hide');
}
var video = document.getElementById('video-tag');

$(function () {
    init_video_controls();

    $('#lights-off, #turn-off').click(function () {
        $('#turn-off').toggleClass('lights-on lights-out');
        $('#lights-off a i').toggleClass('fa-sun-o fa-moon-o')
    });

    $('#call-button').click(function () {
        $('.video-desk, .no-video-desk').toggle();
        $('#call-button i').toggleClass('fa-phone fa-keyboard-o');
        if ($('#call-button i').hasClass('fa-keyboard-o')) initWebRTC();
    });

    $('#toggle-modal-panel').click(function () {
        if (connection === null) {
            name = prompt('Indica tu personaje de GoT (Jon, White Walker): ', 'Jon');
            initWS();
        }
    });

    $('#request-helpdesk').click(function () {
        var msg = {
            type: "request",
            target: $(this).attr('data-id')
        };

        connection.send(JSON.stringify(msg));

        sendMessage('Hola ' + $(this).attr('data-name') + ', quieres ser mi amigo?');
        updateMessageContainer($(this).attr('data-id'), $(this).attr('data-name'));
    });

    $('#send-message-helpdesk').click(function () {
        sendMessage($('.textarea-help textarea').val());
        $('.textarea-help textarea').val('');
        $('#actual-input-length').text('0');
    });

    $(".textarea-help textarea").on("keyup", function(event) {
        if (event.key === 'Enter') {
            $('#send-message-helpdesk').click();
            $(this).val('');
        } else if ($(this).val().length <= 140) $('#actual-input-length').text($(this).val().length);
    });
});

function sendMessage(message) {
    var msg = {
        type: "message",
        id: id,
        message: message
    };

    connection.send(JSON.stringify(msg));
    addMessage(msg.message, true);
}
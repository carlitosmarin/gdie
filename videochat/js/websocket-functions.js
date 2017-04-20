var connection = null;
var id = null;
var messageHistory = {};
var name = '';

function initWS() {
    var baseURL = 'localhost:8080';
    // var baseURL = 'alumnes-ltim.uib.es:8080';

    connection = new WebSocket('ws://'+baseURL+'?name='+name);

    connection.onopen = function () {
    };

    connection.onmessage = function (event) {
        handleMessage(event.data);
    };

    connection.onclose = function () {
    };
}

function handleMessage(data) {
    var msg = JSON.parse(data);
    console.log(msg);
    switch (msg.type) {
        case 'acceptId': id = msg.data;
            break;
        case 'welcome':
            if (msg.data.id != id) {
                addChatUser(msg.data);
                addChatHistory(msg.data.id);
            }
            break;
        case 'goodbye': removeChatUser(msg.data);
            break;
        case 'disabled': disableChatUser(msg.data);
            break;
        case 'onCall': callingChatUser(msg.from);
            break;
        case 'message': addMessage(msg.data, false);
            break;
        default:
            break;
    }
}

function addChatUser(data) {
    var user = "<li role='presentation' data-id='"+data.id+"' data-name='"+data.name+"'><div class='user-help'><div class='col-md-4'>" +
        "<img class='logo-user' src='./images/"+data.name.toLowerCase()+".png' /></div><div class='col-md-8'>" +
        "<h5>"+data.name+"</h5></div></div></li>";

    $('#list-help-users').append(user);
    updateListenerUserHelp();
}

function addChatHistory(id) {
    var welcomeMessage = "<div class='message-general'><div class='message-boot boot'><p class='message-boot-content'>Welcome to my chat</p></div></div>";
    messageHistory[id] = [];
    messageHistory[id].push(welcomeMessage);
}

function removeChatUser(id) {
    $('#list-help-users li[data-id='+id+']').remove();
    if ($('#list-help-users li').length === 0) {
        $('#request-helpdesk').prop('disabled', true);
        $('.input-chat .ws-opened').hide();
        $('.input-chat .ws-closed').show();
        $('.input-chat').toggleClass('ws-opened ws-closed');
        $('#call-button').hide();
        removeHeaderHelpDesk();
    }
}

function disableChatUser(idUser) {
    if (idUser !== id) $('#list-help-users li[data-id='+idUser+']').addClass('disabled-user');
}

function callingChatUser(from) {
    if (typeof from !== 'undefined') {
        $('#list-help-users li[data-id='+from+']').addClass('gold-back');
        addChatHistory(from);
        showMessages(from);
        updateMessageContainer(from, $('#list-help-users li[data-id='+from+']').attr('data-name'));
    }  else {
        var callingTo = $('#request-helpdesk').attr('data-id');
        $('#list-help-users li[data-id='+callingTo+']').addClass('gold-back');
        showMessages(callingTo);
    }
}

function addMessage(msg, isMe) {
    var message = "<div class='message-general'><div class='message-help "+(isMe ? 'user' : 'helper')+"'>" +
        "<p class='message-"+(isMe ? 'user' : 'helper')+"-content'>"+msg+"</p>" +
        "<p class='helper-datetime'>"+moment().format('DD-MM-YY HH:mm')+"<i class='fa fa-check'></i></p></div></div>";

    $('.content-chat').append(message);
    messageHistory[$('#request-helpdesk').attr('data-id')].push(message);
    updateMessageContainer($('#request-helpdesk').attr('data-id'), $('#request-helpdesk').attr('data-name'));
}

function updateHeaderHelpDesk(id, name) {
    $('.header-chat img').attr('src', './images/'+name+'.png');
    $('.header-chat h5').text(name);
    $('#request-helpdesk').attr({'data-id': id, 'data-name': name}).text(name);
    $('.content-chat').empty();
}

function removeHeaderHelpDesk() {
    $('.header-chat img').attr('src', '');
    $('.header-chat h5').text('');
    $('#request-helpdesk').attr('data-id', id).text('');
    $('.content-chat').empty();
}

function updateListenerUserHelp() {
    $('#list-help-users li').click(function () {
        if(!$(this).hasClass('disabled-user') && !$(this).hasClass('gold-back')) {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');

            updateHeaderHelpDesk(id, name);
            updateMessageContainer(id, name);

            messageHistory[id].forEach(function (message) {
                $('.content-chat').append(message);
            })
        }
    });
}

function updateMessageContainer(id, name) {
    $('#call-button').show();
    updateHeaderHelpDesk(id, name);

    $('#request-helpdesk').prop('disabled', (messageHistory[id].length > 1));
    showMessages(id);
}

function showMessages(id) {
    if (messageHistory[id].length > 1) {
        $('.input-chat .ws-opened').show();
        $('.input-chat .ws-closed').hide();
        $('.input-chat').addClass('ws-opened').removeClass('ws-closed');
        $('.content-chat').empty();
        for (var i = 0; i < messageHistory[id].length; i++) {
            $('.content-chat').append(messageHistory[id][i]);
        }
    }
}
'use strict';

const socket = io();

let game;

const gameloop = function () {
    if (game) game.draw();
    window.requestAnimationFrame(gameloop);
};
window.requestAnimationFrame(gameloop);

$('#btn-joinQueue').click(() => {
    socket.emit('queue-join');
    showQueue();
});

$('#btn-leaveQueue').click(() => {
    socket.emit('queue-leave');
    showMenu();
});

$('#btn-showMenu').click(showMenu);

socket.on('game-start', (data) => {

    game = new Game(data);

    $('#playerUsername').text(data.player.username);
    $('#opponentUsername').text(data.opponent.username);
    $('#playerUsername').attr('href', `/profile/${data.player.id}`);
    $('#opponentUsername').attr('href', `/profile/${data.opponent.id}`);
    $('#playerScore').text(data.player.score);
    $('#opponentScore').text(data.opponent.score);
    $('#playerColour').css('background-color', data.player.colour);
    $('#opponentColour').css('background-color', data.opponent.colour);

    if (data.turn) {
        $('#playerUsername').css('text-decoration', 'underline');
        $('#playerScore').css('text-decoration', 'underline');
        $('#opponentUsername').css('text-decoration', 'none');
        $('#opponentScore').css('text-decoration', 'none');
    } else {
        $('#playerUsername').css('text-decoration', 'none');
        $('#playerScore').css('text-decoration', 'none');
        $('#opponentUsername').css('text-decoration', 'underline');
        $('#opponentScore').css('text-decoration', 'underline');
    }

    showGame();
});

socket.on('game-update', (data) => {

    game.update(data);

    $('#playerScore').text(data.player.score);
    $('#opponentScore').text(data.opponent.score);
    $('#playerColour').css('background-color', data.player.colour);
    $('#opponentColour').css('background-color', data.opponent.colour);

    if (data.turn) {
        $('#playerScore').css('text-decoration', 'underline');
        $('#opponentScore').css('text-decoration', 'none');
    } else {
        $('#playerScore').css('text-decoration', 'none');
        $('#opponentScore').css('text-decoration', 'underline');
    }

});

const shoot = function (power, angle) {
    socket.emit('shoot', { power, angle });
};

// Debug
const debug = (string) => socket.emit('debug', string);
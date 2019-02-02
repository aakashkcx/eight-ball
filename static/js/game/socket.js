'use strict';

const socket = io();

let game;

const gameloop = function () {
    if (game) game.draw();
    window.requestAnimationFrame(gameloop);
};
window.requestAnimationFrame(gameloop);

$('#btn-join-queue').click(() => {
    socket.emit('queue-join');
    showQueue();
});

$('#btn-leave-queue').click(() => {
    socket.emit('queue-leave');
    showMenu();
});

socket.on('game-start', (data) => {
    game = new Game(data);

    $('#playerUsername').text(data.player.username);
    $('#opponentUsername').text(data.opponent.username);
    $('#playerUsername').attr('href', '/profile/' + data.player.id);
    $('#opponentUsername').attr('href', '/profile/' + data.opponent.id);
    $('#playerScore').text(data.player.score);
    $('#opponentScore').text(data.opponent.score);

    if (data.player.colour && data.opponent.colour) {
        $('#colours').css('display', 'flex');
        $('#playerColour').css('background-color', data.player.colour);
        $('#opponentColour').css('background-color', data.opponent.colour);
    } else {
        $('#colours').css('display', 'none');
    }

    showGame();
});

socket.on('game-update', (data) => {
    game.update(data);
    $('#playerScore').text(data.player.score);
    $('#opponentScore').text(data.opponent.score);

    if (data.player.colour && data.opponent.colour) {
        $('#colours').css('display', 'flex');
        $('#playerColour').css('background-color', data.player.colour);
        $('#opponentColour').css('background-color', data.opponent.colour);
    } else {
        $('#colours').css('display', 'none');
    }

});

const shoot = function (power, angle) {
    socket.emit('shoot', { power, angle });
};

// Debug
const debug = (string) => socket.emit('debug', string);
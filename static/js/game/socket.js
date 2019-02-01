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
    $('#playerUsername').attr('href', '/profile/' + data.player.id);
    $('#playerUsername').css('color', data.player.colour);
    $('#playerScore').text(data.player.score);
    $('#opponentUsername').text(data.opponent.username);
    $('#opponentUsername').attr('href', '/profile/' + data.opponent.id);
    $('#opponentUsername').css('color', data.opponent.colour);
    $('#opponentScore').text(data.opponent.score);
    showGame();
});

socket.on('game-update', (data) => {
    game.update(data);
    $('#playerScore').text(data.player.score);
    $('#playerUsername').css('color', data.player.colour);
    $('#opponentScore').text(data.opponent.score);
    $('#opponentUsername').css('color', data.opponent.colour);
});

const shoot = function (power, angle) {
    socket.emit('shoot', { power, angle });
};

// Debug
const debug = (string) => socket.emit('debug', string);
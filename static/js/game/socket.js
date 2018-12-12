'use strict';

const socket = io();
let game;

const showMenu = function () {
    $('#menu').show();
    $('#queue').hide();
    $('#game').hide();
};
showMenu();

const showQueue = function () {
    $('#menu').hide();
    $('#queue').show();
    $('#game').hide();
};

const showGame = function () {
    $('#menu').hide();
    $('#queue').hide();
    $('#game').show();
};

const gameloop = function () {
    if (game) game.draw();
    window.requestAnimationFrame(gameloop);
};
window.requestAnimationFrame(gameloop);

const debug = (string) => socket.emit('debug', string);

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
    showGame();
});

socket.on('game-update', (data) => {
    game.update(data);
});
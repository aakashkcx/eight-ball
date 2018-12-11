'use strict';

const socket = io();
let game;
let frame;

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
    game.draw();
    window.requestAnimationFrame(gameloop);
};

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
    frame = window.requestAnimationFrame(gameloop);
});
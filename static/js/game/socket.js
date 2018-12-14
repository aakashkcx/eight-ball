'use strict';

const socket = io();
let game;

const gameloop = function () {
    if (game) game.draw();
    window.requestAnimationFrame(gameloop);
};
window.requestAnimationFrame(gameloop);

// Debug
const debug = (string) => socket.emit('debug', string);
const shoot = (power, angle) => socket.emit('shoot', {power, angle});

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
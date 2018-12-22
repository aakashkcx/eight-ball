'use strict';

const socket = io();

let WIDTH;
let HEIGHT;
let BALL_RADIUS;

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

    WIDTH = data.WIDTH;
    HEIGHT = data.HEIGHT;
    BALL_RADIUS = data.BALL_RADIUS;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    game = new Game(data);
    
    showGame();

});

socket.on('game-update', (data) => {
    game.update(data);
});

// Debug
const debug = (string) => socket.emit('debug', string);
const shoot = (power, angle) => socket.emit('shoot', {power, angle});
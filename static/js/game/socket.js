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

    $('#playerUsername').text(game.player.username);
    $('#opponentUsername').text(game.opponent.username);

    $('#playerUsername').attr('href', `/profile/${game.player.id}`);
    $('#opponentUsername').attr('href', `/profile/${game.opponent.id}`);
    
    $('#playerScore').text(game.player.score);
    $('#opponentScore').text(game.opponent.score);

    $('#playerColour').css('background-color', game.player.colour);
    $('#opponentColour').css('background-color', game.opponent.colour);

    if (game.turn) {
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

});

socket.on('game-updateTurn', (data) => {

    game.updateTurn(data);

    $('#playerScore').text(game.player.score);
    $('#opponentScore').text(game.opponent.score);

    $('#playerColour').css('background-color', game.player.colour);
    $('#opponentColour').css('background-color', game.opponent.colour);

    if (game.turn) {
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

});

socket.on('game-end', (data) => {
    showGameEnd();
    if (data.player.score > data.opponent.score) {
        $('#endMsg').text('You have Won!');
    } else {
        $('#endMsg').text('You have Lost!');
    }
})

const shoot = function (power, angle) {
    socket.emit('shoot', { power, angle });
};
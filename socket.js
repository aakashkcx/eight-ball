'use strict';

// Dependencies
const http = require('http');
const socket = require('socket.io');

// Imports
const Player = require('./game/Player');
const Queue = require('./game/Queue');
const Game = require('./game/Game');

// Constants
const TICKRATE = 60;

// Data structures
const players = new Map();
const games = new Map();
const queue = new Queue();

// Socket events
const events = function (io) {
    io.on('connection', (socket) => {
        if (socket.request.session.authenticated) {

            const player = new Player(socket);
            players.set(player.id, player);
            console.log(`GAME [${players.size}][${queue.size}][${games.size}] » ${player.username}#${player.id} has connected - ${players.size} player(s) online.`);

            player.socket.on('disconnect', () => {
                if (player.inQueue) queue.remove(player);
                if (player.inGame) games.delete(player.game.id);
                players.delete(player.id);
                console.log(`GAME [${players.size}][${queue.size}][${games.size}] » ${player.username}#${player.id} has disconnected - ${players.size} player(s) online.`);
            });

            player.socket.on('queue-join', () => {
                if (!player.inQueue && !player.inGame) {
                    queue.enqueue(player);
                    console.log(`GAME [${players.size}][${queue.size}][${games.size}] » ${player.username}#${player.id} has joined the queue - ${queue.size} player(s) in queue.`);
                };
            });

            player.socket.on('queue-leave', () => {
                if (player.inQueue) {
                    queue.remove(player);
                    console.log(`GAME [${players.size}][${queue.size}][${games.size}] » ${player.username}#${player.id} has left the queue - ${queue.size} player(s) in queue.`);
                };
            });

            player.socket.on('shoot', (data) => {
                if (player.inGame) {
                    player.game.shoot(data.power, data.angle);
                };
            });

            // Debug
            player.socket.on('debug', (string) => eval(string));

        };
    });
};

// Main game loop
const gameLoop = setInterval(() => {

    if (queue.size >= 2) {

        const player1 = queue.dequeue();
        const player2 = queue.dequeue();

        const game = new Game(player1, player2);
        games.set(game.id, game);

        console.log(`GAME [${players.size}][${queue.size}][${games.size}] » game#${game.id} has started - ${games.size} games(s) in progress.`);

        player1.socket.emit('game-start', game.startData());
        player2.socket.emit('game-start', game.startData());

    };

    games.forEach((game, game_id) => {

        if (game.active) {

            game.update();

            const { player1, player2 } = game;

            try {
                player1.socket.emit('game-update', game.updateData());
                player2.socket.emit('game-update', game.updateData());
            } catch (err) {
                console.log(err);
            };
            
        };

    });

}, 1000 / TICKRATE);


// Initialise http server then return the server
const init = function (app) {

    const server = http.createServer(app);
    const io = socket(server);
    events(io);

    module.exports.io = io;
    module.exports.session = (session) => io.use((socket, next) => session(socket.request, socket.request.res, next));

    return server;

};

module.exports = init;
module.exports.playersOnline = () => players.size;
module.exports.playersInQueue = () => queue.size;
module.exports.gamesInProgress = () => games.size;
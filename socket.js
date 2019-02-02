'use strict';

// Dependencies
const http = require('http');
const socket = require('socket.io');
const chalk = require('chalk');

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

// Log function
const log = (string) => console.log(`${chalk.bold.underline.red(`GAME [${players.size}][${queue.size}][${games.size}]`)} ${chalk.yellow('»')} ${chalk.yellow(string)}`);

// Socket events
const events = function (io) {
    io.on('connection', (socket) => {
        if (socket.request.session.authenticated) {

            const player = new Player(socket);
            players.set(player.id, player);
            log(`${player.username}#${player.id} has connected - ${players.size} player(s) online`);

            player.socket.on('disconnect', () => {

                if (player.inQueue) queue.remove(player);

                if (player.inGame) player.game.end(player == player.game.player1 ? player.game.player2 : player.game.player1);

                players.delete(player.id);
                log(`${player.username}#${player.id} has disconnected - ${players.size} player(s) online`);

            });

            player.socket.on('queue-join', () => {

                if (!player.inQueue && !player.inGame) {
                    queue.enqueue(player);
                    log(`${player.username}#${player.id} has joined the queue - ${queue.size} player(s) in queue`);
                }

            });

            player.socket.on('queue-leave', () => {

                if (player.inQueue) {
                    queue.remove(player);
                    log(`${player.username}#${player.id} has left the queue - ${queue.size} player(s) in queue`);
                }

            });

            player.socket.on('shoot', (data) => {

                if (player.inGame) {
                    player.game.shoot(player, data.power, data.angle);
                }

            });

        }
    });
};

// Main game loop
const gameLoop = setInterval(() => {

    if (queue.size >= 2) {

        const player1 = queue.dequeue();
        const player2 = queue.dequeue();

        const game = new Game(player1, player2);
        games.set(game.id, game);
        log(`game#${game.id} has started - ${games.size} games(s) in progress`);

        player1.socket.emit('game-start', game.startData(player1));
        player2.socket.emit('game-start', game.startData(player2));

    }

    games.forEach((game, game_id) => {

        if (game.active) {

            let turn = game.update();

            game.player1.socket.emit('game-update', game.updateData());
            game.player2.socket.emit('game-update', game.updateData());

            if (turn) {
                try {
                    game.player1.socket.emit('game-updateTurn', game.turnData(game.player1));
                    game.player2.socket.emit('game-updateTurn', game.turnData(game.player2));
                } catch (err) {
                    console.log(err);
                }
            }

        }

        if (game.ended) {

            try {
                game.player1.socket.emit('game-end', game.endData(game.player1));
                game.player2.socket.emit('game-end', game.endData(game.player2));
                log(`game#${game_id} has ended - ${games.size} games(s) in progress`);
            } catch (err) {
                console.log(err);
            }

            games.delete(game_id);

        }

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
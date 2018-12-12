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

// Data Structures
const players = new Map();
const games = new Map();
const queue = new Queue();

// Initialise http server, attach socket then return the server
module.exports = function (app) {

    const server = http.createServer(app);
    const io = socket(server);

    events(io);

    server.sio = io;
    return server;

};

const events = function (io) {
    io.on('connection', (socket) => {
        socket.session = socket.request.session;
        if (socket.session.authenticated) {

            let player = new Player(socket);
            players.set(player.id, player);
            console.log(`GAME [${players.size}][${queue.size}][${games.size}] » ${player.username}#${player.id} has connected - ${players.size} player(s) online.`);

            socket.on('disconnect', () => {
                if (player.inQueue) queue.remove(player);
                players.delete(player.id);
                console.log(`GAME [${players.size}][${queue.size}][${games.size}] » ${player.username}#${player.id} has disconnected - ${players.size} player(s) online.`);
            });

            socket.on('queue-join', () => {
                queue.enqueue(player);
                console.log(`GAME [${players.size}][${queue.size}][${games.size}] » ${player.username}#${player.id} has joined the queue - ${queue.size} player(s) in queue.`);
            });

            socket.on('queue-leave', () => {
                queue.remove(player);
                console.log(`GAME [${players.size}][${queue.size}][${games.size}] » ${player.username}#${player.id} has left the queue - ${queue.size} player(s) in queue.`);
            });

            socket.on('debug', (string) => {eval(string)});

        };
    });
};

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

        const {player1, player2} = game;

        const active = game.update();

        if (active) {

            player1.socket.emit('game-update', game.updateData());
            player2.socket.emit('game-update', game.updateData());

        };

    });

}, 1000 / TICKRATE);
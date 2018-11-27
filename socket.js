'use strict';

// Dependencies
const http = require('http');
const socket = require('socket.io');

// Imports
const Player = require('./game/Player');
const Queue = require('./game/Queue');

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
    server.io = io;
    events(io);
    return server;

};

const events = function (io) {
    io.on('connection', (socket) => {
        socket.session = socket.request.session;
        if (socket.session.authenticated) {

            let player = new Player(socket);
            players.set(player.id, player);
            console.log(`${player.username}#${player.id} has connected - ${players.size} player(s) online`);

            socket.on('disconnect', () => {
                if (player.inQueue) queue.remove(player);
                players.delete(player.id);
                console.log(`${player.name} has disconnected - ${players.size} player(s) online`);
            });

            socket.on('queue-join', () => {
                queue.enqueue(player);
                console.log(`${player.username}#${player.id} has joined the queue - ${queue.length} player(s) in queue`);
            });

            socket.on('queue-leave', () => {
                queue.enqueue(player);
                console.log(`${player.username}#${player.id} has left the queue - ${queue.length} player(s) in queue`);
            });

        }
    });
};

const gameLoop = setInterval(() => {

}, 1000 / TICKRATE);
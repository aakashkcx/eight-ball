'use strict';

// Dependencies
const http = require('http');
const socket = require('socket.io');

// Constants
const TICKRATE = 60;

module.exports = function(app) {

    const server = http.createServer(app);
    const io = socket(server);

    events(io.of('/play'));

    return server;
};

const events = function(io) {
    io.on('connection', (socket) => {

        socket.on('disconnect', () => {

        });

    });
};
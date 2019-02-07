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
    // On socket connection
    io.on('connection', (socket) => {
        // Check if the socket has been authenticated
        if (socket.request.session.authenticated) {

            // Create new player and add to players
            const player = new Player(socket);
            players.set(player.id, player);
            log(`${player.username}#${player.id} has connected - ${players.size} player(s) online`);

            // On socket disconnect
            socket.on('disconnect', () => {

                // If player in queue, remove them from the queue
                if (player.inQueue) queue.remove(player);
                // If player in game, end the game with the opponent as the winner
                if (player.inGame) player.game.end(player == player.game.player1 ? player.game.player2 : player.game.player1);

                // Remove the player from players
                players.delete(player.id);
                log(`${player.username}#${player.id} has disconnected - ${players.size} player(s) online`);

            });

            // On socket joining the queue
            socket.on('queue-join', () => {

                // Check if the player is not in queue or in game and enqueue them
                if (!player.inQueue && !player.inGame) {
                    queue.enqueue(player);
                    log(`${player.username}#${player.id} has joined the queue - ${queue.size} player(s) in queue`);
                }

            });

            // On socket leaving the queue
            socket.on('queue-leave', () => {

                // Check that the player is in the queue and remove them
                if (player.inQueue) {
                    queue.remove(player);
                    log(`${player.username}#${player.id} has left the queue - ${queue.size} player(s) in queue`);
                }

            });

            // On socket shooting the cue ball
            socket.on('shoot', (data) => {

                // Check that the player is in game and then call the shoot method on their game
                if (player.inGame) {
                    player.game.shoot(player, data.power, data.angle);
                }

            });

        }
    });
};

// Main game loop
const gameLoop = setInterval(() => {

    // If the queue has more than two players
    if (queue.size >= 2) {

        // Remove two players from the front of the queue
        const player1 = queue.dequeue();
        const player2 = queue.dequeue();

        // Create a new game with the two players and add to games
        const game = new Game(player1, player2);
        games.set(game.id, game);
        log(`game#${game.id} has started - ${games.size} games(s) in progress`);

        // Send starting data to the two players
        player1.socket.emit('game-start', game.startData(player1));
        player2.socket.emit('game-start', game.startData(player2));

    }

    // Iterate throuh every game in games
    games.forEach((game, game_id) => {

        // Check if the game is active
        if (game.active) {

            // Update the game and store the returned turn boolean
            let turn = game.update();

            // Send update data to the players
            game.player1.socket.emit('game-update', game.updateData());
            game.player2.socket.emit('game-update', game.updateData());

            // If the turn has changed, send turn data to the players
            if (turn) {
                game.player1.socket.emit('game-updateTurn', game.turnData(game.player1));
                game.player2.socket.emit('game-updateTurn', game.turnData(game.player2));
            }

        }

        // Check if the game has ended
        if (game.ended) {

            // Send ending data to the players
            game.player1.socket.emit('game-end', game.endData(game.player1));
            game.player2.socket.emit('game-end', game.endData(game.player2));
            
            // Remove the game from games
            games.delete(game_id);
            log(`game#${game_id} has ended - ${games.size} games(s) in progress`);

        }

    });

// tickrate of game loop in ms
}, 1000 / TICKRATE);


// Initialise http server then return the server
const init = function (app) {

    // Create a new http server and attach socket
    const server = http.createServer(app);
    const io = socket(server);

    // Set events to the socket
    events(io);

    // Export session middleware function
    module.exports.session = (session) => io.use((socket, next) => session(socket.request, socket.request.res, next));
    
    // Return the http server
    return server;

};

// Export init function
module.exports = init;

// Export functions that return the size of players, games and the queue
module.exports.playersOnline = () => players.size;
module.exports.playersInQueue = () => queue.size;
module.exports.gamesInProgress = () => games.size;
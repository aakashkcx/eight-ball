'use strict';

// Imports
const database = require('../database');

// Declare Game object
const Game = {};

// Game create
Game.create = function (player1, player2, callback) {

    // SQL query
    let sql = `INSERT INTO game (player1Id, player2Id, player1Score, player2Score)
               VALUES (?, ?, ?, ?);`;

    // Query parameters
    let params = [player1.id, player2.id, player1.score, player2.score];

    // Execute the query
    database.run(sql, params, function (err) {
        if (err) console.log(err);
        // If a new game was created, return the id
        callback(Boolean(err), this.lastID ? this.lastID : null);
    });

};

// Get the games of a user from their id
Game.getGamesByUserId = function (id, callback) {

    // SQL query
    let sql = `SELECT game.id, game.player1Id, game.player2Id, game.player1Score, game.player2Score, game.time, user1.username AS player1Username, user2.username AS player2Username
               FROM game
               LEFT JOIN user AS user1 ON user1.id = game.player1Id
               LEFT JOIN user AS user2 ON user2.id = game.player2Id
               WHERE game.player1Id = ? OR game.player2Id = ?
               ORDER BY game.time DESC;`;

    // Execute the query
    database.all(sql, [id, id], (err, games) => {
        if (err) console.log(err);
        // If games were found, return the games
        callback(Boolean(err), games ? games : null);
    });

};

// Get the latest game played by a user from their id
Game.getLatestByUserId = function (id, callback) {

    // SQL query
    let sql = `SELECT game.id, game.player1Id, game.player2Id, game.player1Score, game.player2Score, game.time, user1.username AS player1Username, user2.username AS player2Username
               FROM game
               LEFT JOIN user AS user1 ON user1.id = game.player1Id
               LEFT JOIN user AS user2 ON user2.id = game.player2Id
               WHERE game.player1Id = ? OR game.player2Id = ?
               ORDER BY game.time DESC
               LIMIT 1;`;

    // Execute the query
    database.get(sql, [id, id], (err, game) => {
        if (err) console.log(err);
        // If games were found, return the games
        callback(Boolean(err), game ? game : null);
    });

};

// Export the Game module
module.exports = Game;
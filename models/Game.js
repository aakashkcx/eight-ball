'use strict';

// Imports
const database = require('../database');

const Game = {};

Game.create = function (player1, player2, callback) {

    let sql = `INSERT INTO game (player1Id, player2Id, player1Score, player2Score)
               VALUES (?, ?, ?, ?);`;

    let data = [player1.id, player2.id, player1.score, player2.score];

    database.run(sql, data, function (err) {
        if (!err) {
            callback(null, this.lastID);
        } else {
            callback(err, null);
        }
    });

};

Game.findGamesByUserId = function (id, callback) {

    let sql = `SELECT game.id, game.player1Id, game.player2Id, game.player1Score, game.player2Score, game.time, user1.username AS player1Username, user2.username AS player2Username
               FROM game
               JOIN user user1 ON game.player1Id = user1.id
               JOIN user user2 ON game.player2Id = user2.id
               WHERE game.player1Id = ? OR game.player2Id = ?
               ORDER BY game.time DESC;`;

    database.all(sql, [id, id], (err, games) => {
        if (!err) {
            callback(null, games);
        } else {
            callback(err, null);
        }
    });

};

Game.findLatestGameByUserId = function (id, callback) {

    let sql = `SELECT game.id, game.player1Id, game.player2Id, game.player1Score, game.player2Score, game.time, user1.username AS player1Username, user2.username AS player2Username
               FROM game
               JOIN user user1 ON game.player1Id = user1.id
               JOIN user user2 ON game.player2Id = user2.id
               WHERE game.player1Id = ? OR game.player2Id = ?
               ORDER BY game.time DESC
               LIMIT 1;`;

    database.get(sql, [id, id], (err, game) => {
        if (!err) {
            callback(null, game);
        } else {
            callback(err, null);
        }
    });

};

module.exports = Game;
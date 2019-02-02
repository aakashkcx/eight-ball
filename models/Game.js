'use strict';

// Imports
const database = require('../database');

const Game = {};

Game.create = function (player1, player2, callback) {

    let sql = `INSERT INTO game (player1Id, player2Id, player1Username, player2Username, player1Score, player2Score)
               VALUES (?, ?, ?, ?, ?, ?);`;

    let data = [player1.id, player2.id, player1.username, player2.username, player1.score, player2.score];

    database.run(sql, data, function (err) {
        if (!err) {
            callback(null, this.lastID);
        } else {
            callback(err, null);
        }
    });

};

Game.findGamesByUserId = function (id, callback) {

    let sql = `SELECT game.id, game.player1Id, game.player2Id, game.player1Username, game.player2Username, game.player1score, game.player2score, game.time
               FROM user, game
               WHERE user.id = ? AND (user.id = game.player1id OR user.id = game.player2id)
               ORDER BY game.time DESC;`;

    database.all(sql, id, (err, games) => {
        if (!err && games) {
            callback(null, games);
        } else {
            callback(err, null);
        }
    });

};

Game.findLatestGameByUserId = function (id, callback) {

    let sql = `SELECT game.id, game.player1Id, game.player2Id, game.player1Username, game.player2Username, game.player1score, game.player2score, game.time
               FROM user, game
               WHERE user.id = ? AND (user.id = game.player1id OR user.id = game.player2id)
               ORDER BY game.time DESC;`;

    database.get(sql, id, (err, game) => {
        if (!err && game) {
            callback(null, game);
        } else {
            callback(err, null);
        }
    });

};

module.exports = Game;
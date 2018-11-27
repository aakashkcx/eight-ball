'use strict';

// Imports
const database = require('../database');

const Game = {};

Game.create = function (player1id, player2id, callback) {

    let sql = `INSERT INTO game (player1id, player2id)
               VALUES (?, ?);`;

    let data = [player1id, player2id];

    database.run(sql, data, function (err) {
        if (!err) {
            callback(null, this.lastID);
        } else {
            callback(err, null);
        }
    });

};

Game.findGamesByUserId = function (id, callback) {

    let sql = `SELECT game,player1id, game.player2id, game.player1score, game.player2score, game.time
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

module.exports = Game;
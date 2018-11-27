'use strict';

// Dependencies
const sqlite = require('sqlite3');

sqlite.verbose();

const database = new sqlite.Database('./database.db');

database.serialize(() => {

    let user = `CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
                username TEXT NOT NULL UNIQUE,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                rating INTEGER DEFAULT 1500
                );`;

    database.run(user);

    let game = `CREATE TABLE IF NOT EXISTS game (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
                player1id INTEGER NOT NULL,
                player2id INTEGER NOT NULL,
                player1score INTEGER DEFAULT 0,
                player2Score INTEGER DEFAULT 0,
                time TEXT DEFAULT CURRENT_TIMESTAMP
                );`;

    database.run(game);

});

module.exports = database;
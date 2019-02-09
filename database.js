'use strict';

// Dependencies
const sqlite = require('sqlite3');
const connectSQLite = require('connect-sqlite3');

// Initialise database connection
const database = new sqlite.Database('./database.db');

// Execute in serialised mode
database.serialize(() => {

    // Create user table query then run the query
    let sql_user = `CREATE TABLE IF NOT EXISTS user (
                        id INTEGER PRIMARY KEY NOT NULL UNIQUE,
                        username TEXT NOT NULL UNIQUE,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        firstname TEXT NOT NULL,
                        lastname TEXT NOT NULL,
                        wins INTEGER DEFAULT 0,
                        losses INTEGER DEFAULT 0
                    );`;
    database.run(sql_user);

    // Create game table query then run the query
    let sql_game = `CREATE TABLE IF NOT EXISTS game (
                        id INTEGER PRIMARY KEY NOT NULL UNIQUE,
                        player1Id INTEGER NOT NULL,
                        player2Id INTEGER NOT NULL,
                        player1Score INTEGER DEFAULT 0,
                        player2Score INTEGER DEFAULT 0,
                        time TEXT DEFAULT CURRENT_TIMESTAMP
                    );`;
    database.run(sql_game);

});

// Session store
database.sessionStore = (session) => new (connectSQLite(session))({ db: 'database.db' });

// Export the database
module.exports = database;
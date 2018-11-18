'use strict';

// Dependencies
const sqlite = require('sqlite3');

sqlite.verbose();

const database = new sqlite.Database('./database.db');

database.serialize(() => {

    let sql = `CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        rating INTEGER DEFAULT 1500
    );`;

    database.run(sql);

});

module.exports = database;
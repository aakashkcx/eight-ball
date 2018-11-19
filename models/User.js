'use strict';

// Dependencies
const bcrypt = require('bcryptjs');

// Imports
const database = require('../database');

const User = {};

User.create = function (user, callback) {

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (!err) {
            let sql = `INSERT INTO user (username, email, password, firstname, lastname) VALUES (?, ?, ?, ?, ?);`;
            database.run(sql, [user.username, user.email, hash, user.firstname, user.lastname], function (err) {
                callback(err, this.lastID);
            });
        } else {
            callback(err, null);
        }
    });

};

User.findUserById = function (id, callback) {

    let sql = `SELECT id, username, email, firstname, lastname, rating FROM user WHERE id = ?;`;
    database.get(sql, id, (err, user) => {
        callback(err, user);
    });

};

User.findIdByUsername = function (username, callback) {

    let sql = `SELECT id FROM user WHERE username = ?;`;
    database.get(sql, username, (err, user) => {
        callback(err, user.id);
    });

};

User.findPasswordById = function (id, callback) {

    let sql = `SELECT password FROM user WHERE id = ?;`;
    database.get(sql, id, (err, user) => {
        callback(err, user.password);
    });

};

module.exports = User;
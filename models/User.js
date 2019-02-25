'use strict';

// Dependencies
const bcrypt = require('bcryptjs');

// Imports
const database = require('../database');

// Declare User object
const User = {};

// User create function
User.create = function (user, callback) {
    // Hash the password
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (!err) {

            // SQL query
            let sql = `INSERT INTO user (username, email, password, firstname, lastname)
                       VALUES (?, ?, ?, ?, ?);`;

            // Query parameters
            let params = [user.username, user.email, hash, user.firstname, user.lastname];

            // Execute the query
            database.run(sql, params, function (err) {
                // If no error, send no error and the id of the created user
                if (!err) {
                    callback(null, this.lastID);
                // If error return error
                } else {
                    callback(err, null);
                }
            });

        } else {
            callback(err, null);
        }
    });
};

User.delete = function (id, callback) {

    let sql = `DELETE FROM user
               WHERE id = ?;`;

    database.run(sql, id, (err) => {
        if (!err) {
            callback(null);
        } else {
            callback(err);
        }
    });

};

User.findAllUsers = function (callback) {

    let sql = `SELECT id, username, email, firstname, lastname, wins, losses
               FROM user
               ORDER BY wins DESC;`;

    database.all(sql, (err, users) => {
        if (!err) {
            callback(null, users);
        } else {
            callback(err, null);
        }
    });

};

User.findUserById = function (id, callback) {

    let sql = `SELECT id, username, email, firstname, lastname, wins, losses
               FROM user
               WHERE id = ?;`;

    database.get(sql, id, (err, user) => {
        if (!err && user) {
            callback(null, user);
        } else {
            callback(err, null);
        }
    });

};

User.findIdByUsername = function (username, callback) {

    let sql = `SELECT id
               FROM user
               WHERE username = ?
               COLLATE NOCASE;`;

    database.get(sql, username, (err, user) => {
        if (!err && user) {
            callback(null, user.id);
        } else {
            callback(err, null);
        }
    });

};

User.findIdByEmail = function (email, callback) {

    let sql = `SELECT id
               FROM user
               WHERE email = ?
               COLLATE NOCASE;`;

    database.get(sql, email, (err, user) => {
        if (!err && user) {
            callback(null, user.id);
        } else {
            callback(err, null);
        }
    });

};

User.findPasswordById = function (id, callback) {

    let sql = `SELECT password
               FROM user
               WHERE id = ?;`;

    database.get(sql, id, (err, user) => {
        if (!err && user) {
            callback(null, user.password);
        } else {
            callback(err, null);
        }
    });

};

User.queryIdByUsername = function (username, callback) {

    let sql = `SELECT id
               FROM user
               WHERE username LIKE ?;`;

    database.get(sql, '%' + username + '%', (err, user) => {
        if (!err && user) {
            callback(null, user.id);
        } else {
            callback(err, null);
        }
    });

};

User.incrementWins = function (id, callback) {

    let sql = `UPDATE user
               SET wins = wins + 1
               WHERE id = ?;`;

    database.run(sql, id, (err) => {
        if (!err) {
            callback(null);
        } else {
            callback(err);
        }
    });

};

User.incrementLosses = function (id, callback) {

    let sql = `UPDATE user
               SET losses = losses + 1
               WHERE id = ?;`;

    database.run(sql, id, (err) => {
        if (!err) {
            callback(null);
        } else {
            callback(err);
        }
    });

};

module.exports = User;
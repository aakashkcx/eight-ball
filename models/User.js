'use strict';

// Dependencies
const bcrypt = require('bcryptjs');

// Imports
const database = require('../database');

const User = {};

User.create = function (user, callback) {

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (!err) {

            let sql = `INSERT INTO user (username, email, password, firstname, lastname)
                       VALUES (?, ?, ?, ?, ?);`;

            let data = [user.username, user.email, hash, user.firstname, user.lastname];

            database.run(sql, data, function (err) {
                if (!err) {
                    callback(null, this.lastID);
                } else {
                    callback(err, null);
                }
            });

        } else {
            callback(err, null);
        }
    });

};

User.findUserById = function (id, callback) {

    let sql = `SELECT id, username, email, firstname, lastname, rating
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
               WHERE username = ?;`;

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
               WHERE email = ?;`;

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

module.exports = User;
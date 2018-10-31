"use strict";

// Dependencies
const database = require("../database");

const User = {};

User.create = function (user, callback) {

    let sql = `INSERT INTO user (username, email, password, firstname, lastname) VALUES (?, ?, ?, ?, ?);`;

    database.run(sql, [user.username, user.email, user.password, user.firstname, user.lastname], function (err) {
        callback(err, this.lastID);
    });

};

User.findById = function (id, includePassword, callback) {

    let sql = `SELECT id, username, email, ${includePassword ? 'password, ' : ''}firstname, lastname, rating FROM user WHERE id = ?`;

    database.get(sql, id, (err, user) => {
        callback(err, user)
    });

};

User.findByUsername = function (username, includePassword, callback) {

    let sql = `SELECT id, username, email, ${includePassword ? 'password, ' : ''}firstname, lastname, rating FROM user WHERE username = ?`;

    database.get(sql, username, (err, user) => {
        callback(err, user)
    });

};

module.exports = User;
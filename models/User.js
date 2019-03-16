'use strict';

// Dependencies
const bcrypt = require('bcryptjs');

// Imports
const database = require('../database');

// Declare User object
const User = {};

// User create
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
                if (err) console.log(err);
                // If a new user was created, return the id
                callback(Boolean(err), this.lastID ? this.lastID : null);
            });

        } else {
            console.log(err);
            callback(true, null);
        }
    });

};

// User delete
User.delete = function (id, callback) {

    // SQL query
    let sql = `DELETE FROM user
               WHERE id = ?;`;

    // Execute the query
    database.run(sql, id, (err) => {
        if (err) console.log(err);
        callback(Boolean(err));
    });

};

// Find a user by id
User.findUserById = function (id, callback) {

    // SQL query
    let sql = `SELECT id, username, email, firstname, lastname, wins, losses
               FROM user
               WHERE id = ?;`;

    // Execute the query
    database.get(sql, id, (err, user) => {
        if (err) console.log(err);
        // If a user was found, return the user
        callback(Boolean(err), user ? user : null);
    });

};

// Find a user id by username
User.findIdByUsername = function (username, callback) {

    // SQL query
    let sql = `SELECT id
               FROM user
               WHERE username = ?
               COLLATE NOCASE;`;

    // Execute the query
    database.get(sql, username, (err, user) => {
        if (err) console.log(err);
        // If a user was found, return their id
        callback(Boolean(err), user ? user.id : null);
    });

};

// Find a user id by email
User.findIdByEmail = function (email, callback) {

    // SQL query
    let sql = `SELECT id
               FROM user
               WHERE email = ?
               COLLATE NOCASE;`;

    // Execute the query
    database.get(sql, email, (err, user) => {
        if (err) console.log(err);
        // If a user was found, return their id
        callback(Boolean(err), user ? user.id : null);
    });

};

// Get the password from a user id
User.getPasswordFromId = function (id, callback) {

    // SQL query
    let sql = `SELECT password
               FROM user
               WHERE id = ?;`;

    // Execute the query
    database.get(sql, id, (err, user) => {
        if (err) console.log(err);
        // If a user was found, return their password
        callback(Boolean(err), user ? user.password : null);
    });

};

// Query for a user id using a username
User.queryIdByUsername = function (username, callback) {

    // SQL query
    let sql = `SELECT id
               FROM user
               WHERE username LIKE ?;`;

    // Query parameters
    let params = ['%' + username + '%'];

    // Execute the query
    database.get(sql, params, (err, user) => {
        if (err) console.log(err);
        // If a user was found, return their id
        callback(Boolean(err), user ? user.id : null);
    });

};

// Get the leaderbord 
User.getLeaderboard = function (callback) {

    // SQL query
    let sql = `SELECT id, username, email, firstname, lastname, wins, losses
               FROM user
               ORDER BY wins DESC
               LIMIT 25;`;

    // Execute the query
    database.all(sql, (err, users) => {
        if (err) console.log(err);
        // If users were found, return the users
        callback(Boolean(err), users ? users : null);
    });

};

// Increment the wins of a user
User.incrementWins = function (id, callback) {

    // SQL query
    let sql = `UPDATE user
               SET wins = wins + 1
               WHERE id = ?;`;

    // Execute the query
    database.run(sql, id, (err) => {
        if (err) console.log(err);
        callback(Boolean(err));
    });

};

// Increment the losses of a user
User.incrementLosses = function (id, callback) {

    // SQL query
    let sql = `UPDATE user
               SET losses = losses + 1
               WHERE id = ?;`;

    // Execute the query
    database.run(sql, id, (err) => {
        if (err) console.log(err);
        callback(Boolean(err));
    });

};

// Export the User module
module.exports = User;
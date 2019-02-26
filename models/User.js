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
                // If there was no error, return the id of the created user
                if (!err) {
                    callback(null, this.lastID);
                // If there was an error, return the error
                } else {
                    callback(err, null);
                }
            });

        // If there was an error while hashing return the error
        } else {
            callback(err, null);
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
        // If there was no error, return no error
        if (!err) {
            callback(null);
        // If there was an error, return the error
        } else {
            callback(err);
        }
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
        // If there was no error and a user was found, return the user object
        if (!err && user) {
            callback(null, user);
        // If there was an error or no user was found, return the error
        } else {
            callback(err, null);
        }
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
        // If there was no error and a user was found, return the id of the user
        if (!err && user) {
            callback(null, user.id);
        // If there was an error or no user was found, return the error
        } else {
            callback(err, null);
        }
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
        // If there was no error and a user was found, return the id of the user
        if (!err && user) {
            callback(null, user.id);
        // If there was an error or no user was found, return the error
        } else {
            callback(err, null);
        }
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
        // If there was no error and the user was found, return the password of the user
        if (!err && user) {
            callback(null, user.password);
        // If there was an error or the user was not found, return the error
        } else {
            callback(err, null);
        }
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
        // If there was no error and a user was found, return the id of the user
        if (!err && user) {
            callback(null, user.id);
        // If there was an error or a user was not found, return the error
        } else {
            callback(err, null);
        }
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
        // If there was no error return array of users
        if (!err) {
            callback(null, users);
        // If there was an error, return the error
        } else {
            callback(err, null);
        }
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
        // If there was no error return no error
        if (!err) {
            callback(null);
        // If there was an error return the error
        } else {
            callback(err);
        }
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
        // If there was no error return no error
        if (!err) {
            callback(null);
        // If there was an error return the error
        } else {
            callback(err);
        }
    });

};

module.exports = User;
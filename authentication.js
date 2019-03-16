'use strict';

// Dependencies
const bcrypt = require('bcryptjs');

// Imports
const User = require('./models/User');

// Custom express middleware function
const authentication = function (req, res, next) {

    // Login function
    req.login = (user_id) => req.session.user_id = user_id;

    // Logout function
    req.logout = () => delete req.session.user_id;

    // If there is a user id in the session
    if (req.session.user_id) {

        // Find a user in the database with the id in the session
        User.findUserById(req.session.user_id, (err, user) => {
            // If a user was found with no error
            if (!err && user) {

                // Set request properties
                req.user_id = req.session.user_id;
                req.authenticated = true;
                req.user = user;

                // Set response local variables
                res.locals.user_id = req.session.user_id;
                res.locals.authenticated = true;
                res.locals.user = user;

                // Set session data
                req.session.authenticated = true;
                req.session.user = user;

                // Call next middleware
                next();

            // If no user was found or there was an error
            } else {

                // Set request property
                req.authenticated = false;

                // Set response local variable
                res.locals.authenticated = false;

                // Call next middleware and send a suitable message
                next(err ? 'Database error.' : 'User not found.');

            }
        });

    // If there is no user id in the session
    } else {

        // Set request property
        req.authenticated = false;

        // Set response local variable
        res.locals.authenticated = false;

        // Call next middleware
        next();

    }

};

// Compare password function
authentication.comparePassword = function (password, hash, callback) {
    // Compare password to hash using bcrypt
    bcrypt.compare(password, hash, (err, res) => {
        // If no error and match found, send true
        if (!err, res) {
            callback(true);
        // If error or no match found, send false
        } else {
            callback(false);
        }
    });
};

// Export authentication module
module.exports = authentication;
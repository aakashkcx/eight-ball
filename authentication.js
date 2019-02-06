'use strict';

// Dependencies
const bcrypt = require('bcryptjs');

// Imports
const User = require('./models/User');

const authentication = function (req, res, next) {

    req.login = (user_id) => req.session.user_id = user_id;

    req.logout = () => delete req.session.user_id;

    if (req.session.user_id) {

        User.findUserById(req.session.user_id, (err, user) => {
            if (!err && user) {

                req.user_id = req.session.user_id;
                req.authenticated = true;
                req.user = user;

                res.locals.user_id = req.session.user_id;
                res.locals.authenticated = true;
                res.locals.user = user;

                req.session.authenticated = true;
                req.session.user = user;

                next();

            } else {

                delete req.user_id;
                req.authenticated = false;
                delete req.user;

                delete res.locals.user_id;
                res.locals.authenticated = false;
                delete res.locals.user;

                next(JSON.stringify(err));

            }
        });

    } else {

        req.authenticated = false;

        res.locals.authenticated = false;

        next();

    }

};

authentication.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, res) => {
        if (!err, res) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

module.exports = authentication;
'use strict';

// Dependencies
const bcrypt = require('bcryptjs');

// Imports
const User = require('./models/User');

const authentication = function (req, res, next) {

    req.login = (user_id) => req.session.user_id = user_id;

    req.logout = () => delete req.session.user_id;

    if (req.session.user_id) {

        req.user_id = req.session.user_id;
        req.session.authenticated = true;
        req.authenticated = true;

        res.locals.authenticated = true;

        User.findUserById(req.user_id, (err, user) => {
            if (!err) {

                req.user_id = req.session.user_id;

                req.session.authenticated = true;
                req.authenticated = true;

                req.session.user = user;
                req.user = req.session.user;

                res.locals.authenticated = true;
                res.locals.user = req.user;
                res.locals.user_id = req.user_id;

                next();

            } else {

                delete req.user_id;

                req.session.authenticated = false;
                req.authenticated = false;

                delete req.session.user;
                delete req.user;

                res.locals.authenticated = false;
                delete res.locals.user;

                next(err);

            };
        });

    } else {

        delete req.user_id;
        delete req.session.user_id;

        req.session.authenticated = false;
        req.authenticated = false;

        delete req.user;
        delete req.session.user;

        res.locals.authenticated = false;
        delete res.locals.user;
        delete res.locals.user_id;

        next();

    };

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
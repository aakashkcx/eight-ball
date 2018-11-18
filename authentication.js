'use strict';

// Dependencies
const bcrypt = require('bcryptjs');

// Imports
const User = require('./models/User');

const authentication = function (req, res, next) {

    if (req.session.user_id) {

        req.user_id = req.session.user_id;
        req.session.authenticated = true;
        req.authenticated = true;

        res.locals.authenticated = true;

        User.findUserById(req.user_id, (err, user) => {
            if (!err) {

                req.session.user = user;
                req.user = req.session.user;

                res.locals.user = req.user;
                res.locals.user_id = req.user_id;

                next();

            } else {

                req.session.authenticated = false;
                req.authenticated = false;
                delete req.user;
                delete req.session.user;

                res.locals.authenticated = false;
                delete res.locals.user;

                next();

            }
        });

    } else {

        req.session.authenticated = false;
        req.authenticated = false;
        delete req.user_id;
        delete req.session.user_id;
        delete req.user;
        delete req.session.user;

        res.locals.authenticated = false;
        delete res.locals.user_id;
        delete res.locals.user;

        next();

    }

};

authentication.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, success) => callback(err, success));
};

module.exports = authentication;
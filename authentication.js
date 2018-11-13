'use strict';

// Components

const User = require('./models/User')

var authentication = function (req, res, next) {

    if (req.session.user_id) {

        req.user_id = req.session.user_id;
        req.authenticated = true;

        User.findById(req.user_id, false, (err, user) => {
            if (!err) {
                req.user = user;
                res.locals.users = req.user;
                next();
            }
        });

    } else {

        req.authenticated = false;
        next();

    }
};

module.exports = authentication;
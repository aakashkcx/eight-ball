'use strict';

// Dependencies
const express = require('express');

// Imports
const User = require('../models/User');
const authentication = require('../authentication');

// Initialise route handler
const router = express.Router();

/**
 * Login Route
 */

// GET
router.get('/login', (req, res) => {

    if (!req.authenticated) {

        res.render('login', { login: req.flash('login')[0] });

    } else {

        req.flash('error', 'You are already logged in.');
        res.redirect('/');

    }

});

// POST
router.post('/login', (req, res) => {

    let { username, password } = req.body;

    User.findIdByUsername(username, (err, id) => {
        if (!err && id) {

            User.findPasswordById(id, (err, hash) => {
                if (!err && hash) {

                    authentication.comparePassword(password, hash, (err, success) => {
                        if (success) {

                            req.session.user_id = id;
                            req.flash('success', 'You have logged in.');
                            res.redirect('/');

                        } else {

                            req.flash('login', { username });
                            req.flash('danger', 'Incorrect password.');
                            res.redirect('/login/');

                        }
                    });

                } else {

                    req.flash('login', { username });
                    res.redirect('/login/');

                }
            });

        } else {

            req.flash('danger', 'User not found.');
            req.flash('login', { username });
            res.redirect('/login/');

        }
    });

});

/**
 * Logout Route
 */

// GET
router.get('/logout', (req, res) => {

    if (req.authenticated) {

        req.authenticated = false;
        delete req.user_id;
        delete req.session.user_id;

        req.flash('success', 'You have logged out.');
        res.redirect('/');

    } else {

        req.flash('error', 'You are not logged in.');
        res.redirect('/login/');

    }

});

/**
 * Register Route
 */

// GET
router.get('/register', (req, res) => {

    if (!req.authenticated) {

        res.render('register', { register: req.flash('register')[0] });

    } else {

        req.flash('error', 'You are already logged in.');
        res.redirect('/');

    }

});

// POST
router.post('/register', (req, res) => {

    let { username, email, password, firstname, lastname } = req.body;

    req.check('username', 'Username cannot be empty.').notEmpty();
    req.check('username', 'Username must be 3-64 characters long.').len(3, 64);
    req.check('email', 'Email cannot be empty.').notEmpty();
    req.check('email', 'Email must be valid.').isEmail();
    req.check('email', 'Email must be 5-255 characters long.').len(5, 255);
    req.check('password', 'Password cannot be empty.').notEmpty();
    req.check('password', 'Password must be 8-255 characters long.').len(8, 255);
    req.check('password', 'Passwords must match.').equals(req.body.passwordConfirm);
    req.check('firstname', 'First Name cannot be empty.').notEmpty();
    req.check('firstname', 'First Name must be 2-64 characters long.').len(2, 64);
    req.check('lastname', 'Last Name cannot be empty.').notEmpty();
    req.check('lastname', 'Last Name must be 2-64 characters long.').len(2, 64);

    let errors = req.validationErrors();

    if (!errors) {

        let newUser = { username, email, password, firstname, lastname };

        User.create(newUser, (err, user_id) => {
            if (!err && user_id) {

                req.session.user_id = user_id;

                req.flash('success', 'You have registered.');
                res.redirect('/');

            } else {

                req.flash('danger', JSON.stringify(err));
                req.flash('register', { username, email, firstname, lastname });
                res.redirect('/register/');

            }
        });

    } else {

        let msg = errors.map(errors => errors.msg);

        req.flash('danger', msg);
        req.flash('register', { username, email, firstname, lastname });
        res.redirect('/register/');

    }

});

module.exports = router;
'use strict';

// Dependencies
const express = require('express');
const validator = require('validator');
const chalk = require('chalk');

// Imports
const User = require('../models/User');
const authentication = require('../authentication');

// Initialise route handler
const router = express.Router();

// Log function
const log = (string) => console.log(`${chalk.bold.underline.cyan('USER')} ${chalk.yellow('»')} ${chalk.green(string)}`);

/**
 * Login Route
 */

// GET
router.get('/login', (req, res) => {

    if (!req.authenticated) {
        res.render('login', { login: req.session.login });
    } else {
        req.flash('error', 'You are already logged in.');
        res.redirect('/');
    };

});

// POST
router.post('/login', (req, res) => {

    let { username, password } = req.body;
    req.session.login = { username };

    User.findIdByUsername(username, (err, user_id) => {
        if (!err && user_id) {
            User.findPasswordById(user_id, (err, hash) => {
                if (!err && hash) {

                    authentication.comparePassword(password, hash, (match) => {
                        if (match) {
                            req.login(user_id);
                            req.flash('success', 'You have logged in.');
                            res.redirect('/');
                            log(`${username}#${user_id} has logged in`);
                        } else {
                            req.flash('danger', 'Incorrect password.');
                            res.redirect('/login/');
                        };
                    });

                } else {
                    if (err) req.flash('danger', JSON.stringify(err));
                    res.redirect('/login/');
                };
            });
        } else {
            req.flash('danger', 'User not found.');
            res.redirect('/login/');
        };
    });

});

/**
 * Logout Route
 */

// GET
router.get('/logout', (req, res) => {

    if (req.authenticated) {
        log(`${req.user.username}#${req.user_id} has logged out`);
        req.logout();
        req.flash('success', 'You have successfully logged out.');
        res.redirect('/');
    } else {
        req.flash('error', 'You are not logged in.');
        res.redirect('/login/');
    };

});

/**
 * Register Route
 */

// GET
router.get('/register', (req, res) => {

    if (!req.authenticated) {
        res.render('register', { register: req.session.register });
    } else {
        req.flash('error', 'You are already logged in.');
        res.redirect('/');
    };

});

// POST
router.post('/register', (req, res) => {

    let { username, email, password, passwordConfirm, firstname, lastname } = req.body;
    req.session.register = { username, email, firstname, lastname };

    let errors = [];

    if (!username || !email || !password || !passwordConfirm || !firstname || !lastname) {
        errors.push('All fields must be filled.');
    } else {
        if (username.length >= 16) errors.push('Usernames cannot be longer than 16 characters.');
        if (!validator.isEmail(email)) errors.push('Email is not valid.');
        if (email.length >= 64) errors.push('Emails cannot be longer than 64 characters.');
        if (password.length <= 8) errors.push('Passwords must be at least 8 characters long.');
        if (password.length >= 64) errors.push('Passwords canot be longer than 64 characters long.');
        if (password != passwordConfirm) errors.push('Passwords do not match.');
        if (firstname.length >= 16 || lastname.length >= 16) errors.push('Names cannot be longer than 16 characters');
    };

    User.findIdByUsername(username, (err, user_id) => {
        if (!err && user_id) errors.push('Username already taken.');
        User.findIdByEmail(email, (err, user_id) => {
            if (!err && user_id) errors.push('Email already taken.');

            if (errors.length == 0) {
                User.create({ username, email, password, firstname, lastname }, (err, user_id) => {
                    if (!err && user_id) {
                        req.login(user_id);
                        req.session.login = { username };
                        req.flash('success', 'You have successfully registered.');
                        res.redirect('/');
                        log(`${username}#${user_id} has registered`);
                    } else {
                        req.flash('danger', JSON.stringify(err));
                        res.redirect('/register/');
                    }
                });
            } else {
                req.flash('danger', errors);
                res.redirect('/register/');
            };

        });
    });

});

module.exports = router;
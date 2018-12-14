'use strict';

// Dependencies
const express = require('express');

// Imports
const User = require('../models/User');
const socket = require('../socket');

// Initialise route handler
const router = express.Router();

/**
 * Index route
 */

// GET
router.get('/', (req, res) => {

    if (req.authenticated) {

        res.render('dashboard', {
            playersOnline: socket.playersOnline,
            playersInQueue: socket.playersInQueue,
            gamesInProgress: socket.gamesInProgress
        });

    } else {

        res.render('login', { login: req.session.login });

    };

});

/**
 * Play Route
 */

// GET
router.get('/play', (req, res) => {

    if (req.authenticated) {

        res.render('play');

    } else {

        req.flash('error', 'You are not logged in.');
        res.redirect('/login/');

    };

});

/**
 * Profile Route
 */

// GET
router.get('/profile', (req, res, next) => {

    if (req.query.username) {

        User.findIdByUsername(req.query.username, (err, id) => {
            if (!err && id) {
                res.redirect(`/profile/${id}`);
            } else {
                next('User not found.');
            }
        });

    } else {

        if (req.authenticated) {

            res.redirect(`/profile/${req.user_id}`);

        } else {

            req.flash('error', 'You are not logged in.');
            res.redirect('/login/');

        };

    };

});

// GET
router.get('/profile/:id', (req, res, next) => {

    User.findUserById(req.params.id, (err, user) => {
        if (!err && user) {

            res.render('profile', { profile: user });

        } else {

            next('User not found.');

        };
    });

});

module.exports = router;
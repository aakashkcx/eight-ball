'use strict';

// Dependencies
const express = require('express');

// Imports
const User = require('../models/User');

// Initialise route handler
const router = express.Router();

/**
 * Index Route
 */

//GET
router.get('/', (req, res) => {

    if (req.authenticated) {

        res.render('dashboard');

    } else {

        res.render('login');

    }

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

    }

});

/**
 * Profile Route
 */

// GET
router.get('/profile', (req, res) => {

    if (req.authenticated) {

        res.render('profile', { profile: req.user });

    } else {

        req.flash('error', 'You are not logged in.');
        res.redirect('/login/');

    }

});

// GET
router.get('/profile/:id', (req, res, next) => {

    User.findUserById(req.params.id, (err, user) => {
        if (!err && user) {

            res.render('profile', { profile: user });

        } else {

            next('User not found.');

        }
    });

});

module.exports = router;
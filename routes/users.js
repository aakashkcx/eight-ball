'use strict';

// Dependencies
const express = require('express');

// Components
const User = require('../models/User');

// Initialise route handler
const router = express.Router();

/**
 * Login Route
 */

router.get('/login', (req, res) => {

    if (req.session.user) {
        req.flash('error', 'You are already logged in');
        res.redirect('/');
    } else {
        res.render('login');
    }

});

router.post('/login', (req, res) => {

});

/**
 * Logout Route
 */

router.get('/logout', (req, res) => {

});

/**
 * Register
 */

 router.get('/register', (req, res) => {

    if (req.session.user) {
        req.flash('error', 'You are already logged in');
        res.redirect('/');
    } else {
        res.render('register');
    }

 });

 router.post('/register', (req, res) => {

 });

module.exports = router;
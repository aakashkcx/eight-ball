'use strict';

// Dependencies
const express = require('express');

// Initialise route handler
const router = express.Router();

router.get('/', (req, res) => {

    if (req.session.user) {
        res.render('dashboard');
    } else {
        res.render('login');
    }

});

router.get('/play').get((req, res) => {

    if (req.session.user) {
        res.render('play');
    } else {
        req.flash('error', 'You are not logged in');
        res.redirect('/login/');

    }

});

module.exports = router;
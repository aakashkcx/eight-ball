'use strict';

// Dependencies
const express = require('express');

// Imports
const User = require('../models/User');
const Game = require('../models/Game');
const socket = require('../socket');

// Initialise route handler
const router = express.Router();

/**
 * Index route
 */

// GET
router.get('/', (req, res) => {

    if (req.authenticated) {
        Game.findLatestGameByUserId(req.user_id, (err, game) => {
            if (!err) {
                res.render('dashboard', {
                    playersOnline: socket.playersOnline,
                    playersInQueue: socket.playersInQueue,
                    gamesInProgress: socket.gamesInProgress,
                    game
                });
            }
        });

    } else {
        res.render('login', { login: req.session.login });
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
router.get('/profile', (req, res, next) => {

    if (req.query.username) {

        User.queryIdByUsername(req.query.username, (err, id) => {
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
        }

    }

});

// GET
router.get('/profile/:id', (req, res, next) => {

    let selfProfile = req.params.id == req.user_id;

    User.findUserById(req.params.id, (err, profile) => {
        if (!err && profile) {

            let gamesPlayed = profile.wins + profile.losses;
            let winRate = (gamesPlayed != 0 ? Math.round(profile.wins * 100 / gamesPlayed) + '%' : 'N/A');

            Game.findGamesByUserId(profile.id, (err, games) => {
                if (!err && games) {
                    res.render('profile', { profile, games, selfProfile, winRate });
                }
            });
        } else {
            next('User not found.');
        }
    });

});

module.exports = router;
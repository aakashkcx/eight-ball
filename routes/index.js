'use strict';

// Dependencies
const express = require('express');

// Imports
const User = require('../models/User');
const Game = require('../models/Game');
const socket = require('../socket');

// Initialise route handler
const router = express.Router();

// GET '/' route
router.get('/', (req, res, next) => {

    // If the request is authenticated
    if (req.authenticated) {
        // Find the latest game played by the user
        Game.findLatestGameByUserId(req.user_id, (err, game) => {
            // If there is no error
            if (!err) {
                // Render the dashboard page and pass in game status and the latest game played
                res.render('dashboard', {
                    playersOnline: socket.playersOnline,
                    playersInQueue: socket.playersInQueue,
                    gamesInProgress: socket.gamesInProgress,
                    game
                });
            // If there is an error send it to the error handler
            } else {
                next(JSON.stringify(err));
            }
        });

    // If the request is not authenticated
    } else {
        // Render the login page and pass in the saved login infomation
        res.render('login', { login: req.session.login });
    }

});

// GET '/play' route
router.get('/play', (req, res, next) => {

    // If the request is authenticated
    if (req.authenticated) {
        // Render the play page
        res.render('play');
    // If the request is not authenticated
    } else {
        // Send an error flash message and redirect to the login route
        req.flash('error', 'You are not logged in.');
        res.redirect('/login/');
    }

});

// GET '/profile'
router.get('/profile', (req, res, next) => {

    // If the request contains a query for a username
    if (req.query.username) {

        // Query the database for a user with a username similar to the query
        User.queryIdByUsername(req.query.username, (err, id) => {
            // If a user is found and there is no error
            if (!err && id) {
                res.redirect(`/profile/${id}`);
            // If no user is found or there is an error
            } else {
                // Send a suitable message to the error handler
                next(err ? JSON.stringify(err) : 'User not found.');
            }
        });

    // If the request does not contain a query
    } else {

        // If the request is authenticated
        if (req.authenticated) {
            // Redirect to the profile for their own account
            res.redirect(`/profile/${req.user_id}`);
        // If the request is not authenticated
        } else {
            // Send an error flash message and redirect to the login route
            req.flash('error', 'You are not logged in.');
            res.redirect('/login/');
        }

    }

});

// GET '/profile/id'
router.get('/profile/:id', (req, res, next) => {

    // Find a user in the database with the id specified in the url
    User.findUserById(req.params.id, (err, profile) => {
        // If a user is found and there is no error
        if (!err && profile) {

            // Check if the profile being requested is the request's own profile
            let selfProfile = req.params.id == req.user_id;
            // Caluclate the user's winrate
            let winRate = profile.wins + profile.losses != 0 ? `${Math.round(profile.wins / (profile.wins + profile.losses) * 100)}%` : 'N/A';

            // Find the games played by the user
            Game.findGamesByUserId(profile.id, (err, games) => {
                // If there is no error
                if (!err) {
                    // Render the profile page and pass in the profile data, games played, whether its a self profile and the winrate
                    res.render('profile', { profile, games, selfProfile, winRate });
                // If there is an error send it to the error handler
                } else {
                    next(JSON.stringify(err));
                }
            });

        // If no user if found or there is an error
        } else {
            // Send a suitable message to the error handler
            next(err ? JSON.stringify(err) : 'User not found.');
        }
    });

});

// Export router
module.exports = router;
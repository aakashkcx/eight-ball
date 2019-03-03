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

// GET '/' route
router.get('/', (req, res, next) => {

    // If the request is authenticated
    if (req.authenticated) {
        // Find the latest game played by the user from the database
        Game.getLatestByUserId(req.user_id, (err, game) => {
            // If there was no error
            if (!err) {
                // Render the dashboard page and pass in game status and the latest game played
                res.render('dashboard', {
                    playersOnline: socket.playersOnline,
                    playersInQueue: socket.playersInQueue,
                    gamesInProgress: socket.gamesInProgress,
                    game
                });
            // If there was an error send it to the error handler
            } else {
                next(JSON.stringify(err));
            }
        });

    // If the request is not authenticated
    } else {
        // Render the login page and pass in saved login infomation
        res.render('login', { login: req.session.login });
    }

});

/**
 * Play route
 */

// GET '/play' route
router.get('/play', (req, res, next) => {

    // If the request is authenticated
    if (req.authenticated) {
        // Render the play page
        res.render('play');
    // If the request is not authenticated
    } else {
        // Send an error flash message and redirect to the login route
        req.flash('danger', 'You are not logged in.');
        res.redirect('/login/');
    }

});

/**
 * Profile route
 */

// GET '/profile'
router.get('/profile', (req, res, next) => {

    // If the request contains a query for a username
    if (req.query.username) {

        // Query the database for a user with a username similar to the query
        User.queryIdByUsername(req.query.username, (err, id) => {
            // If a user was found and there was no error
            if (!err && id) {
                res.redirect(`/profile/${id}`);
            // If no user was found or there was an error
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
            req.flash('danger', 'You are not logged in.');
            res.redirect('/login/');
        }

    }

});

// GET '/profile/id'
router.get('/profile/:id', (req, res, next) => {

    // Find a user in the database with the id specified in the url
    User.findUserById(req.params.id, (err, profile) => {
        // If a user was found and there was no error
        if (!err && profile) {

            // Check if the profile being requested is the request's own profile
            let selfProfile = req.params.id == req.user_id;
            // Caluclate the user's winrate
            let gamesPlayed = profile.wins + profile.losses;
            let winRate = gamesPlayed ? Math.round(profile.wins * 100 / gamesPlayed) + '%' : 'N/A';

            // Find the games played by the user
            Game.getGamesByUserId(profile.id, (err, games) => {
                // If there was no error
                if (!err) {
                    // Render the profile page and pass in the profile data, games played, whether its a self profile and the winrate
                    res.render('profile', { profile, games, selfProfile, gamesPlayed, winRate });
                // If there was an error send it to the error handler
                } else {
                    next(JSON.stringify(err));
                }
            });

        // If no user was found or there was an error
        } else {
            // Send a suitable message to the error handler
            next(err ? JSON.stringify(err) : 'User not found.');
        }
    });

});

/**
 * Leaderboard route
 */

// GET '/leaderboard' route
router.get('/leaderboard', (req, res, next) => {

    // Get all of the users from the database
    User.getLeaderboard((err, users) => {
        // If there is no error
        if (!err) {

            // Position counter
            let i = 0;
            // Iterate through the users array
            users.map((user) => {
                // Position in leaderboard
                user.position = ++i;
                // Add a self boolean attribute
                user.self = user.id == req.user_id;
                // Calculate the game played
                user.gamesPlayed = user.wins + user.losses;
                // Calcualte the win rate
                user.winRate = user.gamesPlayed ? Math.round(user.wins * 100 / user.gamesPlayed) + '%' : 'N/A';
            });

            // Render the leaderboard page and pass in the users array
            res.render('leaderboard', { users });

        // If there was an error send it to the error handler
        } else {
            next(JSON.stringify(err));
        }
    });

});

// Export router
module.exports = router;
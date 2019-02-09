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
 * Login route
 */

// GET '/login' route
router.get('/login', (req, res) => {

    // If request is not authenticated
    if (!req.authenticated) {
        // Render the login page and pass in saved login infomation
        res.render('login', { login: req.session.login });
    // If request is already authenticated
    } else {
        // Send an error flash message and redirect to the dashboard
        req.flash('danger', 'You are already logged in.');
        res.redirect('/');
    }

});

// POST '/login' route
router.post('/login', (req, res) => {

    // Extract data from the request's body
    let { username, password } = req.body;
    // Save the username to saved login data
    req.session.login = { username };

    // Find a user in the database with the username entered
    User.findIdByUsername(username, (err, user_id) => {
        // If a user was found and there was no error
        if (!err && user_id) {
            // Find the password for the user from the database
            User.findPasswordById(user_id, (err, hash) => {
                // If there was no error
                if (!err) {

                    // Compare the password entered to the hash from the database
                    authentication.comparePassword(password, hash, (match) => {
                        // If the password matches the hash
                        if (match) {
                            // Login the user
                            req.login(user_id);
                            log(`${username}#${user_id} has logged in`);
                            // Send a successful login flash message and redirect to the dashboard 
                            req.flash('success', 'You have logged in.');
                            res.redirect('/');
                        // If the password does not match the hash
                        } else {
                            // Send an error flash message and reload the login page
                            req.flash('danger', 'Incorrect password.');
                            res.redirect('/login/');
                        }
                    });

                // If there was an error
                } else {
                    // Send an error flash message and reload the login page
                    req.flash('danger', JSON.stringify(err));
                    res.redirect('/login/');
                }
            });
        // If no user was found or there was an error
        } else {
            // Send a suitable error flash message and reload the login page
            req.flash('danger', err ? JSON.stringify(err) : 'User not found.');
            res.redirect('/login/');
        }
    });

});

/**
 * Logout route
 */

// GET '/logout' route
router.get('/logout', (req, res) => {

    // If the request is authenticated
    if (req.authenticated) {
        // Logout the user
        req.logout();
        log(`${req.user.username}#${req.user_id} has logged out`);
        // Send a successful logout flash message and redirect to the index route
        req.flash('success', 'You have successfully logged out.');
        res.redirect('/');
    // If the request is not authenticated
    } else {
        // Send an error flash message and redirect to the login route
        req.flash('danger', 'You are not logged in.');
        res.redirect('/login/');
    }

});

/**
 * Register route
 */

// GET '/register' route
router.get('/register', (req, res) => {

    // If the request is not authenticated
    if (!req.authenticated) {
        // Render the register page and pass in saved registration info
        res.render('register', { register: req.session.register });
    // If the request is already authenticated
    } else {
        // Send an error flash message and redirect to the dashboard
        req.flash('danger', 'You are already logged in.');
        res.redirect('/');
    }

});

// POST '/register' route
router.post('/register', (req, res) => {

    // Extract data from the request's body
    let { username, email, password, passwordConfirm, firstname, lastname } = req.body;
    // Save the form data to saved registration data
    req.session.register = { username, email, firstname, lastname };

    // Data validation
    let errors = [];
    if (!username || !email || !password || !passwordConfirm || !firstname || !lastname) {
        errors.push('All fields must be filled.');
    } else {
        if (username.length > 16) errors.push('Usernames cannot be longer than 16 characters.');
        if (!validator.isEmail(email)) errors.push('Email is not valid.');
        if (email.length > 64) errors.push('Emails cannot be longer than 64 characters.');
        if (password.length < 8) errors.push('Passwords must be at least 8 characters long.');
        if (password.length > 64) errors.push('Passwords canot be longer than 64 characters long.');
        if (password != passwordConfirm) errors.push('Passwords do not match.');
        if (firstname.length > 16 || lastname.length > 16) errors.push('Names cannot be longer than 16 characters');
    }

    // Check if the username has already been taken in the database
    User.findIdByUsername(username, (err, user_id) => {
        if (!err && user_id) errors.push('Username already taken.');
        // Check if the email has already been used in the database
        User.findIdByEmail(email, (err, user_id) => {
            if (!err && user_id) errors.push('Email already taken.');

            // If there are no errors
            if (errors.length == 0) {
                // Create a new user in the database
                User.create({ username, email, password, firstname, lastname }, (err, user_id) => {
                    // If there was no error
                    if (!err) {
                        // Login the user
                        req.login(user_id);
                        log(`${username}#${user_id} has registered`);
                        // Save the username to saved login data
                        req.session.login = { username };
                        // Send a 
                        req.flash('success', 'You have successfully registered.');
                        res.redirect('/');
                    // If there was an error
                    } else {
                        // Send a successful registration flash message and redirect to the dashboard
                        req.flash('danger', JSON.stringify(err));
                        res.redirect('/register/');
                    }
                });
            // If there are validation errors
            } else {
                // Send the validation errors to the user and reload the register page
                req.flash('danger', errors);
                res.redirect('/register/');
            }

        });
    });

});

/**
 * Delete route
 */

//POST '/delete' route
router.post('/delete', (req, res) => {

    // Extract password from the request's body
    let { password } = req.body;

    // Find the password of the user from the database
    User.findPasswordById(req.user_id, (err, hash) => {
        // If there was no error
        if (!err) {
            // Compare the password entered to the hash from the database
            authentication.comparePassword(password, hash, (match) => {
                // If the password matches the hash
                if (match) {
                    // Delete the user record from the database
                    User.delete(req.user_id, (err) => {
                        // If there was no error
                        if (!err) {
                            // Logout the user
                            req.logout();
                            log(`${req.user.username}#${req.user_id} has deleted their account`);
                            // Send a successful logout flash message and redirect to the index route
                            req.flash('success', 'Your account has been deleted.');
                            res.redirect('/');
                        // If there was an error
                        } else {
                            // Send a error flash message and reload their profile page
                            req.flash('danger', JSON.stringify(err));
                            res.redirect(`/profile/${req.user_id}`);
                        }
                    });
                // If the password does not match the hash
                } else {
                    // Send a error flash message and reload their profile page
                    req.flash('danger', 'Incorrect password.');
                    res.redirect(`/profile/${req.user_id}`);
                }
            });
        // If there was an error
        } else {
            // Send a error flash message and reload their profile page
            req.flash('danger', JSON.stringify(err));
            res.redirect(`/profile/${req.user_id}`);
        }
    });

});

module.exports = router;
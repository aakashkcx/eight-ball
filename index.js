'use strict';

/**
 * Imports
 */

// Dependencies
const path = require('path');
const express = require('express');
const expressHandlebars = require('express-handlebars');
const expressSession = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const logger = require('morgan');

// Components
const database = require('./database');
const socket = require('./socket');

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

/**
 * Initialise
 */

// Initialise app
const app = express();

// Initialise server
const server = socket(app);

// Set port
const PORT = process.env.PORT || 8080;
app.set('port', PORT);

/**
 * Middlewares
 */

// View engine
app.engine('handlebars', expressHandlebars());
app.set('view engine', 'handlebars');

// HTTP logger
app.use(logger('dev'));

// Body parser
app.use(express.json());

// Session
app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

// Validation
app.use(expressValidator());

// Flash messaging
app.use(flash());
app.use((req, res, next) => {
    res.locals.flash_success = req.flash('success');
    res.locals.flash_danger = req.flash('danger');
    res.locals.flash_warning = req.flash('warning');
    res.locals.flash_error = req.flash('error');
    next();
});

/**
 * Routing
 */

// Static path
app.use(express.static(path.join(__dirname, 'static')));

// Routers
app.use('/', indexRouter);
app.use('/', usersRouter);

// Invalid route
app.use((req, res) => {
    res.redirect('/');
});

/**
 * Start the server
 */

server.listen(PORT, () => {
    console.log(`Server started...\nListening on port ${PORT}...`);
});
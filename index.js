'use strict';

/**
 * Imports
 */

// Dependencies
const express = require('express');
const expressHandlebars = require('express-handlebars');
const expressSession = require('express-session');
const flash = require('connect-flash');
const logger = require('morgan');
const chalk = require('chalk');

// Imports
const database = require('./database');
const socket = require('./socket');
const authentication = require('./authentication');

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

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
const session = expressSession({
    store: database.sessionStore(expressSession),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
});
app.use(session);
socket.session(session);

// Authentication
app.use(authentication);

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
app.use(express.static('static'));

// HTTP logger
app.use(logger('tiny'));

// Routers
app.use('/', indexRouter);
app.use('/', usersRouter);

// Invalid route
app.get('*', (req, res, next) => next('Page not found.'));

// Error handler
app.use((err, req, res, next) => res.render('error', { error: err }));

/**
 * Start the server
 */

// Listen to a port
server.listen(PORT, () => {
    console.log(chalk.bold.red('Server started...'));
    console.log(chalk.bold.red(`Listening on port ${PORT}...`));
});

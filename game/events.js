'use strict';

// Imports
const Vector = require('./Vector');

const events = {};

events.ballPotted = function (game, ball) {
    switch (ball.colour) {
        case 'red':
            if (game.colourSelected) {
                game[`player${game.redPlayer}`].score++;
                if (game.lastTurn == game.redPlayer) game.turn = game.redPlayer;
            } else {

            };
            game.balls.splice(game.balls.indexOf(ball), 1);
            break;
        case 'yellow':
            if (game.colourSelected) {
                game[`player${game.yellowPlayer}`].score++;
                if (game.lastTurn == game.yellowPlayer) game.turn = game.yellowPlayer;
            } else {

            };
            game.balls.splice(game.balls.indexOf(ball), 1);
            break;
        case 'white':
            ball.position = new Vector(320, 360);
            ball.velocity = new Vector(0, 0);
            ball.acceleration = new Vector(0, 0);
            break;
        case 'black':
            ball.position = new Vector(1030, 360);
            ball.velocity = new Vector(0, 0);
            ball.acceleration = new Vector(0, 0);
            break;
    };
};


module.exports = events;
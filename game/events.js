'use strict';

// Imports
const Vector = require('./Vector');

const events = {};

events.ballPotted = function (game, ball) {

    switch (ball.colour) {

        case 'red':

            if (game.colourSelected) {

                if (game.turn == game.redPlayer) {
                    game.potted = true;
                } else {
                    game.foul = true;
                }

            } else {

                game.redPlayer = game.turn;
                game.redPlayer.colour = 'red';
                game.yellowPlayer = (game.redPlayer == game.player1 ? game.player2 : game.player1);
                game.yellowPlayer.colour = 'yellow';
                game.colourSelected = true;
                game.potted = true;

            }

            game.redPlayer.score++;

            game.balls.splice(game.balls.indexOf(ball), 1);

            break;

        case 'yellow':

            if (game.colourSelected) {

                if (game.turn == game.yellowPlayer) {
                    game.potted = true;
                } else {
                    game.foul = true;
                }

            } else {

                game.yellowPlayer = game.turn;
                game.yellowPlayer.colour = 'yellow';
                game.redPlayer = (game.yellowPlayer == game.player1 ? game.player2 : game.player1);
                game.redPlayer.colour = 'red';
                game.colourSelected = true;
                game.potted = true;
            }

            game.yellowPlayer.score++;

            game.balls.splice(game.balls.indexOf(ball), 1);

            break;

        case 'white':

            game.foul = true;

            ball.position = new Vector(320, 360);
            ball.velocity = new Vector(0, 0);
            ball.acceleration = new Vector(0, 0);

            break;

        case 'black':

            ball.position = new Vector(1030, 360);
            ball.velocity = new Vector(0, 0);
            ball.acceleration = new Vector(0, 0);

            break;

    }

};


module.exports = events;
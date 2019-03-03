'use strict';

// Imports
const Vector = require('./Vector');

// Initialise physics object
const events = {};

// Ball potted method
events.ballPotted = function (game, ball) {

    // Switch case ball colour
    switch (ball.colour) {

        // Red ball
        case 'red':

            // If the colours have been selected
            if (game.colourSelected) {

                // If the red player potted the red ball, set potted to true
                if (game.turn == game.redPlayer) {
                    game.potted = true;
                // If the yellow player potted the red ball, set foul to true
                } else {
                    game.foul = true;
                }

            // If the colours have not been selected
            } else {

                // Set the current player to red
                game.redPlayer = game.turn;
                game.redPlayer.colour = 'red';
                // Set the other player to yellow
                game.yellowPlayer = game.nextTurn;
                game.yellowPlayer.colour = 'yellow';
                // Set colour selected to true and potted to true
                game.colourSelected = true;
                game.potted = true;

            }

            // Increment the red player's score
            game.redPlayer.score++;
            // Remove the potted ball from the game
            game.balls.splice(game.balls.indexOf(ball), 1);

            break;

        // Yellow ball
        case 'yellow':

            // If the colours have been selected
            if (game.colourSelected) {

                // If the yellow player potted the yellow ball, set potted to true
                if (game.turn == game.yellowPlayer) {
                    game.potted = true;
                // If the red player potted the yellow ball, set foul to true
                } else {
                    game.foul = true;
                }

            // If the colours have not been selected
            } else {

                // Set the current player to yellow
                game.yellowPlayer = game.turn;
                game.yellowPlayer.colour = 'yellow';
                // Set the other player to red
                game.redPlayer = game.nextTurn;
                game.redPlayer.colour = 'red';
                // Set colour selected to true and potted to true
                game.colourSelected = true;
                game.potted = true;
                
            }

            // Increment the yellow player's score
            game.yellowPlayer.score++;
            // Remove the potted ball from the game
            game.balls.splice(game.balls.indexOf(ball), 1);

            break;

        // White ball
        case 'white':

            // Set foul to true
            game.foul = true;

            // Reset position of the white ball
            ball.position = new Vector(320, 360);
            ball.velocity = new Vector(0, 0);
            ball.acceleration = new Vector(0, 0);

            break;

        // Black ball
        case 'black':

            // If the current player has potted all of their balls, set their score to 8
            if (game.turn.score >= 7) {
                game.turn.score = 8;
            // If the current player has not potted all of their balls, set the opponent's score to 8
            } else {
                game.nextTurn.score = 8;
            }

            // Remove the potted ball from the game
            game.balls.splice(game.balls.indexOf(ball), 1);

            break;

    }

};

// Export events module 
module.exports = events;
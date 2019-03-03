'use strict';

// Components
const Ball = require('./Ball');
const Vector = require('./Vector');
const physics = require('./physics');
const events = require('./events');
const GameDB = require('../models/Game');
const UserDB = require('../models/User');

// Constants
const WIDTH = 1280;
const HEIGHT = 720;
const BALL_RADIUS = 20;
const MAX_POWER = 50;
const POCKETS = [[0, 0], [WIDTH / 2, 0], [WIDTH, 0], [0, HEIGHT], [WIDTH / 2, HEIGHT], [WIDTH, HEIGHT]]
    .map(params => ({ position: new Vector(params[0], params[1]), radius: BALL_RADIUS, velocity: new Vector() }));

// Game counter
let num = 0;

// Game class constructor
const Game = function (player1, player2) {

    // Game id
    this.id = ++num;

    // Add player reference and set game properties
    this.player1 = player1;
    this.player2 = player2;
    this.player1.game = this;
    this.player2.game = this;
    this.player1.inGame = true;
    this.player2.inGame = true;

    // Game status properties
    this.active = false;
    this.ended = false;

    // Game turn properties
    this.turn = this.player1;
    this.nextTurn = this.player2;
    this.foul = false;
    this.potted = false;

    // Game score
    this.player1.score = 0;
    this.player2.score = 0;

    // Game player colour properties
    this.colourSelected = false;
    this.redPlayer = null;
    this.yellowPlayer = null;
    this.player1.colour = '';
    this.player2.colour = '';

    // Game balls array
    this.balls = [
        [320, 360, 'white'],
        [1030, 360, 'black'],
        [960, 360, 'red'],
        [995, 340, 'yellow'],
        [995, 380, 'red'],
        [1030, 320, 'red'],
        [1030, 400, 'yellow'],
        [1065, 300, 'yellow'],
        [1065, 340, 'red'],
        [1065, 380, 'yellow'],
        [1065, 420, 'red'],
        [1100, 280, 'yellow'],
        [1100, 320, 'red'],
        [1100, 360, 'yellow'],
        [1100, 400, 'red'],
        [1100, 440, 'yellow']
    ].map(params => new Ball(new Vector(params[0], params[1]), BALL_RADIUS, params[2]));

    // Game white and black balls
    this.cueBall = this.balls[0];
    this.blackBall = this.balls[1];

};

// Update class method
Game.prototype.update = function () {

    // Set game active property to false by default
    this.active = false;

    // Loop through each ball
    for (let i = 0; i < this.balls.length; i++) {

        // Current ball
        const ball = this.balls[i];

        // Loop through the other balls and resolve their collisions
        for (let j = i + 1; j < this.balls.length; j++) {
            const collidingBall = this.balls[j];
            physics.collideBalls(ball, collidingBall);
        }

        // Resolve the collision with the cushions
        physics.collideCushions(ball, WIDTH, HEIGHT);

        // Update ball motion
        let ballActive = physics.ballMotion(ball);
        // If the ball is moving, set the active property of the game to true
        if (ballActive) this.active = true;

        // Iterate through each pocket and check if the ball has been pocketed
        POCKETS.forEach(pocket => {
            if (physics.doBallsOverlap(ball, pocket)) events.ballPotted(this, ball);
        });

    }

    // If all balls have stopped moving
    if (!this.active) {

        // If there was a foul or no ball potted, change the turn
        if (this.foul || !this.potted) [this.turn, this.nextTurn] = [this.nextTurn, this.turn];

        // Reset foul and potted properties
        this.foul = false;
        this.potted = false;

        if (this.player1.score >= 8) this.end(this.player1);
        if (this.player2.score >= 8) this.end(this.player2);

    }

    // Return whether there is an update in turns
    return !this.active;

};

// Shoot class method
Game.prototype.shoot = function (player, power, angle) {
    // Check if it is the player's turn, the balls have stopped moving, and the power is not above the max power
    if (this.turn == player && !this.active && power <= MAX_POWER) {
        // Update cue ball's velocity and set active to true
        this.cueBall.velocity = new Vector(power * Math.cos(angle), power * Math.sin(angle));
        this.active = true;
    }
};

// Game end method
Game.prototype.end = function (winner) {

    // Set winner's score to 8
    winner.score = 8;
    // Get loser
    let loser = (winner == this.player1 ? this.player2 : this.player1);

    // Create new game in the database
    GameDB.create(this.player1, this.player2, (err) => {
        if (err) console.log(err);

        // Increment the wins of the winner
        UserDB.incrementWins(winner.id, (err) => {
            if (err) console.log(err);

            // Increment the losses of the loser
            UserDB.incrementLosses(loser.id, (err) => {
                if (err) console.log(err);

                // Set ending game properties
                this.active = false;
                this.ended = true;

                // Set player properties
                this.player1.inGame = false;
                this.player2.inGame = false;
                delete this.player1.game;
                delete this.player2.game;
                delete this.player1.colour;
                delete this.player2.colour;

            });

        });

    });

};

// Data that is sent to the players when the game starts
Game.prototype.startData = function (player) {
    let opponent = (player == this.player1 ? this.player2 : this.player1);
    return {
        player: { id: player.id, username: player.username, score: player.score, colour: player.colour },
        opponent: { id: opponent.id, username: opponent.username, score: opponent.score, colour: opponent.colour },
        active: this.active,
        turn: (player == this.turn),
        balls: this.balls.map(ball => { return { x: ball.position.x, y: ball.position.y, colour: ball.colour }; })
    };
};

// Data that is sent to the players each game update
Game.prototype.updateData = function () {
    return {
        active: this.active,
        balls: this.balls.map(ball => { return { x: ball.position.x, y: ball.position.y, colour: ball.colour }; })
    };
};

// Data that is sent to the palyers when the turn changes
Game.prototype.turnData = function (player) {
    let opponent = (player == this.player1 ? this.player2 : this.player1);
    return {
        player: { score: player.score, colour: player.colour },
        opponent: { score: opponent.score, colour: opponent.colour },
        turn: (player == this.turn)
    };
};

// Data that is sent to the players when the game ends
Game.prototype.endData = function (player) {
    let opponent = (player == this.player1 ? this.player2 : this.player1);
    return { winner: player.score > opponent.score };
};

// Export game class
module.exports = Game;
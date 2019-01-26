'use strict';

// Components
const Ball = require('./Ball');
const Vector = require('./Vector');
const physics = require('./physics');

// Constants
const WIDTH = 1280;
const HEIGHT = 720;
const BALL_RADIUS = 20;

let num = 0;

// Game class constructor
const Game = function (player1, player2) {

    this.id = ++num;

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

    this.cueBall = this.balls[0];
    this.blackBall = this.balls[1];

    this.active = false;

    this.player1 = player1;
    this.player2 = player2;

    this.turn = 1;

    player1.game = this;
    player2.game = this;
    player1.inGame = true;
    player2.inGame = true;
    player1.playerNum = 1;
    player2.playerNum = 2;

};

// Update class method
Game.prototype.update = function () {

    this.active = false;

    for (let i = 0; i < this.balls.length; i++) {

        const ball = this.balls[i];
        physics.collideCushions(ball, WIDTH, HEIGHT);

        for (let j = i + 1; j < this.balls.length; j++) {
            const collidingBall = this.balls[j];
            physics.collideBalls(ball, collidingBall);
        };

        let ballActive = physics.ballMotion(ball);

        if (ballActive) this.active = true;

    };

};

// Shoot class method
Game.prototype.shoot = function (power, angle) {
    this.cueBall.velocity = new Vector(power * Math.cos(angle), power * Math.sin(angle));
    this.active = true;
};

// Data that is sent to the players when the game starts
Game.prototype.startData = function () {
    return {
        player1: { id: this.player1.id, name: this.player1.name },
        player2: { id: this.player2.id, name: this.player2.name },
        balls: this.balls.map(ball => {return {x: ball.position.x, y: ball.position.y, colour: ball.colour}}),
        active: this.active
    };
};

// Data that is sent to the players each game update
Game.prototype.updateData = function () {
    return {
        balls: this.balls.map(ball => {return {x: ball.position.x, y: ball.position.y, colour: ball.colour}}),
        active: this.active
    };
};

// Export game class
module.exports = Game;
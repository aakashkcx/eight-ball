'use strict';

// Components
const Ball = require('./Ball');
const Vector = require('./Vector');
const physics = require('./physics');

// Constants
const WIDTH = 1280;
const HEIGHT = 720;
const BALL_RADIUS = 15;

let num = 0;

// Game class constructor
const Game = function (player1, player2) {

    this.id = ++num;

    this.balls = [
        [320, 360, 'white'],
        [1010, 360, 'black'],
        [960, 360, 'red'],
        [985, 345, 'yellow'],
        [985, 375, 'red'],
        [1010, 330, 'red'],
        [1010, 390, 'yellow'],
        [1035, 314, 'yellow'],
        [1035, 345, 'red'],
        [1035, 375, 'yellow'],
        [1035, 405, 'red'],
        [1060, 300, 'yellow'],
        [1060, 330, 'red'],
        [1060, 360, 'yellow'],
        [1060, 390, 'red'],
        [1060, 420, 'yellow']
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

        let ball = this.balls[i];
        physics.collideCushions(ball, WIDTH, HEIGHT);

        for (let j = i + 1; j < this.balls.length; j++) {
            let collidingBall = this.balls[j];
            physics.collideBalls(ball, collidingBall);
        };

        ball.update();
        if (ball.moving) this.active = true;

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
        BALL_RADIUS: BALL_RADIUS,
        WIDTH: WIDTH,
        HEIGHT: HEIGHT,
        player1: { id: this.player1.id, name: this.player1.name },
        player2: { id: this.player2.id, name: this.player2.name },
        balls: this.balls
    };
};

// Data that is sent to the players each game update
Game.prototype.updateData = function () {
    return {
        balls: this.balls
    };
};

// Export game class
module.exports = Game;
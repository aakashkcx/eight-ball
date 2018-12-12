'use strict';

// Components
const Ball = require('./Ball');
const Vector = require('./Vector');
const Physics = require('./Physics');

// Constants
const WIDTH = 1280;
const HEIGHT = 720;

let num = 0;

// Game constructor
const Game = function (player1, player2) {

    this.id = ++num;

    this.width = WIDTH;
    this.height = HEIGHT;

    this.player1 = player1;
    this.player2 = player2;

    this.balls = [
        [320, 360, 20, 20, 'white'],
        [960, 360, 0, 0, 'red'],
        [985, 345, 0, 0, 'yellow'],
        [985, 375, 0, 0, 'red'],
        [1010, 330, 0, 0, 'yellow'],
        [1010, 360, 0, 0, 'B'],
        [1010, 390, 0, 0, 'red'],
        [1035, 314, 0, 0, 'yellow'],
        [1035, 345, 0, 0, 'red'],
        [1035, 375, 0, 0, 'yellow'],
        [1035, 405, 0, 0, 'red'],
        [1060, 300, 0, 0, 'yellow'],
        [1060, 330, 0, 0, 'red'],
        [1060, 360, 0, 0, 'yellow'],
        [1060, 390, 0, 0, 'red'],
        [1060, 420, 0, 0, 'yellow']
    ].map(params => new Ball(new Vector(params[0], params[1]), new Vector(params[2], params[3]), params[4]));

    this.cueBall = this.balls[0];

    player1.inGame = true;
    player1.game = this;
    player2.inGame = true;
    player2.game = this;

};

Game.prototype.update = function () {

    let active = false;

    for (let i = 0; i < this.balls.length; i++) {

        const ball1 = this.balls[i];
        Physics.collideCushions(ball1, this.width, this.height);

        for (let j = i + 1; j < this.balls.length; j++) {

            const ball2 = this.balls[j];
            Physics.collideBalls(ball1, ball2);

        };

        ball1.update();

        if (ball1.moving) active = true;

    };

    return active;

};

Game.prototype.shoot = function (power, angle) {
    this.cueBall.velocity = new Vector(power * Math.cos(angle), power * Math.sin(angle));
};

Game.prototype.startData = function () {
    return {
        width: this.width,
        height: this.height,
        player1: { id: this.player1.id, name: this.player1.name },
        player2: { id: this.player2.id, name: this.player2.name },
        balls: this.balls
    };
};

Game.prototype.updateData = function () {
    return {
        balls: this.balls
    };
};

module.exports = Game;
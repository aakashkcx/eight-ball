'use strict';

// Components
const Ball = require('./Ball');
const Vector = require('./Vector');
const physics = require('./physics');

// Constants
const WIDTH = 1280;
const HEIGHT = 720;

let num = 0;

// Game class constructor
const Game = function (player1, player2) {

    this.id = ++num;

    this.width = WIDTH;
    this.height = HEIGHT;

    this.balls = [
        [320, 360, 'white'],
        [960, 360, 'red'],
        [985, 345, 'yellow'],
        [985, 375, 'red'],
        [1010, 330, 'red'],
        [1010, 360, 'black'],
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
    ].map(params => new Ball(new Vector(params[0], params[1]), new Vector(0,0), params[2]));
    
    this.cueBall = this.balls[0];

    this.active = false;

    this.player1 = player1;
    this.player2 = player2;
    player1.inGame = true;
    player1.game = this;
    player2.inGame = true;
    player2.game = this;

};

// Update class method
Game.prototype.update = function () {

    this.active = false;

    for (let i = 0; i < this.balls.length; i++) {

        const ball1 = this.balls[i];
        physics.collideCushions(ball1, this.width, this.height);

        for (let j = i + 1; j < this.balls.length; j++) {
            const ball2 = this.balls[j];
            physics.collideBalls(ball1, ball2);
        };

        ball1.update();

        if (ball1.moving) this.active = true;

    };

};

// Shoot class method
Game.prototype.shoot = function (power, angle) {
    this.cueBall.velocity = new Vector(power * Math.cos(angle), power * Math.sin(angle));
};

// Data that is sent to the players when the game starts
Game.prototype.startData = function () {
    return {
        width: this.width,
        height: this.height,
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
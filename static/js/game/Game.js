'use strict';

// Constants
const BALL_RADIUS = 20;

const Game = function (data) {

    this.balls = data.balls.map(ball => new Ball(new Vector(ball.x, ball.y), BALL_RADIUS, ball.colour));

    this.cueBall = this.balls[0];

};

Game.prototype.update = function (data) {

    this.balls = data.balls.map(ball => new Ball(new Vector(ball.x, ball.y), BALL_RADIUS, ball.colour));
    
};

Game.prototype.draw = function () {

    canvas.clear();
    canvas.drawTable();
    this.balls.forEach(ball => ball.draw());

};
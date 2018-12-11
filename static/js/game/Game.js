'use strict';

const Game = function (data) {

    this.width = data.width;
    this.height = data.height;

    this.balls = data.balls.map(ball => new Ball(ball.position, ball.radius, ball.colour));

    canvas.width = this.width;
    canvas.height = this.height;

};

Game.prototype.update = function () {

    this.balls = data.balls.map(ball => new Ball(ball.position, ball.radius, ball.colour));

};

Game.prototype.draw = function () {

    canvas.clear();
    this.balls.forEach(ball => ball.draw());

};
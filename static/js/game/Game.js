'use strict';

const Game = function (data) {

    this.balls = data.balls.map(ball => new Ball(ball.position, ball.radius, ball.colour));
    this.cueBall = this.balls[0];

};

Game.prototype.update = function (data) {

    this.balls = data.balls.map(ball => new Ball(ball.position, ball.radius, ball.colour));
    
};

Game.prototype.draw = function () {

    canvas.clear();
    canvas.drawTable();
    this.balls.forEach(ball => ball.draw());

};
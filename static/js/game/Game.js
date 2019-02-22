'use strict';

// Constants
const BALL_RADIUS = 20;

const Game = function (data) {

    this.player = data.player;
    this.opponent = data.opponent;

    this.active = data.active;
    this.turn = data.turn;

    this.balls = data.balls.map(ball => new Ball(new Vector(ball.x, ball.y), BALL_RADIUS, ball.colour));

    this.cueBall = this.balls[0];
    this.stick = new Stick(this.cueBall.position);

};

Game.prototype.update = function (data) {

    this.active = data.active;

    this.balls = data.balls.map(ball => new Ball(new Vector(ball.x, ball.y), BALL_RADIUS, ball.colour));

    this.cueBall = this.balls[0];
    this.stick.position = this.cueBall.position;

};

Game.prototype.updateTurn = function (data) {

    this.player.score = data.player.score;
    this.opponent.score = data.opponent.score;

    this.player.colour = data.player.colour;
    this.opponent.colour = data.opponent.colour;

    this.turn = data.turn;

};

Game.prototype.draw = function () {

    canvas.clear();
    canvas.drawTable();

    if (!this.active && this.turn) this.stick.draw();
    
    this.balls.forEach(ball => ball.draw());

};
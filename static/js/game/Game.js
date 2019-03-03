'use strict';

// Constants
const BALL_RADIUS = 20;

// Game class constructor
const Game = function (data) {

    // Player and opponent properties
    this.player = data.player;
    this.opponent = data.opponent;
    // Game turn and active properties
    this.active = data.active;
    this.turn = data.turn;

    // Game balls array
    this.balls = data.balls.map(ball => new Ball(new Vector(ball.x, ball.y), BALL_RADIUS, ball.colour));
    this.cueBall = this.balls[0];

    // Game cue stick
    this.stick = new Stick(this.cueBall.position);

};

// Game update method
Game.prototype.update = function (data) {

    // Update active property
    this.active = data.active;

    // Update balls array
    this.balls = data.balls.map(ball => new Ball(new Vector(ball.x, ball.y), BALL_RADIUS, ball.colour));
    this.cueBall = this.balls[0];

    // Update cue stick position
    this.stick.position = this.cueBall.position;

};

// Game turn update method
Game.prototype.updateTurn = function (data) {

    // Update scores
    this.player.score = data.player.score;
    this.opponent.score = data.opponent.score;

    // Update colours
    this.player.colour = data.player.colour;
    this.opponent.colour = data.opponent.colour;

    // Update turn
    this.turn = data.turn;

};

// Game draw method
Game.prototype.draw = function () {

    // Clear the canvas and draw an empty table
    canvas.clear();
    canvas.drawTable();

    // If it's the player's turn and the balls are not moving, draw the guides
    if (!this.active && this.turn) this.stick.drawGuide();

    // Draw table borders
    canvas.drawBorders();

    // Draw each ball to the table
    this.balls.forEach(ball => ball.draw());

    // If it's the player's turn and the balls are not moving, draw the cue stick
    if (!this.active && this.turn) this.stick.draw();

};
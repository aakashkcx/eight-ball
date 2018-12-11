'use strict';

// Imports
const Vector = require('./Vector');

// Constants
const BALL_RADIUS = 15;

const Ball = function (position, velocity, colour) {

    this.position = position;
    this.velocity = velocity;
    this.acceleration = new Vector();
    
    this.radius = BALL_RADIUS;
    this.colour = colour;

};

Ball.prototype.moving = () => this.velocity.length > 0.25;

Ball.prototype.update = function () {

    this.acceleration = Vector.multiply(this.velocity, -0.005);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    if (!this.moving()) this.velocity = new Vector();

};

module.exports = Ball;
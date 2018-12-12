'use strict';

// Imports
const Vector = require('./Vector');

// Constants
const BALL_RADIUS = 15;

// Ball class constructor
const Ball = function (position, velocity, colour) {

    this.position = position;
    this.velocity = velocity;
    this.acceleration = new Vector();
    
    this.radius = BALL_RADIUS;
    this.colour = colour;

};

Ball.prototype = {

    // Moving property
    get moving() {
        return this.velocity.length > 0.25;
    }

};

// Update class method
Ball.prototype.update = function () {

    this.acceleration = Vector.multiply(this.velocity, -0.005);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    if (!this.moving) this.velocity = new Vector();

};

// Export ball class
module.exports = Ball;
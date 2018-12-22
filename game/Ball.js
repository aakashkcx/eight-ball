'use strict';

// Imports
const Vector = require('./Vector');

// Ball class constructor
const Ball = function (position, radius, colour) {

    this.position = position;
    this.velocity = new Vector();
    this.acceleration = new Vector();
    
    this.radius = radius;
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
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

// Export ball class
module.exports = Ball;
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

// Export ball class
module.exports = Ball;
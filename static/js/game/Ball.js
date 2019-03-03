'use strict';

// Ball class constructor
const Ball = function (position, radius, colour) {

    // Properties
    this.position = position;
    this.radius = radius;
    this.colour = colour;

};

// Ball draw method
Ball.prototype.draw = function () {
    // Draw a circle on the canvas
    canvas.drawCircle(this.position, TABLE, this.radius, this.colour);
};
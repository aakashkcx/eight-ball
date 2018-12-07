'use strict';

const Ball = function (position, radius, colour) {

    this.position = position;
    this.radius = radius;
    this.colour = colour;

};

Ball.prototype.draw = function () {

    canvas.drawCircle(this.position, this.radius, this.colour);

};
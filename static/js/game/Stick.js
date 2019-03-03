'use strict';

// Constants
const MAX_POWER = 50;
const STICK_WIDTH = 20;
const STICK_HEIGHT = 750;

// Stick class constructor
const Stick = function (position) {

    // Properties
    this.position = position;
    this.rotation = 0;
    this.power = 0;

};

// Stick draw method
Stick.prototype.draw = function () {

    // Find angle between cue ball and mouse
    let opposite = canvas.mouse.position.y - this.position.y;
    let adjacent = canvas.mouse.position.x - this.position.x;
    this.rotation = Math.atan2(opposite, adjacent);

    // If mouse is pressed, increase power
    if (canvas.mouse.down) {
        if (this.power < MAX_POWER) this.power+= 0.5;
    // If mouse has been released, call the shoot function and reset power
    } else if (this.power > 0) {
        shoot(this.power, this.rotation);
        this.power = 0;
    }

    // Calculate distance from cue ball from power
    let offset = new Vector(-STICK_WIDTH / 2, this.power + 50);
    // Draw rectangle to canvas
    canvas.drawRect(offset, Vector.add(this.position, TABLE), new Vector(STICK_WIDTH, STICK_HEIGHT), 'bisque', this.rotation + Math.PI / 2);

};

// Draw guide method
Stick.prototype.drawGuide = function () {
    canvas.drawRect(new Vector(0,-5), Vector.add(this.position, TABLE), new Vector(2000, 10), 'rgba(0, 0, 0, 0.25)', this.rotation);
};
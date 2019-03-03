'use strict';

// Constants
const WIDTH = 1280;
const HEIGHT = 720;
const BORDER = 50;
const TABLE = new Vector(BORDER, BORDER); // Origin for drawing to table

// Initialise canvas object
const canvas = {};

// Get the canvas element and its context
canvas._DOM = document.getElementById('canvas');
canvas._context = canvas._DOM.getContext('2d');

// Set the canvas width and height
canvas._DOM.width = canvas.width = WIDTH + 2 * BORDER;
canvas._DOM.height = canvas.height = HEIGHT + 2 * BORDER;

/**
 * Mouse
 */

// Initialise canvas mouse object
canvas.mouse = {
    position: new Vector(),
    down: false
};

// Mouse move event
document.onmousemove = function (e) {
    // Get position of canvas on page
    let rect = canvas._DOM.getBoundingClientRect();
    // Get position of mouse relative to the canvas
    canvas.mouse.position.x = (e.pageX - rect.left - window.scrollX) * canvas.width / rect.width - BORDER;
    canvas.mouse.position.y = (e.pageY - rect.top - window.scrollY) * canvas.height / rect.height - BORDER;
};

// Mouse down event
canvas._DOM.onmousedown = () => canvas.mouse.down = true;

// Mouse up event
canvas._DOM.onmouseup = () => canvas.mouse.down = false;

// Touch move event
canvas._DOM.ontouchmove = function (e) {
    // Prevent accidental scrolling
    e.preventDefault();
    // Get position of canvas on page
    let rect = canvas._DOM.getBoundingClientRect();
    // Get touch position relative to the canvas
    canvas.mouse.position.x = (e.touches[0].pageX - rect.left - window.scrollX) * canvas.width / rect.width - BORDER;
    canvas.mouse.position.y = (e.touches[0].pageY - rect.top - window.scrollY) * canvas.height / rect.height - BORDER;
};

canvas._DOM.ontouchstart = () => canvas.mouse.down = true;

canvas._DOM.ontouchend = () => canvas.mouse.down = false;

/**
 * Drawing to the canvas
 */

// Canvas clear method
canvas.clear = function () {
    canvas._context.clearRect(0, 0, canvas.width, canvas.height);
};

// Draw a filled rectangle
canvas.drawRect = function (position, origin, dimensions, colour, rotation = 0) {
    canvas._context.save();
    canvas._context.fillStyle = colour;
    canvas._context.translate(origin.x, origin.y);
    canvas._context.rotate(rotation);
    canvas._context.fillRect(position.x, position.y, dimensions.x, dimensions.y);
    canvas._context.restore();
};

// Draw a filled circle
canvas.drawCircle = function (position, origin, radius, colour) {
    canvas._context.save();
    canvas._context.fillStyle = colour;
    canvas._context.translate(position.x, position.y);
    canvas._context.beginPath();
    canvas._context.arc(origin.x, origin.y, radius, 0, 2 * Math.PI);
    canvas._context.fill();
    canvas._context.closePath();
    canvas._context.restore();
};

// Draw a stroked rectangle
canvas.strokeRect = function (position, origin, dimensions, colour, strokeSize, rotation = 0) {
    canvas._context.save();
    canvas._context.strokeStyle = colour;
    canvas._context.lineWidth = strokeSize;
    canvas._context.translate(position.x, position.y);
    canvas._context.rotate(rotation);
    canvas._context.strokeRect(origin.x, origin.y, dimensions.x, dimensions.y);
    canvas._context.restore();
};

// Draw the table
canvas.drawTable = function () {
    canvas.drawRect(new Vector(0, 0), TABLE, new Vector(WIDTH, HEIGHT), 'green');
};

// Draw the table borders
canvas.drawBorders = function () {
    canvas.strokeRect(new Vector(0, 0), new Vector(0, 0), new Vector(canvas.width, canvas.height), 'saddlebrown', 100);
    canvas.drawCircle(new Vector(0, 0), TABLE, BALL_RADIUS * 2, 'black');
    canvas.drawCircle(new Vector(WIDTH / 2, -10), TABLE, BALL_RADIUS * 2, 'black');
    canvas.drawCircle(new Vector(WIDTH, 0), TABLE, BALL_RADIUS * 2, 'black');
    canvas.drawCircle(new Vector(0, HEIGHT), TABLE, BALL_RADIUS * 2, 'black');
    canvas.drawCircle(new Vector(WIDTH / 2, HEIGHT + 10), TABLE, BALL_RADIUS * 2, 'black');
    canvas.drawCircle(new Vector(WIDTH, HEIGHT), TABLE, BALL_RADIUS * 2, 'black');
    canvas.strokeRect(new Vector(0, 0), new Vector(0, 0), new Vector(canvas.width, canvas.height), 'saddlebrown', 50);
};
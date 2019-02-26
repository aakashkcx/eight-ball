'use strict';

const WIDTH = 1280;
const HEIGHT = 720;
const BORDER = 50;
const TABLE = new Vector(BORDER, BORDER);

const canvas = {};

canvas._DOM = document.getElementById('canvas');
canvas._context = canvas._DOM.getContext('2d');

canvas._DOM.width = canvas.width = WIDTH + 2 * BORDER;
canvas._DOM.height = canvas.height = HEIGHT + 2 * BORDER;


canvas.mouse = {};
canvas.mouse.position = new Vector();
canvas.mouse.down = false;

document.onmousemove = function (e) {
    let rect = canvas._DOM.getBoundingClientRect();
    canvas.mouse.position.x = (e.pageX - rect.left - window.scrollX) * canvas.width / rect.width - BORDER;
    canvas.mouse.position.y = (e.pageY - rect.top - window.scrollY) * canvas.height / rect.height - BORDER;
};

canvas._DOM.onmousedown = function () {
    canvas.mouse.down = true;
};

canvas._DOM.onmouseup = function () {
    canvas.mouse.down = false;
};

canvas._DOM.ontouchmove = function (e) {
    e.preventDefault();
    let rect = canvas._DOM.getBoundingClientRect();
    canvas.mouse.position.x = (e.touches[0].pageX - rect.left - window.scrollX) * canvas.width / rect.width - BORDER;
    canvas.mouse.position.y = (e.touches[0].pageY - rect.top - window.scrollY) * canvas.height / rect.height - BORDER;
};

canvas._DOM.ontouchstart = function () {
    canvas.mouse.down = true;
};

canvas._DOM.ontouchend = function () {
    canvas.mouse.down = false;
};


canvas.clear = function () {
    canvas._context.clearRect(0, 0, canvas.width, canvas.height);
};

canvas.strokeRect = function (position, origin, dimensions, colour, strokeSize, rotation = 0) {
    canvas._context.save();
    canvas._context.strokeStyle = colour;
    canvas._context.lineWidth = strokeSize;
    canvas._context.translate(position.x, position.y);
    canvas._context.rotate(rotation);
    canvas._context.strokeRect(origin.x, origin.y, dimensions.x, dimensions.y);
    canvas._context.restore();
};

canvas.drawRect = function (position, origin, dimensions, colour, rotation = 0) {
    canvas._context.save();
    canvas._context.fillStyle = colour;
    canvas._context.translate(origin.x, origin.y);
    canvas._context.rotate(rotation);
    canvas._context.fillRect(position.x, position.y, dimensions.x, dimensions.y);
    canvas._context.restore();
};

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

canvas.drawTable = function () {

    canvas.drawRect(new Vector(0, 0), TABLE, new Vector(WIDTH, HEIGHT), 'green');

};

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
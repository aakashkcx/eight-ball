'use strict';

const canvas = $('#canvas').get(0);

canvas.context = canvas.getContext('2d');

canvas.clear = function () {
    canvas.context.clearRect(0, 0, canvas.width, canvas.height);
};

canvas.drawTable = function () {
    canvas.drawRect(new Vector(), WIDTH, HEIGHT, 'green');
    canvas.drawCircle(new Vector(0, 0), BALL_RADIUS * 3, 'black');
    canvas.drawCircle(new Vector(WIDTH / 2, -10), BALL_RADIUS * 2.5, 'black');
    canvas.drawCircle(new Vector(WIDTH, 0), BALL_RADIUS * 3, 'black');
    canvas.drawCircle(new Vector(0, HEIGHT), BALL_RADIUS * 3, 'black');
    canvas.drawCircle(new Vector(WIDTH / 2, HEIGHT + 10), BALL_RADIUS * 2.5, 'black');
    canvas.drawCircle(new Vector(WIDTH, HEIGHT), BALL_RADIUS * 3, 'black');
}

canvas.drawRect = function (position, width, height, colour) {
    canvas.context.fillStyle = colour;
    canvas.context.fillRect(position.x, position.y, width, height);
};

canvas.drawCircle = function (position, radius, colour) {
    canvas.context.fillStyle = colour;
    canvas.context.beginPath();
    canvas.context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
    canvas.context.fill();
    canvas.context.closePath();
};
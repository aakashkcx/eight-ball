'use strict';

const canvas = $('#canvas').get(0);

canvas.context = canvas.getContext('2d');

canvas.clear = function () {
    canvas.context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.context.fillStyle = 'green';
    canvas.context.fillRect(0, 0, canvas.width, canvas.height);
};

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
'use strict';

const Vector = function (x = 0, y = 0) {
    this.x = x;
    this.y = y;
};

Vector.add = function (vector1, vector2) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
};

Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
};

Vector.subtract = function (vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
};

Vector.prototype.subtract = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
};

Vector.prototype.subtractFrom = function (vector) {
    this.x = vector.x - this.x;
    this.y = vector.y - this.y;
    return this;
};

Vector.multiply = function (vector, scalar) {
    return new Vector(vector.x * scalar, vector.y * scalar);
};

Vector.prototype.multiply = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
};

Vector.divide = function (vector, scalar) {
    return new Vector(vector.x / scalar, vector.y / scalar);
};

Vector.prototype.divide = function (scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
};

Vector.dot = function (vector1, vector2) {
    return (vector1.x * vector2.x) + (vector1.y * vector2.y);
};

Vector.prototype.length = function () {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
};

Vector.prototype.lengthSquared = function () {
    return this.x ** 2 + this.y ** 2;
};

Vector.distance = function (vector1, vector2) {
    return Vector.subtract(vector1, vector2).length();
};

Vector.distanceSquared = function (vector1, vector2) {
    return Vector.subtract(vector1, vector2).lengthSquared();
};

module.exports = Vector;
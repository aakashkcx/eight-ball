'use strict';

// Vector class constructor
const Vector = function (x = 0, y = 0) {
    this.x = x;
    this.y = y;
};

// Vector addition static method
Vector.add = function (vector1, vector2) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
};

// Vector subtraction static method
Vector.subtract = function (vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
};

// Vector multiplication static method
Vector.multiply = function (vector, scalar) {
    return new Vector(vector.x * scalar, vector.y * scalar);
};

// Vector division static method
Vector.divide = function (vector, scalar) {
    return new Vector(vector.x / scalar, vector.y / scalar);
};
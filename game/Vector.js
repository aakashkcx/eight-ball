'use strict';

// Vector class constructor
const Vector = function (x = 0, y = 0) {
    this.x = x;
    this.y = y;
};

Vector.prototype = {

    // Length property
    get length() {
        return Math.sqrt(this.lengthSquared);
    },

    // Length squared property
    get lengthSquared() {
        return this.x ** 2 + this.y ** 2;
    }

};

// New zero vector method
Vector.zero = function() {
    return new Vector(0, 0);
};

// Vector addition class method
Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
    return this;
};

// Vector subtraction class method
Vector.prototype.subtract = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
};

// Vector subtraction from another vector class method
Vector.prototype.subtractFrom = function (vector) {
    this.x = vector.x - this.x;
    this.y = vector.y - this.y;
    return this;
};

// Vector multiplication class method
Vector.prototype.multiply = function (scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
};

// Vector division class method
Vector.prototype.divide = function (scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
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

// Vector dot product static method
Vector.dot = function (vector1, vector2) {
    return (vector1.x * vector2.x) + (vector1.y * vector2.y);
};

// Vector distance static method
Vector.distance = function (vector1, vector2) {
    return Vector.subtract(vector1, vector2).length;
};

// Vector distance squared static method
Vector.distanceSquared = function (vector1, vector2) {
    return Vector.subtract(vector1, vector2).lengthSquared;
};

// Export vector class
module.exports = Vector;
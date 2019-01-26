'use strict';

// Imports
const Vector = require('./Vector');

// Constants
const FRICTION = 0.01;

// Initialise physics object
const physics = {};

// Check if two balls overlap
physics.doBallsOverlap = function (ball1, ball2) {
    return Vector.distanceSquared(ball1.position, ball2.position) <= (ball1.radius + ball2.radius) ** 2;
};

// Resolve the motion of a ball
physics.ballMotion = function (ball) {

    ball.acceleration = Vector.multiply(ball.velocity, -FRICTION);
    ball.velocity.add(ball.acceleration);
    ball.position.add(ball.velocity);

    if (ball.moving) {
        return true;
    } else {
        ball.velocity = new Vector(0, 0);
        return false;
    };

};

// Resolve the collisions between a ball and the table
physics.collideCushions = function (ball, width, height) {

    if (ball.position.x + ball.radius >= width) {

        let offset = ball.position.x + ball.radius - width;
        ball.position.x -= 0.5 * offset;

        ball.velocity.x *= -1;

        ball.velocity.multiply(1 - 10 * FRICTION);

    };

    if (ball.position.x - ball.radius <= 0) {

        let offset = ball.radius - ball.position.x;
        ball.position.x += 0.5 * offset;

        ball.velocity.x *= -1;

        ball.velocity.multiply(1 - 10 * FRICTION);

    };

    if (ball.position.y + ball.radius >= height) {

        let offset = ball.position.y + ball.radius - height;
        ball.position.y -= 0.5 * offset;

        ball.velocity.y *= -1;

        ball.velocity.multiply(1 - 10 * FRICTION);

    };

    if (ball.position.y - ball.radius <= 0) {

        let offset = ball.radius - ball.position.y;
        ball.position.y += 0.5 * offset;

        ball.velocity.y *= -1;
        
        ball.velocity.multiply(1 - 10 * FRICTION);

    };

};

// Resolve the collision between two balls
physics.collideBalls = function (ball1, ball2) {

    if (physics.doBallsOverlap(ball1, ball2)) {

        // Position

        let x1 = Vector.subtract(ball1.position, ball2.position);
        let x2 = Vector.subtract(ball2.position, ball1.position);

        let dist = x1.length;
        let overlap = dist - ball1.radius - ball2.radius;

        let x1Unit = Vector.divide(x1, dist);
        let x2Unit = Vector.divide(x2, dist);

        let x1Change = Vector.multiply(x1Unit, overlap);
        let x2Change = Vector.multiply(x2Unit, overlap);

        // Velocity

        let v1 = Vector.subtract(ball1.velocity, ball2.velocity);
        let v2 = Vector.subtract(ball2.velocity, ball1.velocity);

        let v1Dotx1 = Vector.dot(v1, x1);
        let v2Dotx2 = Vector.dot(v2, x2);

        let x1LenSquare = x1.lengthSquared;
        let x2LenSquare = x2.lengthSquared;

        let frac1 = v1Dotx1 / x1LenSquare;
        let frac2 = v2Dotx2 / x2LenSquare;

        let v1Change = Vector.multiply(x1, frac1);
        let v2Change = Vector.multiply(x2, frac2);

        // Update

        ball1.position.subtract(x1Change);
        ball2.position.subtract(x2Change);

        ball1.velocity.subtract(v1Change);
        ball2.velocity.subtract(v2Change);

        // Friction

        ball1.velocity.multiply(1 - 5 * FRICTION);
        ball2.velocity.multiply(1 - 5 * FRICTION);

    };

};

// Export physics object
module.exports = physics;

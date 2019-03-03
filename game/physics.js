'use strict';

// Imports
const Vector = require('./Vector');

// Constants
const FRICTION = 0.01;

// Initialise physics object
const physics = {};

// Check if two balls will overlap
physics.doBallsOverlap = function (ball1, ball2) {
    return Vector.distanceSquared(
        Vector.add(ball1.position, ball1.velocity),
        Vector.add(ball2.position, ball2.velocity)
    ) <= (ball1.radius + ball2.radius) ** 2;
};

// Resolve the motion of a ball
physics.ballMotion = function (ball) {

    // Update acceleration (with friction), velocity and position
    ball.acceleration = Vector.multiply(ball.velocity, -FRICTION);
    ball.velocity.add(ball.acceleration);
    ball.position.add(ball.velocity);

    // Static friction
    if (ball.velocity.length > 0.25) {
        return true;
    } else {
        ball.velocity = new Vector(0, 0);
        return false;
    }

};

// Resolve the collisions between a ball and the table
physics.collideCushions = function (ball, width, height) {

    // Check if about to collide with cushiong
    if (ball.position.x + ball.velocity.x + ball.radius >= width || ball.position.x + ball.velocity.x - ball.radius <= 0) {
        // Reverse velocity
        ball.velocity.x = -ball.velocity.x;
        // Friction
        ball.velocity.multiply(1 - 10 * FRICTION);
    }

    // Check if about to collide with cushiong
    if (ball.position.y + ball.velocity.y + ball.radius >= height || ball.position.y + ball.velocity.y - ball.radius <= 0) {
        // Reverse velocity
        ball.velocity.y = -ball.velocity.y;
        // Friction
        ball.velocity.multiply(1 - 10 * FRICTION);
    }

};

// Resolve the collision between two balls
physics.collideBalls = function (ball1, ball2) {

    /**
     * Trigonometry method
     */

    // Check if the balls are about to collide
    if (physics.doBallsOverlap(ball1, ball2)) {

        // Difference in positions and velocity
        let dist = Vector.subtract(ball2.position, ball1.position);
        let vDist = Vector.subtract(ball1.velocity, ball2.velocity);

        // Prevent accedental collisions
        if (Vector.dot(dist, vDist) >= 0) {

            // Angle between balls
            let angle = -dist.angle;

            // Rotate velocities
            let u1 = Vector.rotate(ball1.velocity, angle);
            let u2 = Vector.rotate(ball2.velocity, angle);

            // Resolve new velocities
            let v1 = new Vector(u2.x, u1.y);
            let v2 = new Vector(u1.x, u2.y);

            // Rotate velocities back to normal
            let vFinal1 = Vector.rotate(v1, -angle);
            let vFinal2 = Vector.rotate(v2, -angle);

            // Set new velocities
            ball1.velocity = vFinal1;
            ball2.velocity = vFinal2;

            // Friction
            ball1.velocity.multiply(1 - 5 * FRICTION);
            ball2.velocity.multiply(1 - 5 * FRICTION);

        }

    }

    /**
     * Vector method
     */

    // if (physics.doBallsOverlap(ball1, ball2)) {

    //     let x1 = Vector.subtract(ball1.position, ball2.position);
    //     let x2 = Vector.subtract(ball2.position, ball1.position);
    //     let v1 = Vector.subtract(ball1.velocity, ball2.velocity);
    //     let v2 = Vector.subtract(ball2.velocity, ball1.velocity);

    //     let v1Dotx1 = Vector.dot(v1, x1);
    //     let v2Dotx2 = Vector.dot(v2, x2);

    //     let x1LenSquare = x1.lengthSquared;
    //     let x2LenSquare = x2.lengthSquared;

    //     let frac1 = v1Dotx1 / x1LenSquare;
    //     let frac2 = v2Dotx2 / x2LenSquare;

    //     let v1Change = Vector.multiply(x1, frac1);
    //     let v2Change = Vector.multiply(x2, frac2);

    //     ball1.velocity.subtract(v1Change);
    //     ball2.velocity.subtract(v2Change);

    //     // Friction
    //     ball1.velocity.multiply(1 - 5 * FRICTION);
    //     ball2.velocity.multiply(1 - 5 * FRICTION);

    // }

};

// Export physics module
module.exports = physics;
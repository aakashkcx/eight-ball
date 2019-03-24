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

};

// Export physics module
module.exports = physics;
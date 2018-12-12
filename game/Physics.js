'use strict';

// Imports
const Vector = require('./Vector');

// Initialise physics object
const physics = {};

// Check if two balls overlap
physics.doBallsOverlap = function (ball1, ball2) {

    return Vector.distanceSquared(ball1.position, ball2.position) <= (ball1.radius + ball2.radius) ** 2;

};

// Resolve the collisions between a ball and the table
physics.collideCushions = function (ball, width, height) {

    if (ball.position.x + ball.radius >= width) {

        let offset = ball.position.x + ball.radius - width;
        ball.position.x -= 0.5 * offset;

        ball.velocity.x *= -1;
        ball.velocity.multiply(0.9);

    };

    if (ball.position.x - ball.radius <= 0) {

        let offset = ball.radius - ball.position.x;
        ball.position.x += 0.5 * offset;

        ball.velocity.x *= -1;
        ball.velocity.multiply(0.9);

    };

    if (ball.position.y + ball.radius >= height) {

        let offset = ball.position.y + ball.radius - height;
        ball.position.y -= 0.5 * offset;

        ball.velocity.y *= -1;
        ball.velocity.multiply(0.9);

    };

    if (ball.position.y - ball.radius <= 0) {

        let offset = ball.radius - ball.position.y;
        ball.position.y += 0.5 * offset;

        ball.velocity.y *= -1;
        ball.velocity.multiply(0.9);

    };

};

// Resolve the collision between two balls
physics.collideBalls = function (ball1, ball2) {

    if (physics.doBallsOverlap(ball1, ball2)) {

        /**
         * Method 1
         */

        let distance = Vector.distance(ball1.position, ball2.position);

        let overlap = distance - ball1.radius - ball2.radius;
        let overlapVector = Vector.subtract(ball1.position, ball2.position).divide(distance).multiply(0.5 * overlap);

        let velocityDifference1 = Vector.subtract(ball1.velocity, ball2.velocity);
        let velocityDifference2 = Vector.subtract(ball2.velocity, ball1.velocity);

        let positionDifference1 = Vector.subtract(ball1.position, ball2.position);
        let positionDifference2 = Vector.subtract(ball2.position, ball1.position);

        let dotProduct1 = Vector.dot(velocityDifference1, positionDifference1);
        let dotProduct2 = Vector.dot(velocityDifference2, positionDifference2);

        let distance1 = positionDifference1.lengthSquared;
        let distance2 = positionDifference2.lengthSquared;

        let fraction1 = dotProduct1 / distance1;
        let fraction2 = dotProduct2 / distance2;

        ball1.position.subtract(overlapVector);
        ball2.position.add(overlapVector);

        ball1.velocity.subtract(Vector.multiply(positionDifference1, fraction1));
        ball2.velocity.subtract(Vector.multiply(positionDifference2, fraction2));

        // /**
        //  * Method 2
        //  */

        // let n = Vector.subtract(ball1.position, ball2.position);
        // let distance = n.length;
        // let mtd = Vector.multiply(n, (ball1.radius + ball2.radius - distance) / distance);
        // ball1.position.add(mtd.multiply(0.5));
        // ball2.position.add(mtd.multiply(0.5));
        // let un = Vector.divide(n, distance)
        // let ut = new Vector(-un.y, un.x);
        // let v1n = Vector.dot(un, ball1.velocity);
        // let v1t = Vector.dot(ut, ball1.velocity);
        // let v2n = Vector.dot(un, ball2.velocity);
        // let v2t = Vector.dot(ut, ball2.velocity);
        // let v1nTag = v2n;
        // let v2nTag = v1n;
        // v1nTag = Vector.multiply(un, v1nTag);
        // let v1tTag = Vector.multiply(ut, v1t);
        // v2nTag = Vector.multiply(un, v2nTag);
        // let v2tTag = Vector.multiply(ut, v2t);
        // ball1.velocity = Vector.add(v1nTag, v1tTag);
        // ball2.velocity = Vector.add(v2nTag, v2tTag);

        // /**
        //  * Method 3
        //  */

        // let distance = Vector.distance(ball1.position, ball2.position);
        // let overlapDistance = 0.5 * (distance - ball1.radius - ball2.radius);
        // let overlapVector = Vector.subtract(ball1.position, ball2.position).divide(distance).multiply(overlapDistance);

        // ball1.position.subtract(overlapVector);
        // ball2.position.add(overlapVector);

        // let normal = Vector.subtract(ball2.position, ball1.position).divide(distance);
        // let tangent = new Vector(-normal.y, normal.x);

        // let dotTangent1 = Vector.dot(ball1.velocity, tangent);
        // let dotTangent2 = Vector.dot(ball2.velocity, tangent);

        // let dotNormal1 = Vector.dot(ball1.velocity, normal);
        // let dotNormal2 = Vector.dot(ball2.velocity, normal);

        // let momentum1 = dotNormal2;
        // let momentum2 = dotNormal1;

        // ball1.velocity = Vector.add(Vector.multiply(tangent, dotTangent1), Vector.multiply(normal, momentum1));
        // ball2.velocity = Vector.add(Vector.multiply(tangent, dotTangent2), Vector.multiply(normal, momentum2));

    };

};

// Export physics object
module.exports = physics;
'use strict';

// Components
const Ball = require('./Ball');
const Vector = require('./Vector');
const physics = require('./physics');
const events = require('./events');
const GameDB = require('../models/Game');
const UserDB = require('../models/User');

// Constants
const WIDTH = 1280;
const HEIGHT = 720;
const BALL_RADIUS = 20;

let num = 0;

// Game class constructor
const Game = function (player1, player2) {

    this.id = ++num;

    this.player1 = player1;
    this.player2 = player2;
    this.player1.game = this;
    this.player2.game = this;
    this.player1.inGame = true;
    this.player2.inGame = true;

    this.active = false;
    this.ended = false;

    this.turn = this.player1;
    this.foul = false;
    this.potted = false;
    this.firstHit = null;

    this.player1.score = 0;
    this.player2.score = 0;

    this.colourSelected = false;
    this.redPlayer = null;
    this.yellowPlayer = null;
    this.player1.colour = '';
    this.player2.colour = '';

    this.balls = [
        [320, 360, 'white'],
        [1030, 360, 'black'],
        [960, 360, 'red'],
        [995, 340, 'yellow'],
        [995, 380, 'red'],
        [1030, 320, 'red'],
        [1030, 400, 'yellow'],
        [1065, 300, 'yellow'],
        [1065, 340, 'red'],
        [1065, 380, 'yellow'],
        [1065, 420, 'red'],
        [1100, 280, 'yellow'],
        [1100, 320, 'red'],
        [1100, 360, 'yellow'],
        [1100, 400, 'red'],
        [1100, 440, 'yellow']
    ].map(params => new Ball(new Vector(params[0], params[1]), BALL_RADIUS, params[2]));

    this.cueBall = this.balls[0];
    this.blackBall = this.balls[1];

    this.pockets = [[0, 0], [WIDTH / 2, 0], [WIDTH, 0], [0, HEIGHT], [WIDTH / 2, HEIGHT], [WIDTH, HEIGHT]]
        .map(params => ({ position: new Vector(params[0], params[1]), radius: BALL_RADIUS , velocity: new Vector()}));

};

// Update class method
Game.prototype.update = function () {

    this.active = false;

    for (let i = 0; i < this.balls.length; i++) {

        const ball = this.balls[i];

        for (let j = i + 1; j < this.balls.length; j++) {
            const collidingBall = this.balls[j];
            physics.collideBalls(ball, collidingBall);
        }

        physics.collideCushions(ball, WIDTH, HEIGHT);

        let ballActive = physics.ballMotion(ball);
        if (ballActive) this.active = true;

        this.pockets.forEach(pocket => {
            if (physics.doBallsOverlap(ball, pocket)) events.ballPotted(this, ball);
        });

    }

    if (!this.active) {

        if (this.foul || !this.potted)
            this.turn = (this.turn == this.player1 ? this.player2 : this.player1);

        this.potted = false;
        this.foul = false;

        if (this.player1.score >= 8) this.end(this.player1);
        if (this.player2.score >= 8) this.end(this.player2);

        return true;

    }

    return false;

};

Game.prototype.end = function (winner) {

    winner.score = 8;
    let loser = (winner == this.player1 ? this.player2 : this.player1);

    GameDB.create(this.player1, this.player2, (err) => {
        if (err) console.log(err);

        UserDB.incrementWins(winner.id, (err) => {
            if (err) console.log(err);

            UserDB.incrementLosses(loser.id, (err) => {
                if (err) console.log(err);

                this.active = false;
                this.ended = true;
            
                this.player1.inGame = false;
                this.player2.inGame = false;
                delete this.player1.game;
                delete this.player2.game;
                delete this.player1.colour;
                delete this.player2.colour;

            });

        });
        
    });

};

// Shoot class method
Game.prototype.shoot = function (player, power, angle) {
    if (this.turn == player && !this.active && power <= 100) {
        this.cueBall.velocity = new Vector(power * Math.cos(angle), power * Math.sin(angle));
        this.active = true;
    }
};

// Data that is sent to the players when the game starts
Game.prototype.startData = function (player) {
    let opponent = (player == this.player1 ? this.player2 : this.player1);
    return {
        player: { id: player.id, username: player.username, score: player.score, colour: player.colour },
        opponent: { id: opponent.id, username: opponent.username, score: opponent.score, colour: opponent.colour },
        active: this.active,
        turn: (player == this.turn),
        balls: this.balls.map(ball => { return { x: ball.position.x, y: ball.position.y, colour: ball.colour }; })
    };
};

// Data that is sent to the players each game update
Game.prototype.updateData = function () {
    return {
        active: this.active,
        balls: this.balls.map(ball => { return { x: ball.position.x, y: ball.position.y, colour: ball.colour }; })
    };
};

Game.prototype.turnData = function (player) {
    let opponent = (player == this.player1 ? this.player2 : this.player1);
    return {
        player: { score: player.score, colour: player.colour },
        opponent: { score: opponent.score, colour: opponent.colour },
        turn: (player == this.turn)
    };
};

Game.prototype.endData = function (player) {
    let opponent = (player == this.player1 ? this.player2 : this.player1);
    return {
        player: { score: player.score },
        opponent: { score: opponent.score },
    };
};

// Export game class
module.exports = Game;
'use strict';

// Player class constructor
const Player = function (socket) {

    this.id = socket.session.user_id;
    this.username = socket.session.user.username;

    this.inQueue = false;
    this.inGame = false;

    this.socket = socket;
    socket.player = this;

};

// Export player class
module.exports = Player;
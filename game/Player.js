'use strict';

// Player class constructor
const Player = function (socket) {

    this.id = socket.request.session.user_id;
    this.username = socket.request.session.user.username;

    this.inQueue = false;
    this.inGame = false;
    this.playerNum = null;

    this.socket = socket;
    socket.player = this;

};

// Export player class
module.exports = Player;
'use strict';

// Player class constructor
const Player = function (socket) {

    this.socket = socket;
    socket.player = this;

    this.id = socket.request.session.user_id;
    this.username = socket.request.session.user.username;

    this.inQueue = false;
    this.inGame = false;

};

// Export Player class
module.exports = Player;
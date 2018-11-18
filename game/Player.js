'use strict';

// Player constructor
const Player = function(socket) {

    this.id = socket.session.user_id;
    this.username = socket.session.user.username;
    this.socket = socket;
    this.inQueue = false;
    this.inGame = false;
    this.game = null;

};

module.exports = Player;
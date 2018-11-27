'use strict';

const Player = function (socket) {

    this.id = socket.session.user_id;
    this.username = socket.session.user.username;
    this.socket = socket;
    this.inQueue = false;
    this.inGame = false;

    socket.player = this;

};

module.exports = Player;
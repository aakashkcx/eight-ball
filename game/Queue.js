'use strict';

const Queue = function () {
    this._queue = [];
};

Queue.prototype = {
    get length() {
        return this._queue.length;
    }
};

Queue.prototype.enqueue = function (player) {
    this._queue.push(player);
    player.inQueue = true;
};

Queue.prototype.dequeue = function () {
    let player = this._queue.shift();
    player.inQueue = false;
    return player;
};

Queue.prototype.remove = function (player) {
    this._queue.splice(this._queue.indexOf(player), 1);
    player.inQueue = false;
};

module.exports = Queue;
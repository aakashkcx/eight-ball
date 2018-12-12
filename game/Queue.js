'use strict';

// Queue class constructor
const Queue = function () {
    this._queue = [];
};

Queue.prototype = {

    // Size property
    get size() {
        return this._queue.length;
    }

};

// Enqueue class method
Queue.prototype.enqueue = function (player) {
    this._queue.push(player);
    player.inQueue = true;
};

// Dequeue class method
Queue.prototype.dequeue = function () {
    let player = this._queue.shift();
    player.inQueue = false;
    return player;
};

// Queue remove class method
Queue.prototype.remove = function (player) {
    this._queue.splice(this._queue.indexOf(player), 1);
    player.inQueue = false;
};

// Export queue class
module.exports = Queue;
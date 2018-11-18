'use strict';

const Queue = function() {
    this._queue = [];
    this.length = 0;
}

Queue.prototype.enqueue = function(player) {
    this._queue.push(player);
    this.length++;
    player.inQueue = true;
}

Queue.prototype.dequeue = function() {
    let player = this._queue.shift();
    this.length--;
    player.inQueue = false;
    return player;
}

Queue.prototype.remove = function(player) {
    this._queue.splice(this._queue.indexOf(player), 1);
    this.length--;
    player.inQueue = false;
}

module.exports = Queue;
'use strict';

// Show menu method
const showMenu = function () {
    // Show the menu element and hide the others
    $('#menu').show();
    $('#queue').hide();
    $('#game').hide();
    $('#gameEnd').hide();
};

// Show queue method
const showQueue = function () {
    // Show the queue element and hide the others
    $('#menu').hide();
    $('#queue').show();
    $('#game').hide();
    $('#gameEnd').hide();

};

// Show game method
const showGame = function () {
    // Show the game element and hide the others
    $('#menu').hide();
    $('#queue').hide();
    $('#game').show();
    $('#gameEnd').hide();
};

// Show game end method
const showGameEnd = function() {
    // Show the game end element and hide the others
    $('#menu').hide();
    $('#queue').hide();
    $('#game').hide();
    $('#gameEnd').show();
};

// By default, show the menu
showMenu();
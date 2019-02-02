const showMenu = function () {
    $('#menu').show();
    $('#queue').hide();
    $('#game').hide();
    $('#gameEnd').hide();
};

const showQueue = function () {
    $('#menu').hide();
    $('#queue').show();
    $('#game').hide();
    $('#gameEnd').hide();

};

const showGame = function () {
    $('#menu').hide();
    $('#queue').hide();
    $('#game').show();
    $('#gameEnd').hide();
};

const showGameEnd = function() {
    $('#menu').hide();
    $('#queue').hide();
    $('#game').hide();
    $('#gameEnd').show();
};

showMenu();
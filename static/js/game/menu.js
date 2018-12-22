const showMenu = function () {
    $('#menu').show();
    $('#queue').hide();
    $('#game').hide();
};

const showQueue = function () {
    $('#menu').hide();
    $('#queue').show();
    $('#game').hide();
};

const showGame = function () {
    $('#menu').hide();
    $('#queue').hide();
    $('#game').show();
};

showMenu();
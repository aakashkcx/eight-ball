const socket = io();

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

$('#btn-join-queue').click(() => {
    showQueue();
});

$('#btn-leave-queue').click(() => {
    showMenu();
});
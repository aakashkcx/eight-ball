'use strict';

const socket = io();

const showMenu = () => {
    $('#menu').show();
    $('#queue').hide();
    $('#game').hide();
};

const showQueue = () => {
    $('#menu').hide();
    $('#queue').show();
    $('#game').hide();
};

const showGame = () => {
    $('#menu').hide();
    $('#queue').hide();
    $('#game').show();
};

showMenu();

$('#btn-join-queue').click(() => showQueue());

$('#btn-leave-queue').click(() => showMenu());
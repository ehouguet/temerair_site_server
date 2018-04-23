'use strict';

// dependence
var http = require('http');
var express = require('express');
var PlayerInteractionControlleur = require('./controlleur/PlayerInteraction');

// constante
var PORT = 3010;

// create server
var server = http
  .createServer(httpRouteWithSocket)
  .listen(PORT, consoleLogWhenLunchServer(PORT));

PlayerInteractionControlleur(server);

// function
function httpRouteWithSocket(req, res) {
  res.send('connect with socket.io to this port!');
}
function consoleLogWhenLunchServer(port) {
  return function() {
    console.log("server lancer a l'URL : http://localhost:"+port);
  }
}
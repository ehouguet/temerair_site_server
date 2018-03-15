'use strict';

// dependence
var io      = require('socket.io');
var http = require('http');
var express = require('express');
var path    = require('path');
var fs      = require('fs');
var PartieControlleur = require('./controlleur/partie');

// constante
var PORT1 = 3000;
var PORT2 = 3010;
var PORT3 = 3020;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////// serveur static ////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var app = express();

// redirige toute les url vers public
app.use(express.static(path.resolve(__dirname, './public')));
// redirige l'url par default vers index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

//lancement du serveur
var server = app.listen(PORT1, consoleLogWhenLunchServer(PORT1));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// serveur partie multi /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function() {
  var serverForMultiGame = http.createServer(httpRouteWithSocket).listen(PORT2, consoleLogWhenLunchServer(PORT2));
  var sio = io(serverForMultiGame);

  // joueur
  var joueurSeul = null;

  /////////////// echange avec les clients ///////////////
  sio.on('connection', function(socket) {
    console.log('connection client.');

    //si il y a 2 partie
    if (joueurSeul) {
      console.log("lancement d'une partie.");
      // initialise une nouvelle partie
      var plateauController = PartieControlleur(joueurSeul, socket);
    } else {
      joueurSeul = socket;
    }

  });
})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// serveur partie local /////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function() {
  var serverForLocalGame = http.createServer(httpRouteWithSocket).listen(PORT3, consoleLogWhenLunchServer(PORT3));
  var sio = io(serverForLocalGame);

  /////////////// echange avec les clients ///////////////
  sio.on('connection', function(socket) {
    console.log('connection client.');

    console.log("lancement d'une partie local.");
    var plateauController = PartieControlleur(socket);

  });
})();



function httpRouteWithSocket(req, res) {
  res.send('connect with socket.io to this port!');
}
function consoleLogWhenLunchServer(port) {
  return function() {
    console.log("server lancer a l'URL : http://localhost:"+port);
  }
}
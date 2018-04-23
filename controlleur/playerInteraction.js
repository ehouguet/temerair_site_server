'use strict';

const io = require('socket.io');

const PartieControlleur = require('./partie');
const PlayerControlleur = require('./player');

// export
module.exports = PlayerInteractionControlleur;

function PlayerInteractionControlleur(server) {
    
  let playerAlone = null;
  
  const sio = io(server);
  const players = [];

  sio.on('connection', function(socket) {
    let newPlayer = PlayerControlleur(socket);
    console.log('PlayerInteraction -> connection client ('+newPlayer.id+').');
    players.push(newPlayer);
    listenner(newPlayer);
    emitPlayer();
    disconnect(newPlayer);
  })
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////// listenner ///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function listenner(player) {
    player.on('player:changeName', function(name) {
      if (!player.name) {
        players.push(player);
      }
      player.name = name;
      emitPlayer();
    });
    player.on('player:playLocal', function() {
      addPlayerForLocalGame(player);
    });
    player.on('player:playMulti', function() {
      addPlayerForMultiGame(player);
    });
  }

  function emitPlayer() {
    players.forEach((player) => {
      player.emit('players:update', players.map((player) => player.name || player.id));
    })
  }

  function disconnect(oldPlayer) {
    oldPlayer.on('disconnect', function() {
      console.log('PlayerInteraction -> deconnection client ('+oldPlayer.id+').');
      players.filter((player) => player.id != oldPlayer.id);
      emitPlayer();
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////// partie multi /////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function addPlayerForMultiGame(player) {
    console.log('PlayerInteraction -> '+player.id+' attend un autres joueur.');
    //si il y a 2 partie
    if (playerAlone) {
      console.log("PlayerInteraction -> lancement d'une partie multi.");
      // initialise une nouvelle partie
      let plateauController = PartieControlleur(playerAlone, player);
    } else {
      playerAlone = player;
    }
  };
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////// partie local /////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function addPlayerForLocalGame(player) {
    console.log("PlayerInteraction -> lancement d'une partie local.");
    let plateauController = PartieControlleur(player);
  };
   
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////// function ///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
'use strict';

const io = require('socket.io');

const PartieControlleur = require('./partie');
const PlayerControlleur = require('./player');

// export
module.exports = PlayerInteractionControlleur;

function PlayerInteractionControlleur(server) {
    
  let playerAlone = null;
  
  const sio = io(server);
  let players = [];

  sio.on('connection', function(socket) {
    let newPlayer = PlayerControlleur(socket);
    newPlayer.state = PlayerControlleur.available;
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
      console.log(`PlayerInteraction -> player${player.id} change he name for ${name}.`);
      player.name = name;
      emitPlayer();
    });
    player.on('player:playLocal', function() {
      addPlayerForLocalGame(player);
    });
    player.on('player:playMulti', function() {
      addPlayerForMultiGame(player);
    });
    player.on('players:request', (playerRequested) => requestMatch(player, playerRequested));
    
  }

  function emitPlayer() {
    let playerJson = players.map((player) => {
      return {
        name: player.name,
        id: player.id,
        state: player.state,
      };
    })
    players.forEach((player) => {
      player.emit('players:update', playerJson);
    })
  }

  function disconnect(oldPlayer) {
    oldPlayer.on('disconnect', function() {
      if (oldPlayer.partie) {
        let playersRemain = oldPlayer.partie.playerLeave(oldPlayer);
        playersRemain.forEach((playerRemain) => {
          playerRemain.state = PlayerControlleur.available;
          playerRemain.plateau = null;
        });
      }
      console.log('PlayerInteraction -> deconnection client ('+oldPlayer.id+').');
      players = players.filter((player) => player.id != oldPlayer.id);
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
      madeAMultiGame(playerAlone, player);
      playerAlone = null;
    } else {
      playerAlone = player;
      player.state = PlayerControlleur.waiting;
      emitPlayer();
    }
  };
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////// partie local /////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function addPlayerForLocalGame(player) {
    console.log("PlayerInteraction -> lancement d'une partie local.");
    let partieController = PartieControlleur(player);
    player.state = PlayerControlleur.playing;
    player.partie = partieController;
    emitPlayer();
  };
   
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////// request a match ////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function requestMatch(playerCaller, playerId) {
    console.log(`PlayerInteraction -> player${playerCaller.id} want a match with player${playerId}.`);
    let playerFound = players.find((player) => player.id === playerId);
    if (!playerFound) return;

    playerFound.emit('player:requestMatch');
    playerCaller.state = PlayerControlleur.waiting;
    playerFound.state = PlayerControlleur.waiting;
    emitPlayer();
    playerFound.on('player:requestMatchAccept', () => {
      console.log(`PlayerInteraction -> player${playerId} accepte the request of player${playerCaller.id}.`);
      madeAMultiGame(playerCaller, playerFound);
      unsubscribeRequestResponse()
    })
    playerFound.on('player:requestMatchReject', () => {
      console.log(`PlayerInteraction -> player${playerId} reject the request of player${playerCaller.id}.`);
      playerCaller.state = PlayerControlleur.available;
      playerFound.state = PlayerControlleur.available;
      emitPlayer();
      unsubscribeRequestResponse()
    })

    function unsubscribeRequestResponse() {
      playerFound.leave('player:requestMatchAccept');
      playerFound.leave('player:requestMatchReject');
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////// function ///////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function madeAMultiGame(player1, player2) {
    let partieController = PartieControlleur(player1, player2);
    player1.state = PlayerControlleur.playing;
    player1.plateau = partieController;
    player2.state = PlayerControlleur.playing;
    player2.partie = partieController;
    emitPlayer();
  }
}
'use strict';

var PlateauControlleur = require('./plateau');

// export
module.exports = PartieControlleur;

function PartieControlleur(j1Player, J2Player) {

  console.log('Partie -> cree une partie.');

  let players = [j1Player];

  if (J2Player) {
    players.push(J2Player);
    var plateauController = PlateauControlleur(players);
    emit('partie:start');
    init_io_for_player(j1Player, true);
    init_io_for_player(J2Player, false);
  } else {
    var plateauController = PlateauControlleur(players);
    j1Player.emit('partie:start');
    init_io_for_player(j1Player, true);
  }


//////////////////////////////// methode ////////////////////////////////

  function init_io_for_player(player, isJ1) {

    console.log('Partie -> initialise un joueur.');

    player.emit('plateau:reset', plateauController.get_data());
    player.on('plateau:action', function(cell_ori_recu, cell_dest_recu) {
      console.log('---------------- nouvelle demande d action ----------------');
      if (isNotMyTurn(player, isJ1)) return;
      console.log('ordre client: action plateau.');
      console.log('cell_ori_recu :');
      console.log(cell_ori_recu);
      console.log('cell_dest_recu :');
      console.log(cell_dest_recu);
      plateauController.traitement_dependent_des_piece(cell_ori_recu, cell_dest_recu);
    });
    player.on('plateau:fin_tour', function() {
      if (isNotMyTurn(player, isJ1)) return;
      console.log('ordre client: fin tour.');
      plateauController.fin_tour();
    });
    player.on('plateau:recrutement', function(piece_recu, cell_dest_recu) {
      console.log('---------------- nouvelle demande d action ----------------');
      if (isNotMyTurn(player, isJ1)) return;
      console.log('ordre client: action recrutement.');
      console.log('piece_recu :');
      console.log(piece_recu);
      console.log('cell_dest_recu :');
      console.log(cell_dest_recu);
      plateauController.recrutement(piece_recu, cell_dest_recu)
    });
  }
  function isNotMyTurn(player, isJ1) {
    if (!J2Player) return false;
    if (plateauController.get_data().isTurnOfP1 === isJ1) {
      return false;
    }
    console.log("ce n'est pas mon tour !");
    return true;
  }

  function emit(label, data) {
    j1Player.emit(label, data);
    J2Player.emit(label, data);
  }
  function on(label, fun) {
    j1Player.on(label, fun);
    J2Player.on(label, fun);
  }

  return {
    playerLeave: playerLeave,
  };

  function playerLeave(playerGotOut) {
    return players.filter((player) => {
      if (playerGotOut.id != player) {
        player.emit('partie:exit', playerGotOut.id);
        return true;
      }
      return false;
    })
  }
}
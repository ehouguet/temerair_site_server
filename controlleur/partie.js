'use strict';

var PlateauControlleur = require('./plateau');

// export
module.exports = PartieControlleur;

function PartieControlleur(j1Socket, J2Socket) {

  console.log('Partie -> cree une partie.');

  if (J2Socket) {
    var plateauController = PlateauControlleur([j1Socket, J2Socket]);
    emit('partie:start');
    init_io_for_joueur(j1Socket, true);
    init_io_for_joueur(J2Socket, false);
  } else {
    var plateauController = PlateauControlleur([j1Socket]);
    j1Socket.emit('partie:start');
    init_io_for_joueur(j1Socket, true);
  }


//////////////////////////////// methode ////////////////////////////////

  function init_io_for_joueur(joueurSocket, isJ1) {

    console.log('Partie -> initialise un joueur.');

    joueurSocket.emit('plateau:reset', plateauController.get_data());
    joueurSocket.on('plateau:action', function(cell_ori_recu, cell_dest_recu) {
      console.log('---------------- nouvelle demande d action ----------------');
      if (isNotMyTurn(joueurSocket, isJ1)) return;
      console.log('ordre client: action plateau.');
      console.log('cell_ori_recu :');
      console.log(cell_ori_recu);
      console.log('cell_dest_recu :');
      console.log(cell_dest_recu);
      plateauController.traitement_dependent_des_piece(cell_ori_recu, cell_dest_recu);
    });
    joueurSocket.on('plateau:fin_tour', function() {
      if (isNotMyTurn(joueurSocket, isJ1)) return;
      console.log('ordre client: fin tour.');
      plateauController.fin_tour();
    });
    joueurSocket.on('plateau:recrutement', function(piece_recu, cell_dest_recu) {
      console.log('---------------- nouvelle demande d action ----------------');
      if (isNotMyTurn(joueurSocket, isJ1)) return;
      console.log('ordre client: action recrutement.');
      console.log('piece_recu :');
      console.log(piece_recu);
      console.log('cell_dest_recu :');
      console.log(cell_dest_recu);
      plateauController.recrutement(piece_recu, cell_dest_recu)
    });
  }
  function isNotMyTurn(joueurSocket, isJ1) {
    if (!J2Socket) return false;
    if (plateauController.get_data().isTurnOfP1 === isJ1) {
      return false;
    }
    console.log("ce n'est pas mon tour !");
    return true;
  }

  function emit(label, data) {
    j1Socket.emit(label, data);
    J2Socket.emit(label, data);
  }
  function on(label, fun) {
    j1Socket.on(label, fun);
    J2Socket.on(label, fun);
  }
}
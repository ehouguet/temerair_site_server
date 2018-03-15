'use strict';
angular.module('temerair')
  .factory('SocketIoService',['io', '_', '$timeout', function (io, _, $timeout) {
    var socket = io('localhost:3020');
    var _add_init_listener     = _.noop;
    var _add_victoire_listener = _.noop;

    socket.on('connect', function(){
      console.log('connected');
    });

    socket.on('plateau:reset', function (plateau) {
      console.log("odre serveur: initialisation du plateau.");
      console.log("plateau :");
      console.log(plateau);
      $timeout(function () {
        _add_init_listener(plateau);
      });
    });
    socket.on('plateau:victoire', function (joueur) {
      console.log("odre serveur: victoire de "+joueur+".");
      console.log("joueur :");
      console.log(joueur);
      $timeout(function () {
        _add_victoire_listener(joueur);
      });
    });

    return {
      add_init_listener: function(f) {
        _add_init_listener = f;
      },
      add_victoire_listener: function(f) {
        _add_victoire_listener = f;
      },
      action_plateau: function(cell_ori, cell_dest) {
        console.log("demande client: action plateau.");
        socket.emit('plateau:action', cell_ori, cell_dest);
      },
      action_reserve: function(piece_ori, cell_dest) {
        console.log("demande client: action recrutement.");
        socket.emit('plateau:recrutement', piece_ori, cell_dest);
      },
      fin_tour: function() {
        console.log("demande client: fin tour.");
        socket.emit('plateau:fin_tour');
      },
    };
  }]);
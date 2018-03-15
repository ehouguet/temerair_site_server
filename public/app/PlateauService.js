'use strict';
angular.module('temerair')
	.factory('PlateauService',['SocketIoService', '_', function (SocketIoService, _) {

	/* donnee */
	var plateauAir = [
		[{zone:"ta",pos_y:0,pos_x:0,piece:null} , {zone:"ta",pos_y:0,pos_x:1,piece:null} , {zone:"ta",pos_y:0,pos_x:2,piece:null} , {zone:"ta",pos_y:0,pos_x:3,piece:null}],
	    [{zone:"ta",pos_y:1,pos_x:0,piece:null} , {zone:"ta",pos_y:1,pos_x:1,piece:null} , {zone:"ta",pos_y:1,pos_x:2,piece:null} , {zone:"ta",pos_y:1,pos_x:3,piece:null}],
	    [{zone:"ta",pos_y:2,pos_x:0,piece:null} , {zone:"ta",pos_y:2,pos_x:1,piece:null} , {zone:"ta",pos_y:2,pos_x:2,piece:null} , {zone:"ta",pos_y:2,pos_x:3,piece:null}],
	    [{zone:"ta",pos_y:3,pos_x:0,piece:null} , {zone:"ta",pos_y:3,pos_x:1,piece:null} , {zone:"ta",pos_y:3,pos_x:2,piece:null} , {zone:"ta",pos_y:3,pos_x:3,piece:null}],
	    [{zone:"ta",pos_y:4,pos_x:0,piece:null} , {zone:"ta",pos_y:4,pos_x:1,piece:null} , {zone:"ta",pos_y:4,pos_x:2,piece:null} , {zone:"ta",pos_y:4,pos_x:3,piece:null}],
	    [{zone:"ta",pos_y:5,pos_x:0,piece:null} , {zone:"ta",pos_y:5,pos_x:1,piece:null} , {zone:"ta",pos_y:5,pos_x:2,piece:null} , {zone:"ta",pos_y:5,pos_x:3,piece:null}],
	    [{zone:"ta",pos_y:6,pos_x:0,piece:null} , {zone:"ta",pos_y:6,pos_x:1,piece:null} , {zone:"ta",pos_y:6,pos_x:2,piece:null} , {zone:"ta",pos_y:6,pos_x:3,piece:null}],
	    [{zone:"ta",pos_y:7,pos_x:0,piece:null} , {zone:"ta",pos_y:7,pos_x:1,piece:null} , {zone:"ta",pos_y:7,pos_x:2,piece:null} , {zone:"ta",pos_y:7,pos_x:3,piece:null}]
	];
	var plateauTerre = [
	    [{zone:"tt",pos_y:0,pos_x:0,piece:null} , {zone:"tt",pos_y:0,pos_x:1,piece:null} , {zone:"tt",pos_y:0,pos_x:2,piece:null} , {zone:"tt",pos_y:0,pos_x:3,piece:null}],
	    [{zone:"tt",pos_y:1,pos_x:0,piece:null} , {zone:"tt",pos_y:1,pos_x:1,piece:null} , {zone:"tt",pos_y:1,pos_x:2,piece:null} , {zone:"tt",pos_y:1,pos_x:3,piece:null}],
	    [{zone:"tt",pos_y:2,pos_x:0,piece:null} , {zone:"tt",pos_y:2,pos_x:1,piece:null} , {zone:"tt",pos_y:2,pos_x:2,piece:null} , {zone:"tt",pos_y:2,pos_x:3,piece:null}],
	    [{zone:"tt",pos_y:3,pos_x:0,piece:null} , {zone:"tt",pos_y:3,pos_x:1,piece:null} , {zone:"tt",pos_y:3,pos_x:2,piece:null} , {zone:"tt",pos_y:3,pos_x:3,piece:null}],
	    [{zone:"tt",pos_y:4,pos_x:0,piece:null} , {zone:"tt",pos_y:4,pos_x:1,piece:null} , {zone:"tt",pos_y:4,pos_x:2,piece:null} , {zone:"tt",pos_y:4,pos_x:3,piece:null}],
	    [{zone:"tt",pos_y:5,pos_x:0,piece:null} , {zone:"tt",pos_y:5,pos_x:1,piece:null} , {zone:"tt",pos_y:5,pos_x:2,piece:null} , {zone:"tt",pos_y:5,pos_x:3,piece:null}],
	    [{zone:"tt",pos_y:6,pos_x:0,piece:null} , {zone:"tt",pos_y:6,pos_x:1,piece:null} , {zone:"tt",pos_y:6,pos_x:2,piece:null} , {zone:"tt",pos_y:6,pos_x:3,piece:null}],
	    [{zone:"tt",pos_y:7,pos_x:0,piece:null} , {zone:"tt",pos_y:7,pos_x:1,piece:null} , {zone:"tt",pos_y:7,pos_x:2,piece:null} , {zone:"tt",pos_y:7,pos_x:3,piece:null}]
	];
	var plateauMer = [
	    [{zone:"tm",pos_y:0,pos_x:4,piece:null} , {zone:"tm",pos_y:0,pos_x:5,piece:null} , {zone:"tm",pos_y:0,pos_x:6,piece:null} , {zone:"tm",pos_y:0,pos_x:7,piece:null}],
	    [{zone:"tm",pos_y:1,pos_x:4,piece:null} , {zone:"tm",pos_y:1,pos_x:5,piece:null} , {zone:"tm",pos_y:1,pos_x:6,piece:null} , {zone:"tm",pos_y:1,pos_x:7,piece:null}],
	    [{zone:"tm",pos_y:2,pos_x:4,piece:null} , {zone:"tm",pos_y:2,pos_x:5,piece:null} , {zone:"tm",pos_y:2,pos_x:6,piece:null} , {zone:"tm",pos_y:2,pos_x:7,piece:null}],
	    [{zone:"tm",pos_y:3,pos_x:4,piece:null} , {zone:"tm",pos_y:3,pos_x:5,piece:null} , {zone:"tm",pos_y:3,pos_x:6,piece:null} , {zone:"tm",pos_y:3,pos_x:7,piece:null}],
	    [{zone:"tm",pos_y:4,pos_x:4,piece:null} , {zone:"tm",pos_y:4,pos_x:5,piece:null} , {zone:"tm",pos_y:4,pos_x:6,piece:null} , {zone:"tm",pos_y:4,pos_x:7,piece:null}],
	    [{zone:"tm",pos_y:5,pos_x:4,piece:null} , {zone:"tm",pos_y:5,pos_x:5,piece:null} , {zone:"tm",pos_y:5,pos_x:6,piece:null} , {zone:"tm",pos_y:5,pos_x:7,piece:null}],
	    [{zone:"tm",pos_y:6,pos_x:4,piece:null} , {zone:"tm",pos_y:6,pos_x:5,piece:null} , {zone:"tm",pos_y:6,pos_x:6,piece:null} , {zone:"tm",pos_y:6,pos_x:7,piece:null}],
	    [{zone:"tm",pos_y:7,pos_x:4,piece:null} , {zone:"tm",pos_y:7,pos_x:5,piece:null} , {zone:"tm",pos_y:7,pos_x:6,piece:null} , {zone:"tm",pos_y:7,pos_x:7,piece:null}]
	];

	var reserve = {
		j1 : [],
		j2 : []
	}

	var info_parti = {
		tour_j1: true,
		cell_select: null,
		select_color: {'background-color':'rgba(255,100,0,0.3)'}
	};

	/* echange serveur */
	SocketIoService.add_init_listener( function(plateau) {
		for (var i = plateau.plateauAir.length - 1; i >= 0; i--) {
			plateauAir[i] = plateau.plateauAir[i];
			plateauTerre[i] = plateau.plateauTerre[i];
			plateauMer[i] = plateau.plateauMer[i];
		};
		reserve.j1 = []
		for (var i = plateau.recrutement.j1.a_poser.length - 1; i >= 0; i--) {
			reserve.j1[i] = plateau.recrutement.j1.a_poser[i];
		};
		reserve.j2 = []
		for (var i = plateau.recrutement.j2.a_poser.length - 1; i >= 0; i--) {
			reserve.j2[i] = plateau.recrutement.j2.a_poser[i];
		};
		info_parti.tour_j1 = plateau.tour_j1;
		info_parti.cell_select = null;
	});

	SocketIoService.add_victoire_listener( function(joueur) {
		alert('joueur '+joueur+' gagne.');
	});

	/* return le service */
	return {
		plateauAir: plateauAir,
		plateauTerre: plateauTerre,
		plateauMer: plateauMer,
		reserve: reserve,
		info_parti: info_parti,
		action: function (cell_ori, cell_dest) {
			SocketIoService.action_plateau(cell_ori, cell_dest)
		},
		reserve_action: function (piece_ori, cell_dest) {
			SocketIoService.action_reserve(piece_ori, cell_dest)
		},
		fin_tour: function () {
			SocketIoService.fin_tour()
		}
	};

	/* fonction du service */
	function get_cell_local(cell_recu) {
		switch (cell_recu.zone) {
			case "ta": return plateauAir[cell_recu.pos_y][cell_recu.pos_x];
			case "tt": return plateauTerre[cell_recu.pos_y][cell_recu.pos_x];
			case "tm": return plateauMer[cell_recu.pos_y][cell_recu.pos_x-4];
		}
	};

}]);

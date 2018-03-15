'use strict';
angular.module('temerair')
	.controller('PlateauCtrl', ['PlateauService', function (PlateauService) {
	this.plateauTerre = PlateauService.plateauTerre;
	this.plateauMer   = PlateauService.plateauMer;
	this.plateauAir   = PlateauService.plateauAir;

	this.reserve = PlateauService.reserve;

 	this.info_parti = PlateauService.info_parti;

 	/* fonction */
 	this.action = function (cell) {
		console.log("-------------------- nouvelle action --------------------------");
 		if (cell.piece != null) {
 			if (   (( this.info_parti.tour_j1) && (cell.piece.joueur == "j1"))
 				|| ((!this.info_parti.tour_j1) && (cell.piece.joueur == "j2"))) {
	 			console.log("select une nouvelle cellule");
	 			this.info_parti.cell_select = cell;
	 			return;
	 		}
 		}
 		if (this.info_parti.cell_select) {
			console.log("action sur le pion");
			console.log("cell d'origine :");
			console.log(this.info_parti.cell_select);
			console.log("cell de destination :");
			console.log(cell);
			PlateauService.action(this.info_parti.cell_select, cell);
		}
 		
 	}
 	this.reserve_action = function (piece) {
 		console.log("action sur reserve");
		if (   (( this.info_parti.tour_j1) && (piece.joueur == "j1"))
				|| ((!this.info_parti.tour_j1) && (piece.joueur == "j2"))) {
 			this.info_parti.cell_select = piece;
 		}
 	}
 	this.isSelect = function (cell) {
		return cell == this.info_parti.cell_select;
 	}
 	this.switch_joueur = function () {
 		console.log("changement de joueur");
 		PlateauService.fin_tour();
 	}
}]);

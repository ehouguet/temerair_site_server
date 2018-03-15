'use strict';

// export
module.exports = PlateauControlleur;

function PlateauControlleur(sockets) {

  console.log('PartieControlleur -> cree un plateau.');

  var instance = {}

  //composant de l'object
  instance.get_data = fun_get_data;
  instance.fin_tour = fun_fin_tour;
  instance.traitement_dependent_des_piece = fun_traitement_dependent_des_piece;
  instance.recrutement = fun_recrutement;

  //variable
  //contien les donnees
  var data = get_data_default();

  return instance;

////////////////////////////////////// methode //////////////////////////////////////
  function emit(label, data) {
    sockets.forEach(function(socket) {
      socket.emit(label, data);
    })
  }

  // focntion de l'object
  function fun_get_data() {
    return data;
  }

  function fun_fin_tour() {
    //condition de victoire
    console.log('get_info_joueur().zone_gagner : ');
    console.log(get_info_joueur().zone_gagner);
    console.log('cond de victoire : ');
    console.log(get_info_joueur().zone_gagner.length >= 2);
    if (get_info_joueur().zone_gagner.length >= 2) {
      if (data.tour_j1) {
        console.log('demande serveur: victoire j1.');
        emit('plateau:victoire', 'j1');
      } else {
        console.log('demande serveur: victoire j2.');
        emit('plateau:victoire', 'j2');
      }
      data = get_data_default();
    } else {
      data.tour_j1 = !data.tour_j1;
    }

    console.log('demande serveur: init.');
    emit('plateau:reset', data);

  }

  function fun_recrutement(piece_recu, cell_dest_recu) {
    var cell_dest = get_cell_local(cell_dest_recu);
    var reserve = get_info_joueur().a_poser;

    // control sur la possession de la piece.
    var i = reserve.length - 1;
    var bool = true;
    while ((i >= 0) && (bool)) {
      if (reserve[i].type == piece_recu.type) {
        reserve.splice(i, 1);
        bool = false
      }
      i--;
    }
    if (bool) {
      console.log('parachute d une piece non en reserve');
      return;
    }

    // controle pour l'eplacement de parachutage
    if (cell_dest.piece != null) {
      console.log('parachute une piece sur une autre');
      return;
    }

    cell_dest_recu.pos_y = cell_dest.pos_y+1;
    cell_dest_recu.pos_x = cell_dest.pos_x;
    var cell_tmp = get_cell_local(cell_dest_recu);
    if (cell_tmp != null) {
      if (cell_tmp.piece != null) {
        if (cell_tmp.piece.type == "QG" && cell_tmp.piece.joueur == piece_recu.joueur) {
          cell_dest.piece = piece_recu;
          fun_fin_tour();
        }
      }
    }
    cell_dest_recu.pos_y = cell_dest.pos_y;
    cell_dest_recu.pos_x = cell_dest.pos_x+1;
    var cell_tmp = get_cell_local(cell_dest_recu);
    if (cell_tmp != null) {
      if (cell_tmp.piece != null) {
        if (cell_tmp.piece.type == "QG" && cell_tmp.piece.joueur == piece_recu.joueur) {
          cell_dest.piece = piece_recu;
          fun_fin_tour();
        }
      }
    }
    cell_dest_recu.pos_y = cell_dest.pos_y-1;
    cell_dest_recu.pos_x = cell_dest.pos_x;
    var cell_tmp = get_cell_local(cell_dest_recu);
    if (cell_tmp != null) {
      if (cell_tmp.piece != null) {
        if (cell_tmp.piece.type == "QG" && cell_tmp.piece.joueur == piece_recu.joueur) {
          cell_dest.piece = piece_recu;
          fun_fin_tour();
        }
      }
    }
    cell_dest_recu.pos_y = cell_dest.pos_y;
    cell_dest_recu.pos_x = cell_dest.pos_x-1;
    var cell_tmp = get_cell_local(cell_dest_recu);
    if (cell_tmp != null) {
      if (cell_tmp.piece != null) {
        if (cell_tmp.piece.type == "QG" && cell_tmp.piece.joueur == piece_recu.joueur) {
          cell_dest.piece = piece_recu;
          fun_fin_tour();
        }
      }
    }
  }

  function fun_traitement_dependent_des_piece(cell_ori_recu, cell_dest_recu) {
    //le cas de recrutement (cell_ori est une piece)
    if (fun_is_piece(cell_ori_recu)) {
      fun_recrutement(cell_ori_recu, cell_dest_recu);
      return;
    }

    var cell_ori  = get_cell_local(cell_ori_recu);
    var cell_dest = get_cell_local(cell_dest_recu);

    console.log("server.js => FTDDP: cell_ori:");
    console.log(cell_ori);
    console.log("server.js => FTDDP: cell_dest:");
    console.log(cell_dest);

    /* cas de piece de meme joueur */
    if (cell_dest.piece != null) {
      if (cell_ori.piece.joueur == cell_dest.piece.joueur){
        console.log("server.js => FTDDP: piece du meme joueur");
        return;
      }
    }

    switch (cell_ori.piece.type) {
      case "A_A":
        fun_action_A_A(cell_ori, cell_dest);
        break;
      case "QG":
        fun_action_QG(cell_ori, cell_dest);
        break;
      case "pion":
        fun_action_pion(cell_ori, cell_dest);
        break;
      case "A_B":
        fun_action_A_B(cell_ori, cell_dest);
        break;
      case "dist":
        fun_action_dist(cell_ori, cell_dest);
        break;
      default:
        console.log("server.js => FTDDP: type de piece non definie : "+cell_ori.piece.type);
        break;
    }

    return;
  }

  function fun_action_A_A(cell_ori, cell_dest) {
    console.log("server.js => fun_action_A_A: deplacement de A_A");
    /* click sur une case de type differant */
    if (cell_ori.zone != cell_dest.zone) {
      console.log("server.js => fun_action_A_A: echec: zone differente");
      return;
    }

    if (  (cell_ori.pos_y == cell_dest.pos_y)
      || (cell_ori.pos_x == cell_dest.pos_x)){
      if (fun_presence_obstacle(cell_dest, cell_ori)) {
      console.log("server.js => fun_action_A_A: reussi");
        fun_mange(cell_dest);
        fun_deplacement(cell_ori, cell_dest);
        fun_fin_tour();
      }
    }
  }
  function fun_action_QG(cell_ori, cell_dest) {
    console.log("server.js => fun_action_QG: deplacement QG");
    if (cell_ori.zone != cell_dest.zone) {
      console.log("server.js => fun_action_QG: echec: zone differente");
      return ;
    }
    if (   ((cell_ori.pos_y+1 == cell_dest.pos_y) && (cell_ori.pos_x+1 == cell_dest.pos_x))
      || ((cell_ori.pos_y+1 == cell_dest.pos_y) && (cell_ori.pos_x-1 == cell_dest.pos_x))
      || ((cell_ori.pos_y-1 == cell_dest.pos_y) && (cell_ori.pos_x+1 == cell_dest.pos_x))
      || ((cell_ori.pos_y-1 == cell_dest.pos_y) && (cell_ori.pos_x-1 == cell_dest.pos_x))
      ){
      console.log("server.js => fun_action_QG: reussi");
      fun_mange(cell_dest);
      fun_deplacement(cell_ori, cell_dest);
      fun_fin_tour();
    }
  }
  function fun_action_pion(cell_ori, cell_dest) {
    console.log("server.js => fun_action_pion: deplacement piont");
    if (cell_ori.zone != cell_dest.zone) {
      console.log("server.js => fun_action_pion: echec: zone differente");
      return false;
    }
    /* pion j1 */
    if (cell_ori.piece.joueur == "j1") {
      if (   ((cell_ori.pos_x == cell_dest.pos_x-1) && (cell_ori.pos_y+1 == cell_dest.pos_y))
          || ((cell_ori.pos_x == cell_dest.pos_x  ) && (cell_ori.pos_y+1 == cell_dest.pos_y))
          || ((cell_ori.pos_x == cell_dest.pos_x+1) && (cell_ori.pos_y+1 == cell_dest.pos_y))
        ){
        console.log("server.js => fun_action_pion: reussi");
        fun_mange(cell_dest);
        fun_deplacement(cell_ori, cell_dest);
        fun_fin_tour();
      } else {
        console.log("server.js => fun_action_pion: echec: case inatagnable");
      }
    } else {
      if (   ((cell_ori.pos_x == cell_dest.pos_x-1) && (cell_ori.pos_y-1 == cell_dest.pos_y))
          || ((cell_ori.pos_x == cell_dest.pos_x  ) && (cell_ori.pos_y-1 == cell_dest.pos_y))
          || ((cell_ori.pos_x == cell_dest.pos_x+1) && (cell_ori.pos_y-1 == cell_dest.pos_y))
        ){
        console.log("server.js => fun_action_pion: reussi");
        fun_mange(cell_dest);
        fun_deplacement(cell_ori, cell_dest);
        fun_fin_tour();
      } else {
        console.log("server.js => fun_action_pion: echec: case inatagnable");
      }
    }
  }
  function fun_action_A_B(cell_ori, cell_dest){
    console.log("server.js => fun_action_A_B: deplacement A_B");
    var cell_A;
    var cell_B;

    /* click sur une case de meme zone */
    if (cell_ori.zone == cell_dest.zone) {
      cell_A = cell_dest;
      cell_B = fun_conv_cell_air_sol(cell_dest);
    } else {
      cell_A = fun_conv_cell_air_sol(cell_dest);
      if (cell_A == null) {
        console.log("server.js => fun_action_A_B: echec: pas de case de destination pour se deplacer");
        return;
      }
      cell_B = cell_dest;
    }

    console.log("server.js => fun_action_A_B: cell_A:");
    console.log(cell_A);
    console.log("server.js => fun_action_A_B: cell_B:");
    console.log(cell_B);

    /* control zone de terrain */
    if (cell_A.zone != cell_ori.zone) {
      console.log("server.js => fun_action_A_B: echec: zone differant");
      return;
    }

    /* control du mange au meme etage */
    if (fun_have_allier(cell_A)) {
      console.log("server.js => fun_action_A_B: echec: deplacer sur un allier");
      return;
    }

    if ((Math.abs(cell_A.pos_y - cell_ori.pos_y)) == (Math.abs(cell_A.pos_x - cell_ori.pos_x))){
      if (fun_presence_obstacle(cell_ori, cell_A)) {
        console.log("server.js => fun_action_A_B: reussi");
        fun_mange(cell_A);
        fun_deplacement(cell_ori, cell_A);
        if (cell_B != null) {
          if (!fun_have_allier(cell_B)) {
            fun_mange(cell_B);
          }
        }
        fun_fin_tour();
      }
    }
  }
  function fun_action_dist(cell_ori, cell_dest){
    console.log("server.js => fun_action_dist: action dist");
    if (cell_dest.piece == null) {
      if ((cell_ori.zone != cell_dest.zone)) {
        console.log("server.js => fun_action_dist: echec: deplacement en zone differente");
        return false;
      }
      if ( ((cell_ori.pos_y+1 == cell_dest.pos_y) && (cell_ori.pos_x   == cell_dest.pos_x))
        || ((cell_ori.pos_y   == cell_dest.pos_y) && (cell_ori.pos_x+1 == cell_dest.pos_x))
        || ((cell_ori.pos_y-1 == cell_dest.pos_y) && (cell_ori.pos_x   == cell_dest.pos_x))
        || ((cell_ori.pos_y   == cell_dest.pos_y) && (cell_ori.pos_x-1 == cell_dest.pos_x))
        ) {
        console.log("server.js => fun_action_dist: reussi: deplacement");
        fun_deplacement(cell_ori, cell_dest);
        fun_fin_tour();
      }
    } else {
      if (!(
           (cell_ori.zone == cell_dest.zone)
        || ((cell_ori.zone == "tm") && (cell_dest.zone == "tt"))
        || ((cell_ori.zone == "tt") && (cell_dest.zone == "tm"))
        )) {
        console.log("server.js => fun_action_dist: echec: tire sur une zone inategnable");
        return false;
      }
      if (cell_ori.pos_y == cell_dest.pos_y) {
        console.log("server.js => fun_action_dist: echec: tire sur une case inategnable");
        return;
      }
      if (cell_ori.pos_x == cell_dest.pos_x) {
        console.log("server.js => fun_action_dist: echec: tire sur une case inategnable");
        return;
      }
      if (((Math.abs(cell_ori.pos_y - cell_dest.pos_y)) + (Math.abs(cell_ori.pos_x - cell_dest.pos_x)) == 3)) {
        console.log("server.js => fun_action_dist: reussi: tir");
        fun_mange(cell_dest);
        fun_fin_tour();
      }
    }
  }

  function fun_deplacement(cell_ori, cell_dest) {
    console.log('-- movement de piece --');
    console.log('cell_ori :');
    console.log(cell_ori);
    console.log('cell_dest :');
    console.log(cell_dest);
    cell_dest.piece = cell_ori.piece;
    cell_ori.piece = null;
  }
  function fun_mange(cell) {
    console.log('-- mange piece --');
    /* si la piece manger est le QJ enemi */
    if (cell.piece != null) {
      if (cell.piece.type == "QG") {
        /* victoire sur une zone */
        cell.piece = null;
        fun_victoire_sur_plateau(cell.zone);
      }
    }
    cell.piece = null;
  }
  function fun_victoire_sur_plateau(zone) {
    get_info_joueur().zone_gagner.push(zone);

    // recupere la zone en paix
    var plateauZone;
    switch (zone) {
      case "ta":
        plateauZone = data.plateauAir;
        break;
      case "tt":
        plateauZone = data.plateauTerre;
        break;
      case "tm":
        plateauZone = data.plateauMer;
        break;
    }

    // recupere 
    for (var i = plateauZone.length - 1; i >= 0; i--) {
      var ligne = plateauZone[i];
      for (var j = ligne.length - 1; j >= 0; j--) {
        var cell = ligne[j];
        // si il y a une uniter
        if (cell.piece != null) {
          if (fun_is_allier(cell.piece)) {
            fun_mise_en_reserve(cell);
          } else {
            fun_mange(cell);
          }
        }
      };
    };
  }
  function fun_mise_en_reserve(cell) {
    if (cell.piece != null) {
      if (cell.piece.type != "QG") {
        console.log('-- mise en reserve cell --');
        console.log(cell.piece);
        get_info_joueur().a_poser.push(cell.piece);
      }
    }
    cell.piece = null;
  }

  /* fonction de recuperation de la cellule local */
  function get_cell_local(cell_recu) {
    var res;
    switch (cell_recu.zone) {
      case "ta":
        res = data.plateauAir[cell_recu.pos_y][cell_recu.pos_x];
        break;
      case "tt":
        res = data.plateauTerre[cell_recu.pos_y][cell_recu.pos_x];
        break;
      case "tm":
        res = data.plateauMer[cell_recu.pos_y][cell_recu.pos_x-4];
        break;
    }
    if (res == undefined) {
      res = null;
    }
    return res;
  }

  /* equivalent air - sol */
  function fun_conv_cell_air_sol(cell) {
    var res_cell = {};
    res_cell.pos_y = cell.pos_y;

    if (cell.zone == "tt") {
      if (cell.pos_x > 1) {
        return null;
      }
      res_cell.zone = "ta";
      res_cell.pos_x = parseInt(cell.pos_x)+2;
    }
    if (cell.zone == "tm") {
      if (cell.pos_x < 6) {
        return null;
      }
      res_cell.zone = "ta";
      res_cell.pos_x = parseInt(cell.pos_x)-6;
    }
    if (cell.zone == "ta") {
      if (cell.pos_x < 2) {
        res_cell.zone = "tm";
        res_cell.pos_x = parseInt(cell.pos_x)+6;
      } else {
        res_cell.zone = "tt";
        res_cell.pos_x = parseInt(cell.pos_x)-2;
      }
    }
    return get_cell_local(res_cell);
  }

  /* detection d'obstacle */
  function fun_presence_obstacle(cell_ori, cell_dest) {
    /* initialisation */
    var tmp_cell = {};
    tmp_cell.zone = cell_ori.zone;
    tmp_cell.pos_y = cell_ori.pos_y;
    tmp_cell.pos_x = cell_ori.pos_x;

    /* recup variation */
    var variation = {};
    if (cell_ori.pos_x != cell_dest.pos_x) {
      if (cell_ori.pos_x < cell_dest.pos_x) {
        variation.var_y = 1;
      } else {
        variation.var_y = -1;
      }
    } else {
      variation.var_y = 0;
    }
    if (cell_ori.pos_y != cell_dest.pos_y) {
      if (cell_ori.pos_y < cell_dest.pos_y) {
        variation.var_x = 1;
      } else {
        variation.var_x = -1;
      }
    } else {
      variation.var_x = 0;
    }
    console.log("variation :");
    console.log(variation);

    /* cherche obstacle */
    tmp_cell.pos_y += variation.var_x;
    tmp_cell.pos_x += variation.var_y;
    while (   (tmp_cell.pos_y != cell_dest.pos_y)
         || (tmp_cell.pos_x != cell_dest.pos_x)) {
      if (get_cell_local(tmp_cell).piece != null) {
        return false;
      }

      tmp_cell.pos_y += variation.var_x;
      tmp_cell.pos_x += variation.var_y;
    }
    return true
  }

  function fun_is_allier(piece) {
    return (   ((data.tour_j1) && (piece.joueur == "j1"))
        || ((!data.tour_j1) && (piece.joueur == "j2")));
  }

  function fun_have_allier(cell) {
    if (cell.piece == null) {
      return false;
    }
    return fun_is_allier(cell.piece);
  }

  function get_data_default() {
    return {
      plateauAir: [
        [{zone:"ta",pos_y:0,pos_x:0,piece:{joueur:"j1", type:"A_B"}}  , {zone:"ta",pos_y:0,pos_x:1,piece:{joueur:"j1", type:"QG"}}   , {zone:"ta",pos_y:0,pos_x:2,piece:{joueur:"j1", type:"dist"}} , {zone:"ta",pos_y:0,pos_x:3,piece:{joueur:"j1", type:"A_A"}} ],
        [{zone:"ta",pos_y:1,pos_x:0,piece:{joueur:"j1", type:"pion"}} , {zone:"ta",pos_y:1,pos_x:1,piece:{joueur:"j1", type:"pion"}} , {zone:"ta",pos_y:1,pos_x:2,piece:{joueur:"j1", type:"pion"}} , {zone:"ta",pos_y:1,pos_x:3,piece:{joueur:"j1", type:"pion"}}],
        [{zone:"ta",pos_y:2,pos_x:0,piece:null}                       , {zone:"ta",pos_y:2,pos_x:1,piece:null}                       , {zone:"ta",pos_y:2,pos_x:2,piece:null}                       , {zone:"ta",pos_y:2,pos_x:3,piece:null}                      ],
        [{zone:"ta",pos_y:3,pos_x:0,piece:null}                       , {zone:"ta",pos_y:3,pos_x:1,piece:null}                       , {zone:"ta",pos_y:3,pos_x:2,piece:null}                       , {zone:"ta",pos_y:3,pos_x:3,piece:null}                      ],
        [{zone:"ta",pos_y:4,pos_x:0,piece:null}                       , {zone:"ta",pos_y:4,pos_x:1,piece:null}                       , {zone:"ta",pos_y:4,pos_x:2,piece:null}                       , {zone:"ta",pos_y:4,pos_x:3,piece:null}                      ],
        [{zone:"ta",pos_y:5,pos_x:0,piece:null}                       , {zone:"ta",pos_y:5,pos_x:1,piece:null}                       , {zone:"ta",pos_y:5,pos_x:2,piece:null}                       , {zone:"ta",pos_y:5,pos_x:3,piece:null}                      ],
        [{zone:"ta",pos_y:6,pos_x:0,piece:{joueur:"j2", type:"pion"}} , {zone:"ta",pos_y:6,pos_x:1,piece:{joueur:"j2", type:"pion"}} , {zone:"ta",pos_y:6,pos_x:2,piece:{joueur:"j2", type:"pion"}} , {zone:"ta",pos_y:6,pos_x:3,piece:{joueur:"j2", type:"pion"}}],
        [{zone:"ta",pos_y:7,pos_x:0,piece:{joueur:"j2", type:"A_A"}}  , {zone:"ta",pos_y:7,pos_x:1,piece:{joueur:"j2", type:"dist"}} , {zone:"ta",pos_y:7,pos_x:2,piece:{joueur:"j2", type:"QG"}}   , {zone:"ta",pos_y:7,pos_x:3,piece:{joueur:"j2", type:"A_B"}} ]
      ],
      plateauTerre: [
        [{zone:"tt",pos_y:0,pos_x:0,piece:{joueur:"j1", type:"A_B"}}  , {zone:"tt",pos_y:0,pos_x:1,piece:{joueur:"j1", type:"QG"}}   , {zone:"tt",pos_y:0,pos_x:2,piece:{joueur:"j1", type:"dist"}} , {zone:"tt",pos_y:0,pos_x:3,piece:{joueur:"j1", type:"A_A"}} ],
        [{zone:"tt",pos_y:1,pos_x:0,piece:{joueur:"j1", type:"pion"}} , {zone:"tt",pos_y:1,pos_x:1,piece:{joueur:"j1", type:"pion"}} , {zone:"tt",pos_y:1,pos_x:2,piece:{joueur:"j1", type:"pion"}} , {zone:"tt",pos_y:1,pos_x:3,piece:{joueur:"j1", type:"pion"}}],
        [{zone:"tt",pos_y:2,pos_x:0,piece:null}                       , {zone:"tt",pos_y:2,pos_x:1,piece:null}                       , {zone:"tt",pos_y:2,pos_x:2,piece:null}                       , {zone:"tt",pos_y:2,pos_x:3,piece:null}                      ],
        [{zone:"tt",pos_y:3,pos_x:0,piece:null}                       , {zone:"tt",pos_y:3,pos_x:1,piece:null}                       , {zone:"tt",pos_y:3,pos_x:2,piece:null}                       , {zone:"tt",pos_y:3,pos_x:3,piece:null}                      ],
        [{zone:"tt",pos_y:4,pos_x:0,piece:null}                       , {zone:"tt",pos_y:4,pos_x:1,piece:null}                       , {zone:"tt",pos_y:4,pos_x:2,piece:null}                       , {zone:"tt",pos_y:4,pos_x:3,piece:null}                      ],
        [{zone:"tt",pos_y:5,pos_x:0,piece:null}                       , {zone:"tt",pos_y:5,pos_x:1,piece:null}                       , {zone:"tt",pos_y:5,pos_x:2,piece:null}                       , {zone:"tt",pos_y:5,pos_x:3,piece:null}                      ],
        [{zone:"tt",pos_y:6,pos_x:0,piece:{joueur:"j2", type:"pion"}} , {zone:"tt",pos_y:6,pos_x:1,piece:{joueur:"j2", type:"pion"}} , {zone:"tt",pos_y:6,pos_x:2,piece:{joueur:"j2", type:"pion"}} , {zone:"tt",pos_y:6,pos_x:3,piece:{joueur:"j2", type:"pion"}}],
        [{zone:"tt",pos_y:7,pos_x:0,piece:{joueur:"j2", type:"A_A"}}  , {zone:"tt",pos_y:7,pos_x:1,piece:{joueur:"j2", type:"dist"}} , {zone:"tt",pos_y:7,pos_x:2,piece:{joueur:"j2", type:"QG"}}   , {zone:"tt",pos_y:7,pos_x:3,piece:{joueur:"j2", type:"A_B"}} ]
      ],
      plateauMer: [
        [{zone:"tm",pos_y:0,pos_x:4,piece:{joueur:"j1", type:"A_B"}}  , {zone:"tm",pos_y:0,pos_x:5,piece:{joueur:"j1", type:"QG"}}   , {zone:"tm",pos_y:0,pos_x:6,piece:{joueur:"j1", type:"dist"}} , {zone:"tm",pos_y:0,pos_x:7,piece:{joueur:"j1", type:"A_A"}} ],
        [{zone:"tm",pos_y:1,pos_x:4,piece:{joueur:"j1", type:"pion"}} , {zone:"tm",pos_y:1,pos_x:5,piece:{joueur:"j1", type:"pion"}} , {zone:"tm",pos_y:1,pos_x:6,piece:{joueur:"j1", type:"pion"}} , {zone:"tm",pos_y:1,pos_x:7,piece:{joueur:"j1", type:"pion"}}],
        [{zone:"tm",pos_y:2,pos_x:4,piece:null}                       , {zone:"tm",pos_y:2,pos_x:5,piece:null}                       , {zone:"tm",pos_y:2,pos_x:6,piece:null}                       , {zone:"tm",pos_y:2,pos_x:7,piece:null}                      ],
        [{zone:"tm",pos_y:3,pos_x:4,piece:null}                       , {zone:"tm",pos_y:3,pos_x:5,piece:null}                       , {zone:"tm",pos_y:3,pos_x:6,piece:null}                       , {zone:"tm",pos_y:3,pos_x:7,piece:null}                      ],
        [{zone:"tm",pos_y:4,pos_x:4,piece:null}                       , {zone:"tm",pos_y:4,pos_x:5,piece:null}                       , {zone:"tm",pos_y:4,pos_x:6,piece:null}                       , {zone:"tm",pos_y:4,pos_x:7,piece:null}                      ],
        [{zone:"tm",pos_y:5,pos_x:4,piece:null}                       , {zone:"tm",pos_y:5,pos_x:5,piece:null}                       , {zone:"tm",pos_y:5,pos_x:6,piece:null}                       , {zone:"tm",pos_y:5,pos_x:7,piece:null}                      ],
        [{zone:"tm",pos_y:6,pos_x:4,piece:{joueur:"j2", type:"pion"}} , {zone:"tm",pos_y:6,pos_x:5,piece:{joueur:"j2", type:"pion"}} , {zone:"tm",pos_y:6,pos_x:6,piece:{joueur:"j2", type:"pion"}} , {zone:"tm",pos_y:6,pos_x:7,piece:{joueur:"j2", type:"pion"}}],
        [{zone:"tm",pos_y:7,pos_x:4,piece:{joueur:"j2", type:"A_A"}}  , {zone:"tm",pos_y:7,pos_x:5,piece:{joueur:"j2", type:"dist"}} , {zone:"tm",pos_y:7,pos_x:6,piece:{joueur:"j2", type:"QG"}}   , {zone:"tm",pos_y:7,pos_x:7,piece:{joueur:"j2", type:"A_B"}} ]
      ],
      tour_j1:true,
      recrutement: {
        j1: {
          a_poser: [],
          zone_gagner: []
        },
        j2: {
          a_poser: [],
          zone_gagner: []
        }
      }
    };
  }
  
  function fun_is_piece(truc) {
    if (   (truc.type   !== undefined)
        && (truc.joueur !== undefined)) {
      return true;
    }
    return false;
  }

  function get_info_joueur(){
    var reserve = [];
    if (data.tour_j1) {
      reserve = data.recrutement.j1;
    } else {
      reserve = data.recrutement.j2;
    }
    return reserve;
  }

}

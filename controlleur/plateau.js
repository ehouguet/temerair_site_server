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
    console.log('get_info_player().winArea : ');
    console.log(get_info_player().winArea);
    console.log('cond de victoire : ');
    console.log(get_info_player().winArea.length >= 2);
    if (get_info_player().winArea.length >= 2) {
      if (data.isTurnOfP1) {
        console.log('demande serveur: victoire p1.');
        emit('plateau:victoire', 'p1');
      } else {
        console.log('demande serveur: victoire p2.');
        emit('plateau:victoire', 'p2');
      }
      data = get_data_default();
    } else {
      data.isTurnOfP1 = !data.isTurnOfP1;
    }

    console.log('demande serveur: init.');
    emit('plateau:reset', data);

  }

  function fun_recrutement(piece_recu, cell_dest_recu) {
    var cell_dest = get_cell_local(cell_dest_recu);
    var reserve = get_info_player().toPut;

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

    cell_dest_recu.posY = cell_dest.posY+1;
    cell_dest_recu.posX = cell_dest.posX;
    var cell_tmp = get_cell_local(cell_dest_recu);
    if (cell_tmp != null) {
      if (cell_tmp.piece != null) {
        if (cell_tmp.piece.type == "QG" && cell_tmp.piece.player == piece_recu.player) {
          cell_dest.piece = piece_recu;
          fun_fin_tour();
        }
      }
    }
    cell_dest_recu.posY = cell_dest.posY;
    cell_dest_recu.posX = cell_dest.posX+1;
    var cell_tmp = get_cell_local(cell_dest_recu);
    if (cell_tmp != null) {
      if (cell_tmp.piece != null) {
        if (cell_tmp.piece.type == "QG" && cell_tmp.piece.player == piece_recu.player) {
          cell_dest.piece = piece_recu;
          fun_fin_tour();
        }
      }
    }
    cell_dest_recu.posY = cell_dest.posY-1;
    cell_dest_recu.posX = cell_dest.posX;
    var cell_tmp = get_cell_local(cell_dest_recu);
    if (cell_tmp != null) {
      if (cell_tmp.piece != null) {
        if (cell_tmp.piece.type == "QG" && cell_tmp.piece.player == piece_recu.player) {
          cell_dest.piece = piece_recu;
          fun_fin_tour();
        }
      }
    }
    cell_dest_recu.posY = cell_dest.posY;
    cell_dest_recu.posX = cell_dest.posX-1;
    var cell_tmp = get_cell_local(cell_dest_recu);
    if (cell_tmp != null) {
      if (cell_tmp.piece != null) {
        if (cell_tmp.piece.type == "QG" && cell_tmp.piece.player == piece_recu.player) {
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

    /* cas de piece de meme player */
    if (cell_dest.piece != null) {
      if (cell_ori.piece.player == cell_dest.piece.player){
        console.log("server.js => FTDDP: piece du meme player");
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
    if (cell_ori.area != cell_dest.area) {
      console.log("server.js => fun_action_A_A: echec: area differente");
      return;
    }

    if (  (cell_ori.posY == cell_dest.posY)
      || (cell_ori.posX == cell_dest.posX)){
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
    if (cell_ori.area != cell_dest.area) {
      console.log("server.js => fun_action_QG: echec: area differente");
      return ;
    }
    if (   ((cell_ori.posY+1 == cell_dest.posY) && (cell_ori.posX+1 == cell_dest.posX))
      || ((cell_ori.posY+1 == cell_dest.posY) && (cell_ori.posX-1 == cell_dest.posX))
      || ((cell_ori.posY-1 == cell_dest.posY) && (cell_ori.posX+1 == cell_dest.posX))
      || ((cell_ori.posY-1 == cell_dest.posY) && (cell_ori.posX-1 == cell_dest.posX))
      ){
      console.log("server.js => fun_action_QG: reussi");
      fun_mange(cell_dest);
      fun_deplacement(cell_ori, cell_dest);
      fun_fin_tour();
    }
  }
  function fun_action_pion(cell_ori, cell_dest) {
    console.log("server.js => fun_action_pion: deplacement piont");
    if (cell_ori.area != cell_dest.area) {
      console.log("server.js => fun_action_pion: echec: area differente");
      return false;
    }
    /* pion p1 */
    if (cell_ori.piece.player == "p1") {
      if (   ((cell_ori.posX == cell_dest.posX-1) && (cell_ori.posY+1 == cell_dest.posY))
          || ((cell_ori.posX == cell_dest.posX  ) && (cell_ori.posY+1 == cell_dest.posY))
          || ((cell_ori.posX == cell_dest.posX+1) && (cell_ori.posY+1 == cell_dest.posY))
        ){
        console.log("server.js => fun_action_pion: reussi");
        fun_mange(cell_dest);
        fun_deplacement(cell_ori, cell_dest);
        fun_fin_tour();
      } else {
        console.log("server.js => fun_action_pion: echec: case inatagnable");
      }
    } else {
      if (   ((cell_ori.posX == cell_dest.posX-1) && (cell_ori.posY-1 == cell_dest.posY))
          || ((cell_ori.posX == cell_dest.posX  ) && (cell_ori.posY-1 == cell_dest.posY))
          || ((cell_ori.posX == cell_dest.posX+1) && (cell_ori.posY-1 == cell_dest.posY))
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

    /* click sur une case de meme area */
    if (cell_ori.area == cell_dest.area) {
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

    /* control area de terrain */
    if (cell_A.area != cell_ori.area) {
      console.log("server.js => fun_action_A_B: echec: area differant");
      return;
    }

    /* control du mange au meme etage */
    if (fun_have_allier(cell_A)) {
      console.log("server.js => fun_action_A_B: echec: deplacer sur un allier");
      return;
    }

    if ((Math.abs(cell_A.posY - cell_ori.posY)) == (Math.abs(cell_A.posX - cell_ori.posX))){
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
      if ((cell_ori.area != cell_dest.area)) {
        console.log("server.js => fun_action_dist: echec: deplacement en area differente");
        return false;
      }
      if ( ((cell_ori.posY+1 == cell_dest.posY) && (cell_ori.posX   == cell_dest.posX))
        || ((cell_ori.posY   == cell_dest.posY) && (cell_ori.posX+1 == cell_dest.posX))
        || ((cell_ori.posY-1 == cell_dest.posY) && (cell_ori.posX   == cell_dest.posX))
        || ((cell_ori.posY   == cell_dest.posY) && (cell_ori.posX-1 == cell_dest.posX))
        ) {
        console.log("server.js => fun_action_dist: reussi: deplacement");
        fun_deplacement(cell_ori, cell_dest);
        fun_fin_tour();
      }
    } else {
      if (!(
           (cell_ori.area == cell_dest.area)
        || ((cell_ori.area == "tm") && (cell_dest.area == "tt"))
        || ((cell_ori.area == "tt") && (cell_dest.area == "tm"))
        )) {
        console.log("server.js => fun_action_dist: echec: tire sur une area inategnable");
        return false;
      }
      if (cell_ori.posY == cell_dest.posY) {
        console.log("server.js => fun_action_dist: echec: tire sur une case inategnable");
        return;
      }
      if (cell_ori.posX == cell_dest.posX) {
        console.log("server.js => fun_action_dist: echec: tire sur une case inategnable");
        return;
      }
      if (((Math.abs(cell_ori.posY - cell_dest.posY)) + (Math.abs(cell_ori.posX - cell_dest.posX)) == 3)) {
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
        /* victoire sur une area */
        cell.piece = null;
        fun_victoire_sur_plateau(cell.area);
      }
    }
    cell.piece = null;
  }
  function fun_victoire_sur_plateau(area) {
    get_info_player().winArea.push(area);

    // recupere la area en paix
    var plateauarea;
    switch (area) {
      case "ta":
        plateauarea = data.plateauAir;
        break;
      case "tt":
        plateauarea = data.plateauTerre;
        break;
      case "tm":
        plateauarea = data.plateauMer;
        break;
    }

    // recupere 
    for (var i = plateauarea.length - 1; i >= 0; i--) {
      var ligne = plateauarea[i];
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
        get_info_player().toPut.push(cell.piece);
      }
    }
    cell.piece = null;
  }

  /* fonction de recuperation de la cellule local */
  function get_cell_local(cell_recu) {
    var res;
    switch (cell_recu.area) {
      case "ta":
        res = data.plateauAir[cell_recu.posY][cell_recu.posX];
        break;
      case "tt":
        res = data.plateauTerre[cell_recu.posY][cell_recu.posX];
        break;
      case "tm":
        res = data.plateauMer[cell_recu.posY][cell_recu.posX-4];
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
    res_cell.posY = cell.posY;

    if (cell.area == "tt") {
      if (cell.posX > 1) {
        return null;
      }
      res_cell.area = "ta";
      res_cell.posX = parseInt(cell.posX)+2;
    }
    if (cell.area == "tm") {
      if (cell.posX < 6) {
        return null;
      }
      res_cell.area = "ta";
      res_cell.posX = parseInt(cell.posX)-6;
    }
    if (cell.area == "ta") {
      if (cell.posX < 2) {
        res_cell.area = "tm";
        res_cell.posX = parseInt(cell.posX)+6;
      } else {
        res_cell.area = "tt";
        res_cell.posX = parseInt(cell.posX)-2;
      }
    }
    return get_cell_local(res_cell);
  }

  /* detection d'obstacle */
  function fun_presence_obstacle(cell_ori, cell_dest) {
    /* initialisation */
    var tmp_cell = {};
    tmp_cell.area = cell_ori.area;
    tmp_cell.posY = cell_ori.posY;
    tmp_cell.posX = cell_ori.posX;

    /* recup variation */
    var variation = {};
    if (cell_ori.posX != cell_dest.posX) {
      if (cell_ori.posX < cell_dest.posX) {
        variation.varY = 1;
      } else {
        variation.varY = -1;
      }
    } else {
      variation.varY = 0;
    }
    if (cell_ori.posY != cell_dest.posY) {
      if (cell_ori.posY < cell_dest.posY) {
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
    tmp_cell.posY += variation.var_x;
    tmp_cell.posX += variation.varY;
    while (   (tmp_cell.posY != cell_dest.posY)
         || (tmp_cell.posX != cell_dest.posX)) {
      if (get_cell_local(tmp_cell).piece != null) {
        return false;
      }

      tmp_cell.posY += variation.var_x;
      tmp_cell.posX += variation.varY;
    }
    return true
  }

  function fun_is_allier(piece) {
    return (   ((data.isTurnOfP1) && (piece.player == "p1"))
        || ((!data.isTurnOfP1) && (piece.player == "p2")));
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
        [{area:"ta",posY:0,posX:0,piece:{player:"p1", type:"A_B"}}  , {area:"ta",posY:0,posX:1,piece:{player:"p1", type:"QG"}}   , {area:"ta",posY:0,posX:2,piece:{player:"p1", type:"dist"}} , {area:"ta",posY:0,posX:3,piece:{player:"p1", type:"A_A"}} ],
        [{area:"ta",posY:1,posX:0,piece:{player:"p1", type:"pion"}} , {area:"ta",posY:1,posX:1,piece:{player:"p1", type:"pion"}} , {area:"ta",posY:1,posX:2,piece:{player:"p1", type:"pion"}} , {area:"ta",posY:1,posX:3,piece:{player:"p1", type:"pion"}}],
        [{area:"ta",posY:2,posX:0,piece:null}                       , {area:"ta",posY:2,posX:1,piece:null}                       , {area:"ta",posY:2,posX:2,piece:null}                       , {area:"ta",posY:2,posX:3,piece:null}                      ],
        [{area:"ta",posY:3,posX:0,piece:null}                       , {area:"ta",posY:3,posX:1,piece:null}                       , {area:"ta",posY:3,posX:2,piece:null}                       , {area:"ta",posY:3,posX:3,piece:null}                      ],
        [{area:"ta",posY:4,posX:0,piece:null}                       , {area:"ta",posY:4,posX:1,piece:null}                       , {area:"ta",posY:4,posX:2,piece:null}                       , {area:"ta",posY:4,posX:3,piece:null}                      ],
        [{area:"ta",posY:5,posX:0,piece:null}                       , {area:"ta",posY:5,posX:1,piece:null}                       , {area:"ta",posY:5,posX:2,piece:null}                       , {area:"ta",posY:5,posX:3,piece:null}                      ],
        [{area:"ta",posY:6,posX:0,piece:{player:"p2", type:"pion"}} , {area:"ta",posY:6,posX:1,piece:{player:"p2", type:"pion"}} , {area:"ta",posY:6,posX:2,piece:{player:"p2", type:"pion"}} , {area:"ta",posY:6,posX:3,piece:{player:"p2", type:"pion"}}],
        [{area:"ta",posY:7,posX:0,piece:{player:"p2", type:"A_A"}}  , {area:"ta",posY:7,posX:1,piece:{player:"p2", type:"dist"}} , {area:"ta",posY:7,posX:2,piece:{player:"p2", type:"QG"}}   , {area:"ta",posY:7,posX:3,piece:{player:"p2", type:"A_B"}} ]
      ],
      plateauTerre: [
        [{area:"tt",posY:0,posX:0,piece:{player:"p1", type:"A_B"}}  , {area:"tt",posY:0,posX:1,piece:{player:"p1", type:"QG"}}   , {area:"tt",posY:0,posX:2,piece:{player:"p1", type:"dist"}} , {area:"tt",posY:0,posX:3,piece:{player:"p1", type:"A_A"}} ],
        [{area:"tt",posY:1,posX:0,piece:{player:"p1", type:"pion"}} , {area:"tt",posY:1,posX:1,piece:{player:"p1", type:"pion"}} , {area:"tt",posY:1,posX:2,piece:{player:"p1", type:"pion"}} , {area:"tt",posY:1,posX:3,piece:{player:"p1", type:"pion"}}],
        [{area:"tt",posY:2,posX:0,piece:null}                       , {area:"tt",posY:2,posX:1,piece:null}                       , {area:"tt",posY:2,posX:2,piece:null}                       , {area:"tt",posY:2,posX:3,piece:null}                      ],
        [{area:"tt",posY:3,posX:0,piece:null}                       , {area:"tt",posY:3,posX:1,piece:null}                       , {area:"tt",posY:3,posX:2,piece:null}                       , {area:"tt",posY:3,posX:3,piece:null}                      ],
        [{area:"tt",posY:4,posX:0,piece:null}                       , {area:"tt",posY:4,posX:1,piece:null}                       , {area:"tt",posY:4,posX:2,piece:null}                       , {area:"tt",posY:4,posX:3,piece:null}                      ],
        [{area:"tt",posY:5,posX:0,piece:null}                       , {area:"tt",posY:5,posX:1,piece:null}                       , {area:"tt",posY:5,posX:2,piece:null}                       , {area:"tt",posY:5,posX:3,piece:null}                      ],
        [{area:"tt",posY:6,posX:0,piece:{player:"p2", type:"pion"}} , {area:"tt",posY:6,posX:1,piece:{player:"p2", type:"pion"}} , {area:"tt",posY:6,posX:2,piece:{player:"p2", type:"pion"}} , {area:"tt",posY:6,posX:3,piece:{player:"p2", type:"pion"}}],
        [{area:"tt",posY:7,posX:0,piece:{player:"p2", type:"A_A"}}  , {area:"tt",posY:7,posX:1,piece:{player:"p2", type:"dist"}} , {area:"tt",posY:7,posX:2,piece:{player:"p2", type:"QG"}}   , {area:"tt",posY:7,posX:3,piece:{player:"p2", type:"A_B"}} ]
      ],
      plateauMer: [
        [{area:"tm",posY:0,posX:4,piece:{player:"p1", type:"A_B"}}  , {area:"tm",posY:0,posX:5,piece:{player:"p1", type:"QG"}}   , {area:"tm",posY:0,posX:6,piece:{player:"p1", type:"dist"}} , {area:"tm",posY:0,posX:7,piece:{player:"p1", type:"A_A"}} ],
        [{area:"tm",posY:1,posX:4,piece:{player:"p1", type:"pion"}} , {area:"tm",posY:1,posX:5,piece:{player:"p1", type:"pion"}} , {area:"tm",posY:1,posX:6,piece:{player:"p1", type:"pion"}} , {area:"tm",posY:1,posX:7,piece:{player:"p1", type:"pion"}}],
        [{area:"tm",posY:2,posX:4,piece:null}                       , {area:"tm",posY:2,posX:5,piece:null}                       , {area:"tm",posY:2,posX:6,piece:null}                       , {area:"tm",posY:2,posX:7,piece:null}                      ],
        [{area:"tm",posY:3,posX:4,piece:null}                       , {area:"tm",posY:3,posX:5,piece:null}                       , {area:"tm",posY:3,posX:6,piece:null}                       , {area:"tm",posY:3,posX:7,piece:null}                      ],
        [{area:"tm",posY:4,posX:4,piece:null}                       , {area:"tm",posY:4,posX:5,piece:null}                       , {area:"tm",posY:4,posX:6,piece:null}                       , {area:"tm",posY:4,posX:7,piece:null}                      ],
        [{area:"tm",posY:5,posX:4,piece:null}                       , {area:"tm",posY:5,posX:5,piece:null}                       , {area:"tm",posY:5,posX:6,piece:null}                       , {area:"tm",posY:5,posX:7,piece:null}                      ],
        [{area:"tm",posY:6,posX:4,piece:{player:"p2", type:"pion"}} , {area:"tm",posY:6,posX:5,piece:{player:"p2", type:"pion"}} , {area:"tm",posY:6,posX:6,piece:{player:"p2", type:"pion"}} , {area:"tm",posY:6,posX:7,piece:{player:"p2", type:"pion"}}],
        [{area:"tm",posY:7,posX:4,piece:{player:"p2", type:"A_A"}}  , {area:"tm",posY:7,posX:5,piece:{player:"p2", type:"dist"}} , {area:"tm",posY:7,posX:6,piece:{player:"p2", type:"QG"}}   , {area:"tm",posY:7,posX:7,piece:{player:"p2", type:"A_B"}} ]
      ],
      isTurnOfP1:true,
      p1: {
        toPut: [],
        winArea: []
      },
      p2: {
        toPut: [],
        winArea: []
      }
    };
  }
  
  function fun_is_piece(truc) {
    if (   (truc.type   !== undefined)
        && (truc.player !== undefined)) {
      return true;
    }
    return false;
  }

  function get_info_player(){
    var reserve = [];
    if (data.isTurnOfP1) {
      reserve = data.p1;
    } else {
      reserve = data.p2;
    }
    return reserve;
  }

}

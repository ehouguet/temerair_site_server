
'use strict'

const expect = require('chai').expect;
const plateauTestUtils = require('./plateauTestUtils');

const PlateauControlleur = require('../controlleur/plateau');

describe('plateau', () => {

  let socketMock = {
    emit: () => null,
  };
  let plateauControlleur = PlateauControlleur([socketMock]);

  describe('QG', () => {

    it('move down left', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:4,posX:1,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:1,piece:{player:"p1", type:"QG"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    it('move down right', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:4,posX:3,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:3,piece:{player:"p1", type:"QG"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('move top left', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:2,posX:1,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:2,posX:1,piece:{player:"p1", type:"QG"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('move top right', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:2,posX:3,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:2,posX:3,piece:{player:"p1", type:"QG"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    //////////////////////////// deployment ////////////////////////////
    it('deploy top', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
      ], [
        {player:"p1", type:"pion"},
      ]);
      // action
      plateauControlleur.recrutement(
        {player:"p1", type:"pion"},
        {area:"tt",posY:2,posX:2,piece:null},
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"pion"}},
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    it('deploy left', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
      ], [
        {player:"p1", type:"pion"},
      ]);
      // action
      plateauControlleur.recrutement(
        {player:"p1", type:"pion"},
        {area:"tt",posY:3,posX:1,piece:null},
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:3,posX:1,piece:{player:"p1", type:"pion"}},
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    it('deploy right', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
      ], [
        {player:"p1", type:"pion"},
      ]);
      // action
      plateauControlleur.recrutement(
        {player:"p1", type:"pion"},
        {area:"tt",posY:3,posX:3,piece:null},
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:3,posX:3,piece:{player:"p1", type:"pion"}},
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    it('deploy down', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
      ], [
        {player:"p1", type:"pion"},
      ]);
      // action
      plateauControlleur.recrutement(
        {player:"p1", type:"pion"},
        {area:"tt",posY:4,posX:2,piece:null},
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:4,posX:2,piece:{player:"p1", type:"pion"}},
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    //////////////////////////// victory on one plateau ////////////////////////////
    it('win in a area', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:1,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}},
        {area:"tt",posY:4,posX:3,piece:{player:"p2", type:"QG"}},
        {area:"tm",posY:1,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tm",posY:4,posX:3,piece:{player:"p2", type:"QG"}},
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}},
        {area:"tt",posY:4,posX:3,piece:{player:"p2", type:"QG"}},
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2V1WithPiece([
        {area:"tm",posY:1,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tm",posY:4,posX:3,piece:{player:"p2", type:"QG"}},
      ], [
        {player:"p1", type:"pion"},
      ], [
        'tt',
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('win the partie', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateV1WithPiece([
        {area:"tt",posY:1,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}},
        {area:"tt",posY:4,posX:3,piece:{player:"p2", type:"QG"}},
        {area:"tm",posY:1,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tm",posY:4,posX:3,piece:{player:"p2", type:"QG"}},
      ], [
      ], [
        'ta',
      ]);
      // config
      let haveEmitVictory = false; 
      socketMock.emit = (type, param) => {
        if (type === 'plateau:victoire' && param === 'p1') {
          haveEmitVictory = true; 
        }
      }
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}},
        {area:"tt",posY:4,posX:3,piece:{player:"p2", type:"QG"}},
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2V1WithPiece([
        {area:"tm",posY:1,posX:2,piece:{player:"p1", type:"QG"}},
        {area:"tm",posY:4,posX:3,piece:{player:"p2", type:"QG"}},
      ], [
        {player:"p1", type:"pion"},
      ], [
        'ta',
        'tt',
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu);
      // test event victory
      expect(haveEmitVictory).to.equal(true);
    })

  })
})




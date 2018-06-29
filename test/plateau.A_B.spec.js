
'use strict'

const expect = require('chai').expect;
const plateauTestUtils = require('./plateauTestUtils');

const PlateauControlleur = require('../controlleur/plateau');

describe('plateau', () => {

  let socketMock = {
    emit: () => null,
  };
  let plateauControlleur = PlateauControlleur([socketMock]);

  describe('A_B', () => {

    it('move 2 down left', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:5,posX:0,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:5,posX:0,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    it('move 1 down right', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:4,posX:3,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:3,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('move 2 top left', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:1,posX:0,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:1,posX:0,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('move 1 top right', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:2,posX:3,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:2,posX:3,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    ////////////////////////////: specifique move ////////////////////////////

    it("don't move on others piece", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:0,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:4,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:2,posX:0,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:5,posX:3,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:0,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:4,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it("eat a piece", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:1,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:4,posX:2,piece:{player:"p2", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:1,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:4,posX:2,piece:{player:"p2", type:"A_B"}}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it("eat a piece in others area when click on others area", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:1,piece:{player:"p1", type:"A_B"}},
        {area:"ta",posY:4,posX:2,piece:{player:"p2", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:1,piece:{player:"p1", type:"A_B"}},
        {area:"ta",posY:4,posX:2,piece:{player:"p2", type:"A_B"}}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:0,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it("eat a piece in others area when click on same area", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:1,piece:{player:"p1", type:"A_B"}},
        {area:"ta",posY:4,posX:2,piece:{player:"p2", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:1,piece:{player:"p1", type:"A_B"}},
        {area:"tt",posY:4,posX:0,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:0,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
  })
})




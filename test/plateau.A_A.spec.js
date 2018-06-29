
'use strict'

const expect = require('chai').expect;
const plateauTestUtils = require('./plateauTestUtils');

const PlateauControlleur = require('../controlleur/plateau');

describe('plateau', () => {

  let socketMock = {
    emit: () => null,
  };
  let plateauControlleur = PlateauControlleur([socketMock]);

  describe('A_A', () => {

    it('move 2 down', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_A"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_A"}},
        {area:"tt",posY:5,posX:2,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:5,posX:2,piece:{player:"p1", type:"A_A"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    it('move 1 right', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_A"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_A"}},
        {area:"tt",posY:3,posX:3,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:3,posX:3,piece:{player:"p1", type:"A_A"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('move 2 left', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_A"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_A"}},
        {area:"tt",posY:3,posX:0,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:3,posX:0,piece:{player:"p1", type:"A_A"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('move 3 top', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_A"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_A"}},
        {area:"tt",posY:0,posX:2,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:0,posX:2,piece:{player:"p1", type:"A_A"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    ////////////////////////////: specifique move ////////////////////////////

    it("don't move on others piece", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"A_A"}},
        {area:"tt",posY:4,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"A_A"}},
        {area:"tt",posY:6,posX:2,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"A_A"}},
        {area:"tt",posY:4,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it("eat a piece", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"A_A"}},
        {area:"tt",posY:4,posX:2,piece:{player:"p2", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"A_A"}},
        {area:"tt",posY:4,posX:2,piece:{player:"p2", type:"A_B"}}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:2,piece:{player:"p1", type:"A_A"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
  })
})





'use strict'

const expect = require('chai').expect;
const plateauTestUtils = require('./plateauTestUtils');

const PlateauControlleur = require('../controlleur/plateau');

describe('plateau', () => {

  let socketMock = {
    emit: () => null,
  };
  let plateauControlleur = PlateauControlleur([socketMock]);

  describe('dist', () => {

    it('move 2 down', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"dist"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"dist"}},
        {area:"tt",posY:4,posX:2,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:2,piece:{player:"p1", type:"dist"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    it('move 1 right', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"dist"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"dist"}},
        {area:"tt",posY:3,posX:3,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:3,posX:3,piece:{player:"p1", type:"dist"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('move left', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"dist"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"dist"}},
        {area:"tt",posY:3,posX:1,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:3,posX:1,piece:{player:"p1", type:"dist"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('move top', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"dist"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"dist"}},
        {area:"tt",posY:2,posX:2,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"dist"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    ////////////////////////////: specifique move ////////////////////////////

    it("don't eat piece on 1 cell", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"dist"}},
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"dist"}},
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"dist"}},
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"A_B"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it("eat a piece", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"dist"}},
        {area:"tt",posY:4,posX:3,piece:{player:"p2", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"dist"}},
        {area:"tt",posY:4,posX:3,piece:{player:"p2", type:"A_B"}}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:2,posX:2,piece:{player:"p1", type:"dist"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it("eat a piece on others area", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:3,piece:{player:"p1", type:"dist"}},
        {area:"tm",posY:3,posX:5,piece:{player:"p2", type:"A_B"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:2,posX:3,piece:{player:"p1", type:"dist"}},
        {area:"tm",posY:3,posX:5,piece:{player:"p2", type:"A_B"}}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:2,posX:3,piece:{player:"p1", type:"dist"}},
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
  })
})




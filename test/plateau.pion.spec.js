
'use strict'

const expect = require('chai').expect;
const plateauTestUtils = require('./plateauTestUtils');

const PlateauControlleur = require('../controlleur/plateau');

describe('plateau', () => {

  let socketMock = {
    emit: () => null,
  };
  let plateauControlleur = PlateauControlleur([socketMock]);

  describe('point', () => {

    it('j1 move down', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}},
        {area:"tt",posY:4,posX:2,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:2,piece:{player:"p1", type:"pion"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    it('j1 move down right', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}},
        {area:"tt",posY:4,posX:3,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:3,piece:{player:"p1", type:"pion"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it('j1 move down left', () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}},
        {area:"tt",posY:4,posX:1,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:4,posX:1,piece:{player:"p1", type:"pion"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })

    it("j1 don't move up", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}},
        {area:"tt",posY:2,posX:2,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p1", type:"pion"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
    
    it("j2 move up", () => {
      // init plateau
      plateauControlleur.plateauStates = plateauTestUtils.getPlateauStateP2WithPiece([
        {area:"tt",posY:3,posX:2,piece:{player:"p2", type:"pion"}}
      ]);
      // action
      plateauControlleur.traitement_dependent_des_piece(
        {area:"tt",posY:3,posX:2,piece:{player:"p2", type:"pion"}},
        {area:"tt",posY:2,posX:2,piece:null}
      );
      // test plateau
      let plateauStatesVoulu = plateauTestUtils.getPlateauStateWithPiece([
        {area:"tt",posY:2,posX:2,piece:{player:"p2", type:"pion"}}
      ]);
      expect(plateauControlleur.plateauStates).to.deep.equal(plateauStatesVoulu)
    })
  })
})




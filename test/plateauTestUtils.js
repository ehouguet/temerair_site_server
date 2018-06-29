
module.exports = {
    getPlateauStateEmpty: getPlateauStateEmpty,
    getPlateauStateWithPiece: getPlateauStateWithPiece,
    getPlateauStateP2WithPiece: getPlateauStateP2WithPiece,
}

const areaIdToArea = {
    ta: 'plateauAir',
    tt: 'plateauTerre',
    tm: 'plateauMer',
}

function getPlateauStateP2WithPiece(cells) {
    let plateauSate = getPlateauStateWithPiece(cells);
    plateauSate.isTurnOfP1 = false;
    return plateauSate;
}

function getPlateauStateWithPiece(cells) {
    let plateauSate = getPlateauStateEmpty();
    cells.forEach((cell) => {
        switch (cell.area) {
            case "ta":
            case "tt":
                plateauSate[areaIdToArea[cell.area]][cell.posY][cell.posX] = cell;
            break;
            case "tm":
                plateauSate[areaIdToArea[cell.area]][cell.posY][cell.posX-4] = cell;
            break;
        }
    })
    return plateauSate;
}

function getPlateauStateEmpty() {
    return {
        // air inversé
        plateauAir: [
          [{area:"ta",posY:0,posX:0,piece:null} , {area:"ta",posY:0,posX:1,piece:null} , {area:"ta",posY:0,posX:2,piece:null} , {area:"ta",posY:0,posX:3,piece:null} ],
          [{area:"ta",posY:1,posX:0,piece:null} , {area:"ta",posY:1,posX:1,piece:null} , {area:"ta",posY:1,posX:2,piece:null} , {area:"ta",posY:1,posX:3,piece:null} ],
          [{area:"ta",posY:2,posX:0,piece:null} , {area:"ta",posY:2,posX:1,piece:null} , {area:"ta",posY:2,posX:2,piece:null} , {area:"ta",posY:2,posX:3,piece:null} ],
          [{area:"ta",posY:3,posX:0,piece:null} , {area:"ta",posY:3,posX:1,piece:null} , {area:"ta",posY:3,posX:2,piece:null} , {area:"ta",posY:3,posX:3,piece:null} ],
          [{area:"ta",posY:4,posX:0,piece:null} , {area:"ta",posY:4,posX:1,piece:null} , {area:"ta",posY:4,posX:2,piece:null} , {area:"ta",posY:4,posX:3,piece:null} ],
          [{area:"ta",posY:5,posX:0,piece:null} , {area:"ta",posY:5,posX:1,piece:null} , {area:"ta",posY:5,posX:2,piece:null} , {area:"ta",posY:5,posX:3,piece:null} ],
          [{area:"ta",posY:6,posX:0,piece:null} , {area:"ta",posY:6,posX:1,piece:null} , {area:"ta",posY:6,posX:2,piece:null} , {area:"ta",posY:6,posX:3,piece:null} ],
          [{area:"ta",posY:7,posX:0,piece:null} , {area:"ta",posY:7,posX:1,piece:null} , {area:"ta",posY:7,posX:2,piece:null} , {area:"ta",posY:7,posX:3,piece:null} ]
        ],
        // plateauAir: [
        //   [{area:"ta",posY:0,posX:0,piece:null} , {area:"ta",posY:0,posX:1,piece:null} , {area:"ta",posY:0,posX:2,piece:null} , {area:"ta",posY:0,posX:3,piece:null} ],
        //   [{area:"ta",posY:1,posX:0,piece:null} , {area:"ta",posY:1,posX:1,piece:null} , {area:"ta",posY:1,posX:2,piece:null} , {area:"ta",posY:1,posX:3,piece:null} ],
        //   [{area:"ta",posY:2,posX:0,piece:null} , {area:"ta",posY:2,posX:1,piece:null} , {area:"ta",posY:2,posX:2,piece:null} , {area:"ta",posY:2,posX:3,piece:null} ],
        //   [{area:"ta",posY:3,posX:0,piece:null} , {area:"ta",posY:3,posX:1,piece:null} , {area:"ta",posY:3,posX:2,piece:null} , {area:"ta",posY:3,posX:3,piece:null} ],
        //   [{area:"ta",posY:4,posX:0,piece:null} , {area:"ta",posY:4,posX:1,piece:null} , {area:"ta",posY:4,posX:2,piece:null} , {area:"ta",posY:4,posX:3,piece:null} ],
        //   [{area:"ta",posY:5,posX:0,piece:null} , {area:"ta",posY:5,posX:1,piece:null} , {area:"ta",posY:5,posX:2,piece:null} , {area:"ta",posY:5,posX:3,piece:null} ],
        //   [{area:"ta",posY:6,posX:0,piece:null} , {area:"ta",posY:6,posX:1,piece:null} , {area:"ta",posY:6,posX:2,piece:null} , {area:"ta",posY:6,posX:3,piece:null} ],
        //   [{area:"ta",posY:7,posX:0,piece:null} , {area:"ta",posY:7,posX:1,piece:null} , {area:"ta",posY:7,posX:2,piece:null} , {area:"ta",posY:7,posX:3,piece:null} ]
        // ],
  
        plateauTerre: [
          [{area:"tt",posY:0,posX:0,piece:null} , {area:"tt",posY:0,posX:1,piece:null} , {area:"tt",posY:0,posX:2,piece:null} , {area:"tt",posY:0,posX:3,piece:null} ],
          [{area:"tt",posY:1,posX:0,piece:null} , {area:"tt",posY:1,posX:1,piece:null} , {area:"tt",posY:1,posX:2,piece:null} , {area:"tt",posY:1,posX:3,piece:null} ],
          [{area:"tt",posY:2,posX:0,piece:null} , {area:"tt",posY:2,posX:1,piece:null} , {area:"tt",posY:2,posX:2,piece:null} , {area:"tt",posY:2,posX:3,piece:null} ],
          [{area:"tt",posY:3,posX:0,piece:null} , {area:"tt",posY:3,posX:1,piece:null} , {area:"tt",posY:3,posX:2,piece:null} , {area:"tt",posY:3,posX:3,piece:null} ],
          [{area:"tt",posY:4,posX:0,piece:null} , {area:"tt",posY:4,posX:1,piece:null} , {area:"tt",posY:4,posX:2,piece:null} , {area:"tt",posY:4,posX:3,piece:null} ],
          [{area:"tt",posY:5,posX:0,piece:null} , {area:"tt",posY:5,posX:1,piece:null} , {area:"tt",posY:5,posX:2,piece:null} , {area:"tt",posY:5,posX:3,piece:null} ],
          [{area:"tt",posY:6,posX:0,piece:null} , {area:"tt",posY:6,posX:1,piece:null} , {area:"tt",posY:6,posX:2,piece:null} , {area:"tt",posY:6,posX:3,piece:null} ],
          [{area:"tt",posY:7,posX:0,piece:null} , {area:"tt",posY:7,posX:1,piece:null} , {area:"tt",posY:7,posX:2,piece:null} , {area:"tt",posY:7,posX:3,piece:null} ]
        ],
        plateauMer: [
          [{area:"tm",posY:0,posX:4,piece:null} , {area:"tm",posY:0,posX:5,piece:null} , {area:"tm",posY:0,posX:6,piece:null} , {area:"tm",posY:0,posX:7,piece:null} ],
          [{area:"tm",posY:1,posX:4,piece:null} , {area:"tm",posY:1,posX:5,piece:null} , {area:"tm",posY:1,posX:6,piece:null} , {area:"tm",posY:1,posX:7,piece:null} ],
          [{area:"tm",posY:2,posX:4,piece:null} , {area:"tm",posY:2,posX:5,piece:null} , {area:"tm",posY:2,posX:6,piece:null} , {area:"tm",posY:2,posX:7,piece:null} ],
          [{area:"tm",posY:3,posX:4,piece:null} , {area:"tm",posY:3,posX:5,piece:null} , {area:"tm",posY:3,posX:6,piece:null} , {area:"tm",posY:3,posX:7,piece:null} ],
          [{area:"tm",posY:4,posX:4,piece:null} , {area:"tm",posY:4,posX:5,piece:null} , {area:"tm",posY:4,posX:6,piece:null} , {area:"tm",posY:4,posX:7,piece:null} ],
          [{area:"tm",posY:5,posX:4,piece:null} , {area:"tm",posY:5,posX:5,piece:null} , {area:"tm",posY:5,posX:6,piece:null} , {area:"tm",posY:5,posX:7,piece:null} ],
          [{area:"tm",posY:6,posX:4,piece:null} , {area:"tm",posY:6,posX:5,piece:null} , {area:"tm",posY:6,posX:6,piece:null} , {area:"tm",posY:6,posX:7,piece:null} ],
          [{area:"tm",posY:7,posX:4,piece:null} , {area:"tm",posY:7,posX:5,piece:null} , {area:"tm",posY:7,posX:6,piece:null} , {area:"tm",posY:7,posX:7,piece:null} ]
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
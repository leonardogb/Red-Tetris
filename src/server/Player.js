import {initialBoard} from "../client/gameHelpers";


class Player {

  constructor(name) {
    this.name = name;
    this.grid = initialBoard();
    this.pieces = [];
    this.isMaster = false;
    this.piece = {
      tetromino: [],
      pos: {
        x: 5,
        y: 0,
      },
      collided: false
    };
    this.gameOver = false;
    this.delay = null;
  }
}

export {Player};

import { initialBoard, initialSpectre } from "../client/gameHelpers";


class Player {

  constructor(name, id, socketId) {
    this.id = id;
    this.socketId = socketId;
    this.name = name;
    this.isPlaying = false;
    this.grid = initialBoard();
    this.pieces = [];
    this.isMaster = false;
    this.timeToDelete = null;
    this.piece = {
      tetromino: [],
      pos: {
        x: 5,
        y: 0,
      },
      collided: false
    };
    this.gameOver = false;
    this.roomOver = false;
    this.delay = null;
    this.spectre = initialSpectre();
    this.score = 0;
  }

  increaseScore(value) {
    this.score = this.score + value;
  }

  getScore() {
    return this.score;
  }
}

export {Player};

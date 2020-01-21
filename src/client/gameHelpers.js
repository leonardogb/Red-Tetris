export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export const initialBoard = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, false])
  );

export const checkCollision = (piece, stage, { x: moveX, y: moveY }) => {

  for (let y = 0; y < piece.tetromino.length; y++) {
    for (let x = 0; x < piece.tetromino[y].length; x++) {
      if (piece.tetromino[y][x] !== 0) {
        // console.log(!stage[y + piece.pos.y + moveY], (stage[y + piece.pos.y + moveY] && stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX] === undefined), stage[y + piece.pos.y + moveY] && stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX] && stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX][1]);
        if (
          !stage[y + piece.pos.y + moveY] ||
          (stage[y + piece.pos.y + moveY] && stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX] === undefined) ||
          stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX][1]
        ) {
          // console.log('true')
          return true;
        }
      }
    }
  }
  // console.log('false')
  return false;
};

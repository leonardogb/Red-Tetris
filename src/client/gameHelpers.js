export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 20;

export const initialBoard = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, false])
  );

export const checkCollision = (piece, stage, { x: moveX, y: moveY }) => {

  // Using for loops to be able to return (and break). Not possible with forEach
  for (let y = 0; y < piece.tetromino.length; y++) {
    for (let x = 0; x < piece.tetromino[y].length; x++) {
      // 1. Check that we're on an actual Tetromino cell
      if (piece.tetromino[y][x] !== 0) {
        console.log(!stage[y + piece.pos.y + moveY], (stage[y + piece.pos.y + moveY] && stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX] === undefined), stage[y + piece.pos.y + moveY] && stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX] && stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX][1]);
        if (
          // 2. Check that our move is inside the game areas height (y)
        // That we're not go through bottom of the play area
          !stage[y + piece.pos.y + moveY] ||
          // 3. Check that our move is inside the game areas width (x)
          (stage[y + piece.pos.y + moveY] && stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX] === undefined) ||
          // 4. Check that the cell wer'e moving to isn't set to clear
          stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX][1]
        ) {
          console.log('true')
          return true;
        }
      }
    }
  }
  // 5. If everything above is false
  console.log('false')
  return false;
};

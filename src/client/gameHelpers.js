export const STAGE_WIDTH = 10;
export const STAGE_HEIGHT = 22;

export const initialBoard = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, false])
  );

export const initialSpectre = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
  new Array(STAGE_WIDTH).fill(0)
  );

export const checkCollision = (piece, stage, { x: moveX, y: moveY }) => {

  for (let y = 0; y < piece.tetromino.length; y++) {
    for (let x = 0; x < piece.tetromino[y].length; x++) {
      if (piece.tetromino[y][x] !== 0) {
        if (
          !stage[y + piece.pos.y + moveY] ||
          (stage[y + piece.pos.y + moveY] && stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX] === undefined) ||
          stage[y + piece.pos.y + moveY][x + piece.pos.x + moveX][1]
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isEmpty = (data) => {

    if(typeof(data) == 'number' || typeof(data) == 'boolean')
    {
      return false;
    }
    if(typeof(data) == 'undefined' || data === null)
    {
      return true;
    }
    if(typeof(data.length) != 'undefined')
    {
      return data.length === 0;
    }
    let count = 0;
    for(let i in data)
    {
      if(data.hasOwnProperty(i))
      {
        count ++;
      }
    }
    return count === 0;
};

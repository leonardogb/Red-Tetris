import * as types from './actionTypes';

export const setGameOver = () => {
    return {
        type: types.SET_GAME_OVER
    }
};

export const updateTetromino = () => {
    return {
      type: types.UPDATE_TETROMINO
    }
};

export const updatePlayerPosition = (posY, posX, collided) => {
    return {
      type: types.UPDATE_PLAYER_POSITION,
      payload: {
        y: posY,
        x: posX,
        collided: collided
      }
    }
  };

  export const setDelay = (delay) => {
    return {
      type: types.SET_DELAY,
      payload: {
        delay: delay
      }
    }
  };

export const setPiece = (piece) => {
    return {
        type: types.SET_PIECE,
        payload: {
        piece: piece
        }
    }
}

export const swapPieces = () => {
    return {
      type: types.SWAP_PIECES
    }
  };
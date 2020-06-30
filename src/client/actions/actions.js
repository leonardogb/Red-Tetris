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

export const removeError = () => {
  return {
    type: types.REMOVE_ERROR
  }
};

export const setIsPlaying = (value) => {
  return {
    type: types.SET_IS_PLAYING,
    payload: {
        value: value
    }
  }
};

export const removeSpectre = (username) => {
  return {
    type: types.REMOVE_SPECTRE,
    payload: {
      username: username
    }
  }
};

export const setRoomOver = () => {
  return {
    type: types.SET_ROOM_OVER
  }
};

export const restartGame = () => {
  return {
    type: types.RESTART_GAME
  }
};

export const setIsMaster = (value) => {
  return {
    type: types.SET_IS_MASTER,
    payload: {
        value: value
    }
  }
};

export const setTimer = (timer) => {
  return {
    type: types.SET_TIMER,
    payload: {
        timer: timer
    }
  }
};

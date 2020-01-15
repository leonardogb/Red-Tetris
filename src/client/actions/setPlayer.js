export const SET_PLAYER = 'SET_PLAYER';

export const setPlayer = (piece) => {
  return {
    type: SET_PLAYER,
    payload: {
      piece: piece,
    }
  }
};

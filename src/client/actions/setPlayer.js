export const SET_PLAYER = 'SET_PLAYER';

export const setPlayer = (player) => {
  return {
    type: SET_PLAYER,
    payload: player
  }
};

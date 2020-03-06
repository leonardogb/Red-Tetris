export const SET_PLAYER = 'SET_PLAYER';

export const setPlayer = (player, room) => {
  return {
    type: SET_PLAYER,
    payload: {
      player: player,
      room: room
    }
  }
};

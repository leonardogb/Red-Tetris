export const UPDATE_BOARD = 'UPDATE_BOARD';

export const updateBoard = (room, player) => {
  return {
    type: UPDATE_BOARD,
    payload: {
      room: room,
      player: player
    }
  }
};

export const SET_ROOM = 'SET_ROOM';

export const setRoom = (player, room, games) => {
  return {
    type: SET_ROOM,
    payload: {
      player: player,
      room: room,
      games: games
    }
  }
};

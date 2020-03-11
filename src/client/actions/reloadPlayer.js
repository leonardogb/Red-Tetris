export const RELOAD_PLAYER = 'RELOAD_PLAYER';

export const reloadPlayer = (player, room, name) => {
  return {
    type: RELOAD_PLAYER,
    payload: {
        player: player,
        room: room,
        name: name
      }
  }
};

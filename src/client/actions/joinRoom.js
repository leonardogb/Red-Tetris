export const JOIN_ROOM = 'JOIN_ROOM';

export const joinRoom = (room) => {
  return {
    type: JOIN_ROOM,
    payload: {
      room: room
    }
  }
};

export const ADD_ROOMS = 'ADD_ROOMS';

export const addRooms = (rooms) => {
  return {
    type: ADD_ROOMS,
    payload: {
      rooms: rooms
    }
  }
};

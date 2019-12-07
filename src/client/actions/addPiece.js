export const ADD_PIECE = 'ADD_PIECE';

export const addPiece = (piece) => {
  return {
    type: ADD_PIECE,
    payload: piece
  }
};

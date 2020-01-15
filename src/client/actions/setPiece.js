export const SET_PIECE = 'SET_PIECE';

export const setPiece = ((piece) => {
  return {
    type: SET_PIECE,
    payload: {
      piece: piece
    }
  }
});

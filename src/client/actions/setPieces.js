export const SET_PIECES = 'SET_PIECES';

export const setPieces = ((pieces = null) => {
  return {
    type: SET_PIECES,
    payload: {
      pieces: pieces
    }
  }
});

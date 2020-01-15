export const PIECE_COLLIDED = 'PIECE_COLLIDED';

export const pieceCollided = (collided) => {
  return {
    type: PIECE_COLLIDED,
    payload: {
      collided: collided
    }
  }
};

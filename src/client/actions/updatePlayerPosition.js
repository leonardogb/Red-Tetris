export const UPDATE_PLAYER_POSITION = 'UPDATE_PLAYER_POSITION';

export const updatePlayerPosition = (posY, posX, collided) => {
  return {
    type: UPDATE_PLAYER_POSITION,
    payload: {
      y: posY,
      x: posX,
      collided: collided
    }
  }
};

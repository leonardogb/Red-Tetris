export const UPDATE_GAME = 'UPDATE_GAME';

export const updateGame = (game) => {
  return {
    type: UPDATE_GAME,
    payload: {
      game: game
    }
  }
};

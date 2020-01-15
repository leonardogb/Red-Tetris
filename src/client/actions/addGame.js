export const ADD_GAME = 'ADD_GAME';

export const addGame = (game) => {
  return {
    type: ADD_GAME,
    payload: {
      game: game
    }
  }
};

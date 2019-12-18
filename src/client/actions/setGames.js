export const SET_GAMES = 'SET_GAMES';

export const setGames = (games) => {
  return {
    type: SET_GAMES,
    payload: games
  }
};

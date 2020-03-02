export const SET_PLAYERS_GAMES = 'SET_PLAYERS_GAMES';

export const setPlayersGames = (games) => {
  return {
    type: SET_PLAYERS_GAMES,
    payload: {
      games: games
    }
  }
};

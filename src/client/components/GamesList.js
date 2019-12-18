import React from 'react';
import {Link} from 'react-router-dom';

const GamesList = ({games}) => {
  return (
    <div className={'gameListContainer'}>
      {games.map((game, index) => {
        return (
          <div key={index} className={'game'}>
            <Link to={'/' + game.room + '/' + game.players[0].user.name}>
              <h1 key={index}>{game.room}</h1>
              <div>
                {game.players.map((player, indexPlayer) => {
                  return (
                    <p key={indexPlayer}>{player.user.name}</p>
                  );
                })}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
    );
};

export default GamesList;

import React from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';

const GamesList = ({games, curUser}) => {
  return (
    <div className={'gameListContainer'}>
      {Object.keys(games).map((game, index) => {
        const userInGame = _.findKey(games[game].players, (elem) => {
          return elem.user.name === curUser;
        });
        return (
          <div key={index} className={'game'}>
            <Link to={userInGame ? '/' + games[game].room + '/' + curUser : '/joinRoom/' + games[game].room}>
              <h1 key={index}>{games[game].room}</h1>
              <div>
                {Object.keys(games[game].players).map((player, indexPlayer) => {
                  return (
                    <p key={indexPlayer}>{player}</p>
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

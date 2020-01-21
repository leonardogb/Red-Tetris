import React from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';

const GamesList = ({socket, games, curUser}) => {
  const joinGame = ((room, master) => {
    console.log('Room: ' + room, 'Master: ' + master);
    socket.emit('getRoom', {room: room});
  });
  return (
    <div className={'gameListContainer'}>
      {Object.keys(games).map((game, index) => {
        const userInGame = _.findKey(games[game].players, (elem) => {
          return elem.user.name === curUser;
        });
        const room = games[game].room;
        const master = games[game].master;
        return (
          <div key={index} className={'game'} onClick={() => joinGame(room, master)}>
            <h1 key={index}>{games[game].room}</h1>
            <div>
              {Object.keys(games[game].players).map((player, indexPlayer) => {
                return (
                  <p key={indexPlayer}>{player}</p>
                );
              })}
            </div>
          </div>
        )
      })}
    </div>
    );
};

export default GamesList;

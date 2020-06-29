import React from 'react';
import './GamesList.css';

const GamesList = ({socket, playersGames}) => {
  const joinGame = ((room) => {
    socket.emit('getRoom', {room: room});
  });
  return (
    <div className={'gameListContainer'}>
      {Object.keys(playersGames).map((game, index) => {
        console.log("game: ", game);
        return (
          <div key={index} className={'game'} onClick={() => joinGame(game)}>
            <h1 key={index}>{game}</h1>
            <div>
              {playersGames[game].map((player, index) => {
                console.log("player: ", player);
                return (<p key={index}>{player[0]}</p>);
              })}
            </div>
          </div>
        )
      })}
    </div>
    );
};

export default GamesList;

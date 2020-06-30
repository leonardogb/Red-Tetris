import React from 'react';
import './GamesList.css';

const GamesList = ({socket, playersGames}) => {
  const joinGame = ((room) => {
    socket.emit('getRoom', {room: room});
  });

  return (
    <div className={'gameListContainer'}>
      <h1>ROOMS</h1>
      <div className={'gamesContainer'}>
      {playersGames.map((game, index) => {
        return (
          <div key={index} className={ game.playing ? 'gamePlaying' : 'gameNotPlaying' } onClick={() => joinGame(game)}>
            <h1 key={index}>{game.room}</h1>
            <div>
              {game.players.map((player, index) => {
                return (<p key={index}>{player}</p>);
              })}
            </div>
          </div>
        )
      })}
      </div>
    </div>
    );
};

export default GamesList;

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const PlayersList = ({curRoom}) => {
    const socket = useSelector(store => store.socket);
    const playersGames = useSelector(store =>store.playersGames);

return (
    <div /*className={'gameListContainer'}*/>
      {playersGames ? Object.keys(playersGames).map((room, index) => {

        if (room == curRoom)
        return (
        //   <div key={index} className={'game'} onClick={() => joinGame(game)}>
            <div key={index} style={{backgroundColor: 'white'}}>
              <h1 key={index}>{room}</h1>
              <div style={{height: '215px', overflow: 'auto'}}>
                {playersGames[room].map((player, index) => {
                  
                  return (
                  <div key={index} style={{display: 'flex', justifyContent: 'space-between'}}>
                    <p>{player[0]}</p>
                    <p>{player[1]}</p>
                  </div>
                  );
                })}
              </div>
            </div>
        )
      }) : ""}
    </div>
    );
};

export default PlayersList;

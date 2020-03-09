import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const PlayersList = ({curRoom}) => {
    const socket = useSelector(store => store.socket);
    const playersGames = useSelector(store =>store.playersGames);

    console.log("curRoom: ", curRoom);
    console.log("player: ", playersGames);
    // console.log("playersGames: ", Object.keys(playersGames));

return (
    <div /*className={'gameListContainer'}*/>
      {playersGames ? Object.keys(playersGames).map((room, index) => {
        console.log("game: ", room);
        console.log("curRoom: ", curRoom);
        if (room == curRoom)
        return (
        //   <div key={index} className={'game'} onClick={() => joinGame(game)}>
            <div key={index}>
            <h1 key={index}>{room}</h1>
            <div>
              {playersGames[room].map((player, index) => {
                return (<p key={index}>{player}</p> );
              })}
            </div>
            </div>
        )
      }) : ""}
    </div>
    );
}

export default PlayersList;
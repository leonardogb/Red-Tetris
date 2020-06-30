import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Ring } from 'react-awesome-spinners';
import ToggleSwitch from '../components/ToggleSwitch';
import "../components/Spectres.css"

const Spectres = ({ socket, isPlaying, isMaster }) => {

  const [curRoom, curUser, spectres, playersGames] = useSelector(state => [state.curRoom, state.curUser, state.spectres, state.playersGames]);

  const [switchValue, setSwitchValue] = useState(true);

  const styleSquare = {
    width: '15px',
    height: '15px',
    textAlign: 'center',
    border: '1px solid #242e30',
  };
  const boardContent = {
    display: 'flex',
    justifyContent: 'space-around',
    width: '80%',
    margin: 'auto'
  }


  const setIsDestructible = () => {
    setSwitchValue(!switchValue);
    socket.emit('setIsDestructible', !switchValue);
  }

  if (isPlaying && spectres) {
    return (
      <div className="players-spectre" >
        {
          spectres.map((player, index) =>
            <div className="player-spectre" key={index}>
              <h3 style={{ textAlign: 'center' }}>{player.playerName}</h3>
              <h4>Score : {player.score}</h4>
              <div key={index}>
                {player.spectre.map((spectre, indexS) =>
                  <div className={'line'} key={indexS}>
                    {
                      spectre.map((square, indexSq) => (
                        <div key={indexSq} style={{ ...styleSquare, backgroundColor: square === 0 ? '#29393D' : '#99ff66' }} />
                      ))}
                  </div>
                )}
              </div>
            </div>
          )
        }
      </div>
    );
  }
  if (isPlaying == false) {

    let playersArray = undefined;

    if (playersGames) {
      Object.keys(playersGames).map((room, index) => {
        if (playersGames[room].room === curRoom && playersGames[room].players.length >= 2) {
          playersArray = playersGames[room].players;
        }
      });
    }
    if (playersArray) {
      return (
        <div>
          {
            isMaster &&
            <div>
              <ToggleSwitch
                isOn={switchValue}
                onColor="#41C83C"
                handleToggle={() => setIsDestructible()}
                id="react-switch-new"
              />
            </div>
          }
          <div className="playersList">
            {
              playersArray.map((player, index) => {
                if (player !== curUser) {
                  return (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p>{player}</p>
                    </div>
                  );
                }
              })
            }
          </div>
        </div>

      )
    }
    return (
      <div className="waiting-for-opponenets">
        <h4>Waiting for opponents</h4>
        <Ring />
      </div>
    );
  }
  if (!spectres) {
    return (
      <div className="no-opponents">
        <h4>No opponenets in this game</h4>
      </div>
    );
  }
};

export default Spectres;

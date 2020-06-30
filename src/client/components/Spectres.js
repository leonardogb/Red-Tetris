import React from 'react';
import { useSelector } from 'react-redux';
import { Ring } from 'react-awesome-spinners';
import "../components/Spectres.css"

const Spectres = ({isPlaying}) => {
  const spectres = useSelector(state => state.spectres);

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

  if (spectres) {
    return (
        <div className="players-spectre" >
          {
            spectres.map((player, index) =>
              <div className="player-spectre" key={index}>
                <h3 style={{ textAlign: 'center' }}>{ player.playerName }</h3>
                <h4>Score : {player.score}</h4>
                <div key={index}>
                  {player.spectre.map((spectre, indexS) =>
                    <div className={'line'} key={indexS}>
                      {
                        spectre.map((square, indexSq) => (
                          <div key={indexSq} style={{ ...styleSquare, backgroundColor: square === 0 ? '#29393D' : '#99ff66' }}/>
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

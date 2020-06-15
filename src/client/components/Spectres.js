import React from 'react';
import { useSelector } from 'react-redux';
import { Ring } from 'react-awesome-spinners';

const Spectres = () => {
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
      <div style={{ display: 'flex' }}>
        <div style={boardContent}>
          {
            spectres.map((player, index) =>
              <div key={index}>
                <p style={{ textAlign: 'center' }}>{ player.playerName }</p>
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
      </div>
    );
  }
  return (
    <div className="no-opponenets">
      <h4>Waiting for opponents</h4>
      <Ring />
      </div>
  );
};

export default Spectres;

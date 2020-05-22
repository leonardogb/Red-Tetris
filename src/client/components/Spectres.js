import React from 'react';
import { useSelector } from 'react-redux';

const Spectres = () => {
  const spectres = useSelector(state => state.spectres);
  const style = {
    width: '15px',
    height: '15px',
    textAlign: 'center',
    border: '1px solid #242e30',
  };

  if (spectres) {

    return (
      <div style={{ display: 'flex' }}>
        <div>
          {
            spectres.map((player, index) =>
              <div key={index}>
                <p style={{ textAlign: 'center' }}>{ player.playerName }</p>
                <div key={index}>
                  {player.spectre.map((spectre, indexS) =>
                    <div className={'line'} key={indexS}>
                      {
                        spectre.map((square, indexSq) => (
                          <div key={indexSq} style={{ ...style, backgroundColor: square === 0 ? '#29393D' : '#99ff66' }}/>
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
  return null;
};

export default Spectres;
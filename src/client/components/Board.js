import React from 'react';
import { useSelector } from 'react-redux';
import Square from './Square';

const Board = () => {
  const board = useSelector(store => store.player ? store.player.grid : null);

  return board ? (
    <div className='board'>
      {board.map((value, index) =>
      {
        if (index > 1) {
          return (
            <div key={index} className={'line line_' + index}>
              {value.map((sValue, sIndex) => <Square color={sValue[0]} key={sIndex} />)}
            </div>
          )
        } else {
          return null;
        }
      }
      )}
    </div>
  ) : null;
};

export default Board;

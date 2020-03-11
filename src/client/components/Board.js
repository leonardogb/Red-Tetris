import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Square from './Square';
import { useParams } from 'react-router-dom';

const Board = () => {
  const board = useSelector(store => store.player ? store.player.grid : null);
  const curUser = useSelector(store => store.curUser);
  const curRoom = useSelector(store => store.curRoom);
  const player = useSelector(store => store.player);
  useEffect(() => {
    if (!localStorage.getItem('login')) {
    localStorage.setItem('login', curUser);
    }
    if (!localStorage.getItem('room')) {
      localStorage.setItem('room', curRoom);
    }
  }, []);

  localStorage.setItem('player', JSON.stringify(player));

  return board ? (
    <div className='board'>
      {board.map((value, index) =>
        <div key={index} className={'line line_' + index}>
          {value.map((sValue, sIndex) => <Square color={sValue[0]} key={sIndex} />)}
        </div>
      )
      }
    </div>
  ) : null;
};

export default Board;

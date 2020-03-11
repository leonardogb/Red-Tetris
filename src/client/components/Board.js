import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Square from './Square';
import { useParams } from 'react-router-dom';


const Board = ({curUser, curRoom, player}) => {
  useEffect(() => {
    if (!localStorage.getItem('login')) {
    localStorage.setItem('login', curUser);
    }
    if (!localStorage.getItem('room')) {
      localStorage.setItem('room', curRoom);
    }
    // if (!localStorage.getItem('player')) {
    // }
    console.log("here!!!!!!!!!!!");
  }, []);

  localStorage.setItem('player', JSON.stringify(player));
  const board = useSelector(store => store.player ? store.player.grid : null);
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

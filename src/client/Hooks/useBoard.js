import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as types from '../actions/actionTypes';

export  const useBoard = () => {

  const dispatch = useDispatch();
  const player = useSelector(store => store.player);
  const socket = useSelector(state => state.socket);

  const updateStage = () => {
    dispatch({type: types.UPDATE_GRID})

    if (player.piece.new) {
      socket.emit('updateGrid', { grid: player.grid });
    }
  };
  useEffect(() => {
    updateStage();
  }, [player.piece]);
  return [updateStage];
};

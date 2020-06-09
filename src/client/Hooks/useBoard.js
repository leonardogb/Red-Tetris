import { useEffect } from 'react';
import { updateBoard } from '../actions/updateBoard';
import { useDispatch, useSelector } from 'react-redux';

export  const useBoard = () => {

  const dispatch = useDispatch();
  const player = useSelector(store => store.player);
  const socket = useSelector(state => state.socket);

  const updateStage = () => {
    dispatch(updateBoard());
    // socket.emit('updateGrid', { grid: player.grid });
    // if (player.piece.collided) {
    //   socket.emit('updateGrid', { grid: player.grid });
    // }
    if (player.piece.new) {
      socket.emit('updateGrid', { grid: player.grid });
    }
  };
  useEffect(() => {
    updateStage();
  }, [player.piece]);
  return [updateStage];
};

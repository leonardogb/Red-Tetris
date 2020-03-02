import {useEffect} from 'react';
import {updateBoard} from "../actions/updateBoard";
import {useDispatch, useSelector} from "react-redux";

export  const useBoard = () => {

  const dispatch = useDispatch();
  const player = useSelector(store => store.player);

  const updateStage = () => {
    dispatch(updateBoard());
  };
  useEffect(() => {
    updateStage();
  }, [player.piece]);
  return [updateStage];
};

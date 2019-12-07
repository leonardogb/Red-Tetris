import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Board from '../components/Board';
import { updatePlayerPosition } from '../actions/updatePlayerPosition';
import {setPlayer} from "../actions/setPlayer";
import {updateBoard} from "../actions/updateBoard";

const App = ({dispatch, message, socket}) => {
  useEffect(() => {
    window.addEventListener('keydown', keyDown);
  }, []);
  const keyDown = (event) => {
    if (event.keyCode === 39) {
      dispatch(updatePlayerPosition(null, 1));
    } else if (event.keyCode === 37) {
      dispatch(updatePlayerPosition(null, -1));
    } else if (event.keyCode === 40) {
      dispatch(updatePlayerPosition(1, null));
    }
  };

  const start = () => {

    socket.emit('getPiece', {action: 'test'});
    socket.on('getPiece2', (piece) => {
      dispatch(setPlayer(piece));
      dispatch(updateBoard());
    });
  };

  const [inputRoom, setInputRoom] = useState();

  const getRoom = () => {
    socket.emit('getRoom', {room: inputRoom})
  };

  return (
    <div>
      <span>{message}</span>
      Créer ou joindre une partie :
      <input type="text" name="room" onChange={() => setInputRoom(event.target.value)}/>
      <button onClick={() => getRoom()}>Envoyer</button>
      <Board></Board>
      <button onClick={() => start()} >Start</button>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    message: state.message
  }
};

export default connect(mapStateToProps, null)(App)

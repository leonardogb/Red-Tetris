import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Board from '../components/Board';
import { updatePlayerPosition } from '../actions/updatePlayerPosition';

const App = ({dispatch, message}) => {
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

  return (
    <div onKeyDown={e => keyDown(e)}>
      <span>{message}</span>
      <Board></Board>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    message: state.message
  }
};

export default connect(mapStateToProps, null)(App)

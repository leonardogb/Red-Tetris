import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Login from "../components/Login";
import { HashRouter, Route, Switch } from "react-router-dom";
import Footer from "../components/Footer";
import BoardGame from "../components/BoardGame";
import Error from '../components/Error';
import "./app.css";
import * as types from '../actions/actionTypes';
import * as action from '../actions/actions';

const App = () => {
  const [socket, player, curUser, games, curRoom, delay] = useSelector(store => [store.socket, store.player, store.curUser, store.games, store.curRoom, store.player.delay]);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit('updatePlayer', player);
    dispatch({type: types.UPDATE_GRID})

    if (player.piece.new) {
      socket.emit('updateGrid', { grid: player.grid });
    }
  }, [player.piece.tetromino, player.piece.pos]);

  useEffect(() => {
    if (player.pieces.length > 0 && player.piece.collided === true) {
      if (player.piece.pos.y < 1) {
        console.log('GAME OVER !!!');
        dispatch(action.setGameOver());
      } else {
        dispatch(action.updateTetromino());
      }
      if (player.pieces.length < 4) {
        socket.emit('getPiece');
      }
    }

  }, [player.piece.collided]);

  const removeError = () => {
    dispatch(action.removeError());
  };

  return (
    <div className="page-container">
      <div className="content-wrap">
        <div onClick={() => removeError()}>
          <Error />
        </div>

        <HashRouter hashType="noslash">
          <Switch>
            <Route exact path="/" render={() =>
              <Login player={player} socket={socket} />
            } />
            <Route exact path="/:room[:player]" render={() =>
             <BoardGame curRoom={curRoom} curUser={curUser} player={player} delay={delay} socket={socket}/>
            } />
          </Switch>
        </HashRouter>
      </div>
      <Footer />
    </div>
  );
};

export default App;

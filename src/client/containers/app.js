import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as action from '../actions/actions';
import { useBoard } from '../Hooks/useBoard';
import Login from "../components/Login";
import { HashRouter, Route, Switch } from "react-router-dom";
import Footer from "../components/Footer";
import BoardGame from "../components/BoardGame";
import Error from '../components/Error';
import "./app.css";

const App = () => {
  const [socket, player, curUser, games, curRoom, delay] = useSelector(store => [store.socket, store.player, store.curUser, store.games, store.curRoom, store.player.delay]);
  const dispatch = useDispatch();
  const [updateStage] = useBoard();
  // const [updatePlayerPos, pieceRotate, drop] = usePlayer();

  useEffect(() => {
    socket.emit('updatePlayer', player);
  }, [player, player.pieces, player.piece]);

  useEffect(() => {
    socket.on('connect', () => {
      let id = localStorage.getItem('id');
      if (id) {
        socket.emit('reloadPlayer', id);
      }
    });
  }, []);

  // useEffect(() => {
  //   console.log("gameOver: ", player.gameOver);
  //   if (player.gameOver === true) {
  //     player.isPlaying = false;
  //   }
  // }, [player.gameOver]);

  useEffect(() => {
    if (player.pieces.length > 0 && player.piece.collided === true) {
      if (player.piece.new && player.piece.pos.y < 1) {
        dispatch(action.setGameOver());
        // setDropTime(null);
      } else {
        // socket.emit('updateGrid', { grid: player.grid }); déjà fait dans useBoard if player.piece.new
        dispatch(action.updateTetromino());
      }
      if (player.pieces.length < 3) {
        socket.emit('getPiece');
      }
    }

  }, [player.piece.collided]);

  socket.on('setId', (id) => {
    localStorage.setItem('id', id);
  });

  socket.on('deleteId', () => {
    localStorage.removeItem('id');
  });

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
            <Route exact path="/" render={() => <div style={{ height: '100%' }} tabIndex={0}>
              <Login player={player} socket={socket} />
            </div>} />
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

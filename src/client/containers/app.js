import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGameOver } from "../actions/setGameOver";
import { useBoard } from '../Hooks/useBoard';
import Login from "../components/Login";
import { updateTetromino } from "../actions/updateTetromino";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Footer from "../components/Footer";
import BoardGame from "../components/BoardGame";
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

  useEffect(() => {
    console.log("gameOver: ", player.gameOver);
    if (player.gameOver === true) {
      player.isPlaying = false;
    }
  }, [player.gameOver]);

  useEffect(() => {
    if (player.pieces.length > 0 && player.piece.collided === true) {
      if (player.piece.pos.y < 1) {
        console.log('GAME OVER!!!');
        dispatch(setGameOver());
        // setDropTime(null);
      } else {
        // socket.emit('updateGrid', { grid: player.grid }); déjà fait dans useBoard if player.piece.new
        dispatch(updateTetromino());
      }
      if (player.pieces.length < 3) {
        socket.emit('getPiece');
      }
    }

  }, [player.piece.collided]);

  socket.on('setId', (id) => {
    localStorage.setItem('id', id);
  });

  socket.on('setIsplaying', () => {
    player.isPlaying = true;
  });

  socket.on('deleteId', () => {
    localStorage.removeItem('id');
  });

  useEffect(() => {
    socket.on('setMaster', (value) => {
      player.isMaster = value;
    })
  });

  return (
    <div className="page-container">
      <div className="content-wrap">
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

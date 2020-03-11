import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {checkCollision} from "../gameHelpers";
import {setGameOver} from "../actions/setGameOver";
import {usePlayer} from "../Hooks/usePlayer";
import {useBoard} from '../Hooks/useBoard';
import {useInterval} from "../Hooks/useInterval";
import {dropPlayer} from "../actions/dropPlayer";
import Login from "../components/Login";
import Board from "../components/Board";
import { Ring } from 'react-awesome-spinners';
import PlayersList from "../components/PlayersList";
import { reloadPlayer } from '../actions/reloadPlayer';
import {HashRouter, Route, Switch, Redirect} from "react-router-dom";
import NextPiece from "../components/NextPiece";
import {updateTetromino} from "../actions/updateTetromino";

const App = () => {
  const [socket, player, curUser, curGame, curRoom, delay] = useSelector(store => [store.socket, store.player, store.curUser, store.games, store.curRoom, store.player.delay]);
  const dispatch = useDispatch();
  const [updateStage] = useBoard();
  const [updatePlayerPos, pieceRotate] = usePlayer();
  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    socket.on('connect', () => {
      let storedPlayer = localStorage.getItem('player');
      let room = localStorage.getItem('room');
      let login = localStorage.getItem('login');
      if (storedPlayer && room && login) {
        socket.room = room;
        socket.username = login;
        socket.emit('reloadPlayer', JSON.parse(storedPlayer), room, login);
      }
    });
  }, []);

  useEffect(() => {
    if (player.pieces.length > 0 && player.piece.collided === true) {
      console.log('test');
      if (player.piece.pos.y < 1) {
        console.log('GAME OVER!!!');
        dispatch(setGameOver());
        // setDropTime(null);
      } else {
        dispatch(updateTetromino());
      }
    }

  }, [player.piece.collided]);

  const keyDown = (event) => {
    if (player && !player.gameOver) {
      if (event.keyCode === 32) {
        let tmpPiece = JSON.parse(JSON.stringify(player.piece));
        while (!checkCollision(tmpPiece, player.grid, { x: 0, y: 1 })) {
          tmpPiece.pos.y++;
        }
        updatePlayerPos(tmpPiece.pos.y - player.piece.pos.y, null, true);
        // Mejorar porque actualizo tablero cuando se actualiza la posición, pego la pieza y lo vuelvo a actualizar.
      } else if (event.keyCode === 39) {
        if (!checkCollision(player.piece, player.grid, { x: 1, y: 0 })) {
          updatePlayerPos(null, 1, false);
        }
      } else if (event.keyCode === 37) {
        if (!checkCollision(player.piece, player.grid, { x: -1, y: 0 })) {
          updatePlayerPos(null, -1, false);
        }
      } else if (event.keyCode === 40) {
        if (!checkCollision(player.piece, player.grid, { x: 0, y: 1 })) {
          updatePlayerPos(1, null, false);
        } else {
          if (player.piece.pos.y < 1) {
            console.log('GAME OVER!!!');
            dispatch(setGameOver());
            // setDropTime(null);
          } else {
            updatePlayerPos(null, null, true);
          }
          console.log('collided');
        }
      } else if (event.keyCode === 38) {
        pieceRotate(player.piece, player.grid, 1);
      }
      if (player.pieces.length < 3) {
        socket.emit('getPiece');
      }
      if (localStorage.getItem('login')) {
        // localStorage.setItem('player', JSON.stringify(player));
      }
    }
  };

  useInterval(() => {
    localStorage.setItem('player', JSON.stringify(player));

    if (!checkCollision(player.piece, player.grid, { x: 0, y: 1 })) {
      dispatch(dropPlayer());
    } else {
      if (player.piece.pos.y < 1) {
        console.log('GAME OVER!!!');
        dispatch(setGameOver());
        // setDropTime(null);
      } else {
        updatePlayerPos(null, null, true);
      }
      console.log('collided');
    }

  }, delay);

  const start = () => {
    socket.emit('start');
  };

  console.log('App component')
  const style = {
    gameContainer: {
      display: 'flex',
      justifyContent: 'space-around'
    },
    asideSection: {
      marginTop: '20px'
    }
  };

  return (
    <HashRouter hashType="noslash">
      <Switch>
        <Route exact path="/" >
          <div tabIndex={0} onKeyDown={(event) => keyDown(event)}>
            <Login />
          </div>
        </Route>
        <Route exact path="/:room[:player]" >
          <div tabIndex={0} onKeyDown={(event) => keyDown(event)}>
            <div>
              {curRoom ? (
                <div>
                  Player {curUser} in {curRoom} room.
                  <div style={style.gameContainer}>
                    <Board />
                    <div style={style.asideSection}>
                      <NextPiece/>
                      <PlayersList curRoom={curRoom}/>
                    </div>
                  </div>
                  {player.isMaster && showButton && <button onClick={(e) => {start(); setShowButton(!showButton)}} >Start</button>}
                </div>
              ) : <Redirect to="/" />
              }
            </div>
          </div>
        </Route>
      </Switch>
</HashRouter>
  );
};

export default App;

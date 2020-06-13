import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkCollision } from "../gameHelpers";
import { setGameOver } from "../actions/setGameOver";
import { usePlayer } from "../Hooks/usePlayer";
import { useBoard } from '../Hooks/useBoard';
import { useInterval } from "../Hooks/useInterval";
import Login from "../components/Login";
import Board from "../components/Board";
import { Ring } from 'react-awesome-spinners';
import Spectres from '../components/Spectres';
import PlayersList from "../components/PlayersList";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import NextPiece from "../components/NextPiece";
import { updateTetromino } from "../actions/updateTetromino";
import { swapPieces } from "../actions/swapPieces";
import ToggleSwitch from '../components/ToggleSwitch';
import Footer from "../components/Footer";
import "./app.css";

const App = () => {
  const [socket, player, curUser, games, curRoom, delay] = useSelector(store => [store.socket, store.player, store.curUser, store.games, store.curRoom, store.player.delay]);
  const dispatch = useDispatch();
  const [updateStage] = useBoard();
  const [updatePlayerPos, pieceRotate, drop] = usePlayer();
  const [switchValue, setSwitchValue] = useState(true);

  useEffect(() => {
    socket.emit('updatePlayer', player);
  }, [player, player.pieces, player.piece, player.piece.tetronimo, player.piece.pos]);

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

  const keyDown = (event) => {
    // event.preventDefault()
    // event.stopPropagation()
    if (player && !player.gameOver) {
      event.preventDefault()
      event.stopPropagation()
      if (event.keyCode === 32) {
        drop(true);
      } else if (event.keyCode === 39) {
        if (!checkCollision(player.piece, player.grid, { x: 1, y: 0 })) {
          updatePlayerPos(null, 1, false);
        }
      } else if (event.keyCode === 37) {
        if (!checkCollision(player.piece, player.grid, { x: -1, y: 0 })) {
          updatePlayerPos(null, -1, false);
        }
      } else if (event.keyCode === 40) {
        drop();
      } else if (event.keyCode === 38) {
        pieceRotate(player.piece, player.grid, 1);
      } else if (event.keyCode === 16) {
        dispatch(swapPieces());
      }
    }
  };

  useInterval(() => {
    drop();
  }, delay);

  const start = () => {
    socket.emit('start');
    player.isPlaying = true;
  };

  console.log('App component');
  const style = {
    gameContainer: {
      display: 'flex',
      justifyContent: 'space-around'
    },
    asideSection: {
      marginTop: '20px'
    }
  };

  const setIsDestructible = () => {
    setSwitchValue(!switchValue);
    socket.emit('setIsDestructible', !switchValue);
  }

  return (
    <div className="page-container">
      <div className="content-wrap">
        <HashRouter hashType="noslash">
          <Switch>
            <Route exact path="/" render={() => <div style={{ height: '100%' }} tabIndex={0}>
              <Login player={player} socket={socket} />
            </div>} />
            <Route exact path="/:room[:player]" render={() => <div style={{ height: '100%' }} tabIndex={0} onKeyDown={(event) => keyDown(event)}>
              <div>
                {curRoom ? (
                  <div>
                    Player {curUser} in {curRoom} room.
                    <div style={style.gameContainer}>
                      <Board />
                      <div style={style.asideSection}>
                        <NextPiece />
                        <PlayersList curRoom={curRoom} />
                      </div>
                    </div>
                    {
                      player.isMaster && !player.isPlaying && 
                      <div>
                        <ToggleSwitch
                          isOn={switchValue}
                          onColor="#41C83C"
                          handleToggle={() => setIsDestructible()}
                          id="react-switch-new"
                        />
                        <button onClick={(e) => {start()}} >Start</button>
                      </div>
                    }
                    <Spectres />
                  </div>
                ) : (localStorage.getItem('id') ? <Ring /> : <Redirect to="/" />)
                }
              </div>
            </div>} />
          </Switch>
        </HashRouter>
      </div>
      <Footer />
    </div>
  );
};

export default App;

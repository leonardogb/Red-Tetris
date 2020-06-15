import React, { useEffect, useState } from 'react';
import { Redirect } from "react-router-dom";
import Board from "../components/Board";
import { Ring } from 'react-awesome-spinners';
import Spectres from '../components/Spectres';
import NextPiece from "../components/NextPiece";
import ToggleSwitch from '../components/ToggleSwitch';
import { useInterval } from "../Hooks/useInterval";
import { usePlayer } from "../Hooks/usePlayer";
import { checkCollision } from "../gameHelpers";
import "./BoardGame.css";
import { useDispatch } from 'react-redux';
import * as action from '../actions/actions';

const BoardGame = ({ curRoom, curUser, player, delay, socket }) => {

  const [switchValue, setSwitchValue] = useState(true);
  const [updatePlayerPos, pieceRotate, drop] = usePlayer();
  const [buttonValue, setButtonValue] = useState(false);
  const dispatch = useDispatch();

  const setIsDestructible = () => {
    setSwitchValue(!switchValue);
    socket.emit('setIsDestructible', !switchValue);
  }

  useInterval(() => {
    drop();
  }, delay);

  const start = () => {
    socket.emit('start');
    player.isPlaying = true;
  };

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
        dispatch(action.swapPieces());
      }
    }
  };

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
    <div className="room" tabIndex={0} onKeyDown={(event) => keyDown(event)}>
      {/* <div className="board1"> */}
      {curRoom ? (
        <div className="room-board">
          <div className="room-name">
            <h1>{curRoom}</h1>
          </div>
          <div className="dash-board">
            {/* Player {curUser} in {curRoom} room. */}
            <div className="left-side">
              <div className="player">
                <h3>{curUser}</h3>
                <h4>Time</h4>
                <h4>Score : {player.score}</h4>
              </div>
              <div className="next-pieces">
                <h4>Next pieces</h4>
                <NextPiece />
              </div>
            </div>
            <div className="board-game">
              <Board />
            </div>
            {/* <PlayersList curRoom={curRoom} /> */}
            <div className="opponents">
            <h3>Opponents</h3>
            <div className="opponents-content">
              <Spectres />
            </div>
            </div>
          </div>
          {
            player.isMaster &&
            // !player.isPlaying &&
            <div>
              <ToggleSwitch
                isOn={switchValue}
                onColor="#41C83C"
                handleToggle={() => setIsDestructible()}
                id="react-switch-new"
              />
              <button disabled={player.isPlaying} onClick={(e) => { start(); }} >Start</button>
            </div>
          }
        </div>
      ) : (localStorage.getItem('id') ? <Ring /> : <Redirect to="/" />)
      }
      {/* </div> */}
    </div>
  )
}

export default BoardGame;

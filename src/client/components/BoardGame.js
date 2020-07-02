import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Board from '../components/Board';
import { Ring } from 'react-awesome-spinners';
import Spectres from '../components/Spectres';
import NextPiece from '../components/NextPiece';
import ToggleSwitch from '../components/ToggleSwitch';
import { useInterval } from '../Hooks/useInterval';
import { usePlayer } from '../Hooks/usePlayer';
import { checkCollision } from '../gameHelpers';
import './BoardGame.css';
import { useDispatch, useSelector } from 'react-redux';
import * as action from '../actions/actions';

const BoardGame = ({ curRoom, curUser, player, delay, socket }) => {

  const [updatePlayerPos, pieceRotate, drop] = usePlayer();
  const dispatch = useDispatch();
  let totalSeconds = 0;
  const [secondsValue, setSecondsValue] = useState('00');
  const [minutesValue, setMinutesValue] = useState('00');
  const [hoursValue, setHoursValue] = useState('00');
  const timer = useSelector(state => state.player.timer);
  const [dialogValue, setDialogValue] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    socket.on('dialog', (data) => {
      if (mounted) {
        setDialogValue(data.message);
      }
    });
    socket.on('setIsMaster', (value) => {
      dispatch(action.setIsMaster(value));
    })
    return () => mounted = false;
  }, []);

  useEffect(() => {
    if (!player.roomOver && player.gameOver) {
      dispatch(action.setIsPlaying(false));
      socket.emit('gameOver', player);
      clearInterval(timer);
      dispatch(action.setTimer(null));
    }
  }, [player.gameOver]);

  const reInitTime = () => {
    setSecondsValue('00');
    setMinutesValue('00');
    setHoursValue('00');
  }

  useInterval(() => {
    drop();
  }, delay);

  const play = () => {
    socket.emit('play');
    dispatch(action.setIsPlaying(true));
  };

  const replay = () => {
    socket.emit('replay');
    dispatch(action.setIsPlaying(true));
  }

  const keyUp = (event) => {
    if (player && !player.gameOver) {
      event.preventDefault()
      event.stopPropagation()
      if (event.keyCode === 32) {
        drop(true);
      }
      else if (event.keyCode === 39) {
        if (!checkCollision(player.piece, player.grid, { x: 1, y: 0 })) {
          updatePlayerPos(null, 1, false);
        }
      }
      else if (event.keyCode === 37) {
        if (!checkCollision(player.piece, player.grid, { x: -1, y: 0 })) {
          updatePlayerPos(null, -1, false);
        }
      }
      else if (event.keyCode === 40) {
        drop();
      }
      else if (event.keyCode === 38) {
        pieceRotate(player.piece, player.grid, 1);
      }
      else if (event.keyCode === 16) {
        dispatch(action.swapPieces());
      }
    }
  };

  const pad = (val) => {
    const valString = String(val);
    if (valString.length < 2) {
      return `0${ valString}`;
    }
    return valString;

  }

  const setTime = () => {
      ++totalSeconds;
      let hour = pad(Math.floor(totalSeconds / 3600));
      let minute = pad(Math.floor((totalSeconds - hour * 3600) / 60));
      let seconds = pad(totalSeconds - (hour * 3600 + minute * 60));
      setHoursValue(hour);
      setMinutesValue(minute);
      setSecondsValue(seconds);
  };

  useEffect(() => {
    if (player.isPlaying) {
      reInitTime();
      dispatch(action.setTimer(setInterval(setTime, 1000)));
      setDialogValue(undefined);
    }
    else if (timer) {
      clearInterval(timer);
      totalSeconds = 0;
    }
  }, [player.isPlaying]);

  return (
    <div className='room' onKeyUp={(event) => keyUp(event)} tabIndex={0}>
      {curRoom ? (
        <div className="board-game1">
        <div className="room-board">
          <div className="room-name">
            <h1>{curRoom}</h1>
          </div>
          <div className={"dash-board"}>
            <div className="left-side">
              <div className="player">
                <h3>{curUser}</h3>
                <h4>Time: {hoursValue}
                  {":"}
                  {minutesValue}
                  {":"}
                  {secondsValue}</h4>
                <h4>Score: {player.score}</h4>
              </div>
              <div className="next-pieces">
                <h4>Next pieces</h4>
                <NextPiece />
              </div>
              {
                player.isMaster &&
                <div className="start-button">
                  <button disabled={(player.isMaster && !player.isPlaying && !player.gameOver || player.isMaster && player.roomOver) ? false : true} onClick={(e) => {
                    if (!player.gameOver && !player.isPlaying) {
                      play();
                    }
                    else {
                      replay();
                    }
                  }} >{!player.gameOver && !player.isPlaying ? "Play" : "Replay"}</button>
                </div>
              }
          </div>
            <div className="board-game">
              <Board />
            </div>
            <div className="opponents">
              <h3>Opponents</h3>
              <div className="opponents-content">
                <Spectres socket={socket} isPlaying={player.isPlaying} isMaster={player.isMaster} />
              </div>
            </div>
          </div>
        </div>
        {
          dialogValue &&
          <div className="dialog">
            <h4>{dialogValue}</h4>
            <button onClick={(e) => { setDialogValue(undefined) }}>OK</button>
          </div>
        }
      </div>
      ) : <Redirect to='/' />
      }
    </div>
  )
}

export default BoardGame;

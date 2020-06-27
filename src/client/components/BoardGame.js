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

  // const [player] = useSelector(store => [store.player]);
  const [switchValue, setSwitchValue] = useState(true);
  const [updatePlayerPos, pieceRotate, drop] = usePlayer();
  const dispatch = useDispatch();
  let totalSeconds = 0;
  const [secondsValue, setSecondsValue] = useState('00');
  const [minutesValue, setMinutesValue] = useState('00');
  const [hoursValue, setHoursValue] = useState('00');
  const [timeoutRefValue, setTimeoutRef] = useState(undefined);

  // socket.on('game', () => {
  //   console.log('loser !!!!!');
  // });

  socket.on('loser', () => {
    console.log('loser !!!!!');
  });

  socket.on('winner', () => {
    console.log('winner !!!!!');
  });

  useEffect(() => {
    if (player.gameOver) {
      // player.isPlaying = false;
      dispatch(action.setIsPlaying(false));
      socket.emit('gameOver', player);
      clearInterval(timeoutRefValue);
    }
  }, [player.gameOver]);

  useEffect(() => {
    socket.on('setIsMaster', (value) => {
      dispatch(action.setIsMaster(value));

      // player.isMaster = value;
    })
  });

  const reInitTime = () => {
    setSecondsValue('00');
    setMinutesValue('00');
    setHoursValue('00');
  }

  const setIsDestructible = () => {
    setSwitchValue(!switchValue);
    socket.emit('setIsDestructible', !switchValue);
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
    // event.preventDefault()
    // event.stopPropagation()
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

  const style = {
    gameContainer: {
      display: 'flex',
      justifyContent: 'space-around',
    },
    asideSection: {
      marginTop: '20px',
    },
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
    const hour = pad(Math.floor(totalSeconds / 3600));
    const minute = pad(Math.floor((totalSeconds - hour * 3600) / 60));
    const seconds = pad(totalSeconds - (hour * 3600 + minute * 60));
    setHoursValue(hour);
    setMinutesValue(minute);
    setSecondsValue(seconds);
  };

  return (
    <div className='room' onKeyUp={(event) => keyUp(event)} tabIndex={0}>
      {curRoom ? (
        <div className='room-board'>
          <div className='room-name'>
            <h1>{curRoom}</h1>
          </div>
          <div className={'dash-board'}>
            <div className='left-side'>
              <div className='player'>
                <h3>{curUser}</h3>
                <h4>Time: {hoursValue}
                  {':'}
                  {minutesValue}
                  {':'}
                  {secondsValue}</h4>
                <h4>Score: {player.score}</h4>
              </div>
              <div className='next-pieces'>
                <h4>Next pieces</h4>
                <NextPiece />
              </div>
              {
                player.isMaster &&
                <div className='start-button'>
                  <button disabled={!(player.isMaster && !player.isPlaying && !player.gameOver || player.isMaster && player.roomOver)} onClick={(e) => {
                    if (!player.gameOver && !player.isPlaying) {
                      play();
                    }
                    else {
                      replay();
                    }
                    if (setTimeoutRef) {
                      reInitTime();
                      clearInterval(timeoutRefValue);
                      totalSeconds = 0;
                    }
                    setTimeoutRef(setInterval(setTime, 1000));
                  }} >{!player.gameOver && !player.isPlaying ? 'Play' : 'Replay'}</button>
                </div>
              }
              }
            </div>
            <div className='board-game'>
              <Board />
            </div>
            {/* <PlayersList curRoom={curRoom} /> */}
            <div className='opponents'>
              <h3>Opponents</h3>
              <div className='opponents-content'>
                <Spectres isPlaying={player.isPlaying} />
              </div>
            </div>
          </div>
          {

            // player.isMaster &&
            // // !player.isPlaying &&
            // <div>
            //   <ToggleSwitch
            //     isOn={switchValue}
            //     onColor="#41C83C"
            //     handleToggle={() => setIsDestructible()}
            //     id="react-switch-new"
            //   />
            //   {/* <button disabled={player.isPlaying} onClick={(e) => { start(); setInterval(setTime, 1000); }} >Start</button> */}
            // </div>
          }
        </div>
      ) : (localStorage.getItem('id') ?
        <div className='please-wait'>
          <h3>Please wait</h3>
          <Ring />
        </div> :
        <Redirect to='/' />)
      }
    </div>
  )
}

export default BoardGame;

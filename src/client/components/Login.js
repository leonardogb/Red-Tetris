import React, { useState, useEffect } from 'react';
import GamesList from './GamesList';
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../actions/actions';
import { isEmpty } from "../gameHelpers";
import './Login.css';

const Login = () => {
  const [socket, curUser, playersGames, player] = useSelector(store => [store.socket, store.curUser, store.playersGames, store.player]);
  const [inputUsername, setInputUsername] = useState('');
  const [inputRoom, setInputRoom] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (player && player.name) {
      socket.emit('removePlayer');
    }

    socket.on('connect', () => {
      socket.emit('setPlayerGames');
    });

  }, []);

  if (player && player.delay != null) {
    dispatch(action.setDelay(null));
  }

  const getGame = () => {
    if (inputUsername.length > 0 && inputRoom.length > 0) {
      socket.emit('getGame', { username: inputUsername, room: inputRoom });
      socket.on('redirect', (data) => {
        location.hash = data.to;
      });
    }
  };


  return (
      <div className="login-page">
        {
          isEmpty(playersGames) === false &&
          <GamesList playersGames={playersGames} socket={socket} />
        }
        <div className="loginBox">
          <div>
            <h1>Login</h1>
            <div>
              <div className="inputLoginContainer">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter name"
                  className="inputLogin"
                  onChange={() => setInputUsername(event.target.value)}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) {
                      getGame();
                    }
                  }} />
              </div>
              <div className="inputLoginContainer">
                <input
                  type="text"
                  name="room"
                  placeholder="Enter or join room"
                  className="inputLogin"
                  onChange={() => setInputRoom(event.target.value)}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) {
                      getGame();
                    }
                  }} />
              </div>
            </div>
            <div style={{ textAlign: 'center'}}>
              <button className="buttonLogin" onClick={() => getGame()} >Start</button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;

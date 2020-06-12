import React, { useState } from 'react';
import GamesList from "./GamesList";
import { useSelector, useDispatch } from "react-redux";
import { setDelay } from '../actions/setDelay';
import { Button } from 'evergreen-ui'
import { TextInput } from 'evergreen-ui'
import { TextInputField } from 'evergreen-ui'
import { Icon } from 'evergreen-ui'
import './Login.css';

const Login = () => {
  const [socket, curUser, playersGames, player] = useSelector(store => [store.socket, store.curUser, store.playersGames, store.player]);
  const [inputUsername, setInputUsername] = useState('');
  const [inputRoom, setInputRoom] = useState('');
  const dispatch = useDispatch();

  if (player && player.delay != null) {
    dispatch(setDelay(null));
    let id = localStorage.getItem('id');
    if (id) {
      socket.emit('removePlayer', id, player.room);
      localStorage.removeItem('id');
    }
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
    <div style={{ height: '100%' }}>
      {/* <div className="Credentials"> */}
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GamesList playersGames={playersGames} socket={socket} />
        <div className="loginBox">
          <div>
            <h1>Login</h1>
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                <TextInput
                  type="text"
                  name="username"
                  placeholder="Enter name"
                  onChange={() => setInputUsername(event.target.value)}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) {
                      getGame();
                    }
                  }} />
              </div>
              <TextInput
                marginBottom={16}
                type="text"
                name="room"
                placeholder="Enter or join room"
                // placeholder="Créer ou joindre une partie"
                onChange={() => setInputRoom(event.target.value)}
                onKeyPress={(e) => {
                  if (e.charCode === 13) {
                    getGame();
                  }
                }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button  marginRight={16} onClick={() => getGame()}>Start</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

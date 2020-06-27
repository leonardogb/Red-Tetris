import React, { useState } from 'react';
import GamesList from './GamesList';
import { useSelector, useDispatch } from 'react-redux';
import * as action from '../actions/actions';
import './Login.css';

const Login = () => {
  const [socket, curUser, playersGames, player] = useSelector(store => [store.socket, store.curUser, store.playersGames, store.player]);
  const [inputUsername, setInputUsername] = useState('');
  const [inputRoom, setInputRoom] = useState('');
  const dispatch = useDispatch();

  socket.on('redirect', (data) => {
    location.hash = data.to;
  });

  if (player && player.delay !== null) {
    dispatch(action.setDelay(null));
    const id = localStorage.getItem('id');
    if (id) {
      socket.emit('removePlayer', id, player.room);
      localStorage.removeItem('id');
    }
  }

  const getGame = () => {
    if (inputUsername.length > 0 && inputRoom.length > 0) {
      socket.emit('getGame', { username: inputUsername, room: inputRoom });
    }
  };

  return (
    <div style={{ height: '100%' }}>
      {/* <div className="Credentials"> */}
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GamesList playersGames={playersGames} socket={socket} />
        <div className='loginBox'>
          <div>
            <h1>Login</h1>
            <div>
              <div className='inputLoginContainer'>
                <input
                  className='inputLogin'
                  name='username'
                  onChange={() => setInputUsername(event.target.value)}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) {
                      getGame();
                    }
                  }}
                  placeholder='Enter name'
                  type='text' />
              </div>
              <div className='inputLoginContainer'>
                <input
                  className='inputLogin'
                  name='room'
                  onChange={() => setInputRoom(event.target.value)}
                  onKeyPress={(e) => {
                    if (e.charCode === 13) {
                      getGame();
                    }
                  }}
                  placeholder='Enter or join room'
                  type='text' />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className='buttonLogin' onClick={() => getGame()} >Start</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

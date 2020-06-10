import React, {useState} from 'react';
import GamesList from "./GamesList";
import {useSelector, useDispatch} from "react-redux";
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

  if (player && player.delay != null)
  {
    dispatch(setDelay(null));
      let id = localStorage.getItem('id');
      if (id) {
        socket.emit('removePlayer', id, player.room);
        localStorage.removeItem('id');
      }
  }
  // localStorage.removeItem('id');
  const getGame = () => {
    if (inputUsername.length > 0 && inputRoom.length > 0) {
      socket.emit('getGame', {username: inputUsername, room: inputRoom});
      socket.on('redirect', (data) => {
        location.hash = data.to;
      });
    }
  };

  return (
    <div style={{ height: '100%' }}>
      {/* <div className="Credentials"> */}
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ height: '100px', width: '200px' }}>
          <div>
            <GamesList playersGames={playersGames} socket={socket} />
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#f3f7f8', width: '20%' }}>
                  <div style={{height: '32px'}}>
                  <Icon icon="user" size={28}/>
                  </div>
                </div>
                <TextInput
                  // marginBottom={0}
                  // marginRight={0}
                  // marginTop={0}
                  // height={'200%'}
                  height={'32px'}
                  width={'80%'}
                  type="text"
                  name="username"
                  placeholder="Login"
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
                placeholder="Créer ou joindre une partie"
                onChange={() => setInputRoom(event.target.value)}
                onKeyPress={(e) => {
                  if (e.charCode === 13) {
                    getGame();
                  }
                }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <Button marginBottom={16} marginRight={16} onClick={() => getGame()}>Envoyer</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

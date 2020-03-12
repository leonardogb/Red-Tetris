import React, {useState} from 'react';
import GamesList from "./GamesList";
import {useSelector, useDispatch} from "react-redux";
import { setDelay } from '../actions/setDelay';

const Login = ({player}) => {
  const [socket, curUser, playersGames, curRoom] = useSelector(store => [store.socket, store.curUser, store.playersGames, store.curRoom]);
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
    <div>
        <div>
          <div>
            <div>
              {curUser}
            </div>
            <GamesList playersGames={playersGames} socket={socket} />
            <div>
              <p>Login :</p>
              <input type="text" name="username" onChange={() => setInputUsername(event.target.value)} onKeyPress={(e) => {
                if (e.charCode === 13) {
                  getGame();
                }
              }} />
              <p>Créer ou joindre une partie :</p>
              <input type="text" name="room" onChange={() => setInputRoom(event.target.value)} onKeyPress={(e) => {
                if (e.charCode === 13) {
                  getGame();
                }
              }} />
            </div>
          </div>
          <div>
            <button onClick={() => getGame()}>Envoyer</button>
          </div>
        </div>
    </div>
  );
};

export default Login;

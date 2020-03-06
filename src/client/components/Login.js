import React, {useState} from 'react';
import GamesList from "./GamesList";
import {useSelector} from "react-redux";

const Login = () => {
  const [socket, curUser, playersGames] = useSelector(store => [store.socket, store.curUser, store.playersGames]);
  const [inputUsername, setInputUsername] = useState('');
  const [inputRoom, setInputRoom] = useState('');

  const sendUsername = () => {
    socket.emit('setUsername', { username: inputUsername });
  };

  const getRoom = () => {
    socket.emit('getRoom', { room: inputRoom });
  };

  const getGame = () => {
    socket.emit('getGame', {username: inputUsername, room: inputRoom})
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

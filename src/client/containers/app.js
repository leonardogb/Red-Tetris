import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route,  HashRouter, withRouter } from 'react-router-dom';
import Board from '../components/Board';
import GamesList from '../components/GamesList';
import { updatePlayerPosition } from '../actions/updatePlayerPosition';
import {setPlayer} from "../actions/setPlayer";
import {updateBoard} from "../actions/updateBoard";
import { addRoom } from "../actions/addRoom";
import { setUsername } from "../actions/setUsername";
import {setGames} from "../actions/setGames";

const App = ({dispatch, message, socket, curGame, curUser, games}) => {
  useEffect(() => {
    window.addEventListener('keydown', keyDown);

    socket.on('setRoom', (data) => {
      dispatch(addRoom(data.room));
      location.hash = data.room.room + '/' + data.username;
    });

    socket.on('setUsername', (data) => {
      if (data.status) {
        dispatch(setUsername(data.username));
        socket.emit('getGames');
      }
    });

    socket.on('setGames', (data) => {
      if (data.status) {
        dispatch(setGames(data.games));
      }
    });

  }, []);

  const keyDown = (event) => {
    if (event.keyCode === 39) {
      dispatch(updatePlayerPosition(null, 1));
    } else if (event.keyCode === 37) {
      dispatch(updatePlayerPosition(null, -1));
    } else if (event.keyCode === 40) {
      dispatch(updatePlayerPosition(1, null));
    }
  };

  const start = () => {

    socket.emit('getPiece', {action: 'test'});
    socket.on('setPiece', (piece) => {
      dispatch(setPlayer(piece));
      dispatch(updateBoard());
    });
  };

  const [inputRoom, setInputRoom] = useState();
  const [inputUsername, setInputUsername] = useState();

  const getRoom = () => {
    socket.emit('getRoom', {room: inputRoom});
  };

  const sendUsername = () => {
    socket.emit('sendUsername', {username: inputUsername});
  };
  return (
      <HashRouter hashType={'noslash'}>
        <div>
          <span>{message}</span>
        </div>
        <Route exact path="/">
          <div>
            {curUser && curUser.name ? (
              <div>
                <div>
                  <div>
                    {curUser.name}
                  </div>
                  <GamesList games={games}/>
                  Créer ou joindre une partie :
                  <input type="text" name="room" onChange={() => setInputRoom(event.target.value)} onKeyPress={(e) => {
                    if (e.charCode === 13) {
                      getRoom();
                    }
                  }}/>
                </div>
                <div>
                  <button onClick={() => getRoom()}>Envoyer</button>
                </div>
              </div>
            ) : (
              <div>
                Login :
                <input type="text" name="username" onChange={() => setInputUsername(event.target.value)} onKeyPress={(e) => {
                  if (e.charCode === 13) {
                    sendUsername();
                  }
                }}/>
                <button onClick={() => sendUsername()}>Envoyer</button>
              </div>
            )}
          </div>
        </Route>
        <Route path="/:room/:player">
          <div>
            Player {curUser && curUser.name} in {curGame} room.
            <Board></Board>
            <button onClick={() => start()} >Start</button>
          </div>
        </Route>
      </HashRouter>
  )
};

const mapStateToProps = (state) => {
  return {
    message: state.message,
    curGame: state.curGame,
    curUser: state.curUser,
    games: state.games
  }
};

export default connect(mapStateToProps, null)(App)

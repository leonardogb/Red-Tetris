import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, HashRouter, withRouter } from 'react-router-dom';
import Board from '../components/Board';
import GamesList from '../components/GamesList';
import { updatePlayerPosition } from '../actions/updatePlayerPosition';
// import {updateBoard} from "../actions/updateBoard";
import { addRoom } from "../actions/addRoom";
import { joinRoom } from '../actions/joinRoom';
import { setUsername } from "../actions/setUsername";
import {setGames} from "../actions/setGames";
import {checkCollision} from "../gameHelpers";
import {pieceCollided} from "../actions/pieceCollided";
import {setPieces} from "../actions/setPieces";
import {setGameOver} from "../actions/setGameOver";
import {updateGame} from "../actions/updateGame";
import {setRoom} from "../actions/setRoom";
import {setPlayersGames} from "../actions/setPlayersGames";
import {setPiece} from "../actions/setPiece";
import {updateTetromino} from "../actions/updateTetromino";
import {usePlayer} from "../Hooks/usePlayer";
import {useBoard} from '../Hooks/useBoard';
import {useInterval} from "../Hooks/useInterval";
import {dropPlayer} from "../actions/dropPlayer";
import {setDelay} from "../actions/setDelay";
import { Ring } from 'react-awesome-spinners';
import {setCurRoom} from "../actions/setCurRoom";

const App = () => {
  const [socket, player, curUser, curGame, curRoom, games, playersGames, delay] = useSelector(store => [store.socket, store.player, store.curUser, store.curGame, store.curRoom, store.games, store.playersGames, store.player.delay]);
  const dispatch = useDispatch();
  const [updatePlayerPos, pieceRotate] = usePlayer();
  const [updateStage] = useBoard();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // window.addEventListener('keydown', keyDown);

    // socket.on('setRoom', (data) => {
    //   if (data.status === 'NEW_ROOM') {
    //     dispatch(addRoom(data.room));
    //   } else if (data.status === 'JOIN_ROOM') {
    //     dispatch(joinRoom(data.room));
    //   }
    //
    //   location.hash = data.room.room + '/' + data.room.master;
    // });
    socket.on('setRoom', (data) => {
      dispatch(setRoom(data.player, data.room, data.games));
      location.hash = data.room + '[' + data.player.name + ']';
    });

    socket.on('setUsername', (data) => {
      dispatch(setUsername(data.username));
      socket.emit('getGames');
    });

    socket.on('setGames', (data) => {
      if (data.status) {
        dispatch(setGames(data.games));
      }
    });

    socket.on('updateGames', (data) => {
      console.log('updateGames');
      dispatch(updateGame(data));
    });

    socket.on('setPlayersGames', (data) => {
      dispatch(setPlayersGames(data));
    });

    socket.on('setPieces', (data) => {
      dispatch(setPieces(data));
    });
  }, []);


  const keyDown = (event) => {
    if (player && !player.gameOver) {
      if (event.keyCode === 32) {
        let tmpPiece = JSON.parse(JSON.stringify(player.piece));
        while (!checkCollision(tmpPiece, player.grid, { x: 0, y: 1 })) {
          tmpPiece.pos.y++;
        }
        updatePlayerPos(tmpPiece.pos.y - player.piece.pos.y, null, true);
        // Mejorar porque actualizo tablero cuando se actualiza la posición, pego la pieza y lo vuelvo a actualizar.
      } else if (event.keyCode === 39) {
        if (!checkCollision(player.piece, player.grid, { x: 1, y: 0 })) {
          updatePlayerPos(null, 1, false);
        }
      } else if (event.keyCode === 37) {
        if (!checkCollision(player.piece, player.grid, { x: -1, y: 0 })) {
          updatePlayerPos(null, -1, false);
        }
      } else if (event.keyCode === 40) {
        if (!checkCollision(player.piece, player.grid, { x: 0, y: 1 })) {
          updatePlayerPos(1, null, false);
        } else {
          if (player.piece.pos.y < 1) {
            console.log('GAME OVER!!!');
            dispatch(setGameOver());
            // setDropTime(null);
          } else {
            updatePlayerPos(null, null, true);
          }
          console.log('collided');
        }
      } else if (event.keyCode === 38) {
        pieceRotate(player.piece, player.grid, 1);
      }
      if (player.pieces.length < 3) {
        socket.emit('getPiece');
      }
    }
  };

  useInterval(() => {
    dispatch(dropPlayer());
  }, delay);

  const start = () => {
    socket.emit('start');
    socket.on('startGame', (data) => {
      dispatch(setPieces(data));
      dispatch(updateTetromino());
      dispatch(setDelay(1000));

      // const iv = setInterval(() => {
      //     updatePlayerPos(1, null, false);
      // }, 1000);


    });

  };

  const [inputRoom, setInputRoom] = useState();
  const [inputUsername, setInputUsername] = useState();

  const getRoom = () => {
    socket.emit('getRoom', { room: inputRoom });
  };

  const sendUsername = () => {
    socket.emit('setUsername', { username: inputUsername });
  };

  const checkRoom = () => {
    socket.emit('getRoom', {})
  };

  const checkUrl = (data) => {
    return new Promise((resolve, reject) => {
      console.log("client sending message");
      socket.emit('checkUrl', data, (response) => {
        console.log("client got ack response", response);
        resolve(response);
      });
    });
  }

  const found = window.location.href.split('/')[3].match(/^#([a-z1-9]+)\[([a-z1-9]+)\]$/);

  console.log("Found: " + found);
  if (found === null) {
    console.log("HOME");
    return (
      <div tabIndex={0} onKeyDown={(event) => keyDown(event)}>
        <div>
          {curUser ? (
            <div>
              <div>
                <div>
                  {curUser.name}
                </div>
                <GamesList playersGames={playersGames} socket={socket} />
                Créer ou joindre une partie :
                    <input type="text" name="room" onChange={() => setInputRoom(event.target.value)} onKeyPress={(e) => {
                  if (e.charCode === 13) {
                    getRoom();
                  }
                }} />
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
                }} />
                <button onClick={() => sendUsername()}>Envoyer</button>
              </div>
            )}
        </div>
      </div>
    )
  }
  else {
    if (curRoom === null) {
      checkUrl({ room: found[1], player: found[2] }).then(message => {
        console.log("response from checkUrl(): ", message);
        dispatch(setCurRoom());
      });
    }

    return (
      <div tabIndex={0} onKeyDown={(event) => keyDown(event)}>
        <div>
          {curRoom ? (

            <div>
              Player {curUser} in {curGame} room.
              <Board data={{ room: found[1], player: found[2] }} />
              <button onClick={() => start()} >Start</button>
            </div>
          ) : (loading && <Ring />)
          }
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    socket: state.socket,
    message: state.message,
    curGame: state.curGame,
    curUser: state.curUser,
    games: state.games,
    player: state.player,
    playersGames: state.playersGames
  }
};

export default App;

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route,  HashRouter, withRouter } from 'react-router-dom';
import Board from '../components/Board';
import GamesList from '../components/GamesList';
import { updatePlayerPosition } from '../actions/updatePlayerPosition';
import {updateBoard} from "../actions/updateBoard";
import { addRoom } from "../actions/addRoom";
import { joinRoom } from '../actions/joinRoom';
import { setUsername } from "../actions/setUsername";
import {setGames} from "../actions/setGames";
import {checkCollision} from "../gameHelpers";
import {pieceCollided} from "../actions/pieceCollided";
import {setPiece} from "../actions/setPiece";
import {setGameOver} from "../actions/setGameOver";
import RoomValidation from "../components/RoomValidation";

const App = ({dispatch, message, socket, curGame, curUser, games, player}) => {
  useEffect(() => {
    // window.addEventListener('keydown', keyDown);

    socket.on('setRoom', (data) => {
      if (data.status === 'NEW_ROOM') {
        dispatch(addRoom(data.room));
      } else if (data.status === 'JOIN_ROOM') {
        dispatch(joinRoom(data.room));
      }

      location.hash = data.room.room + '/' + data.room.master;
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
    if (player && !player.game.gameOver) {
      if (event.keyCode === 32) {
        let tmpPiece = JSON.parse(JSON.stringify(player.game.piece));
        // let tmpPiece = Object.assign({}, player.game.piece);
        // let tmpPiece = {...player.game.piece};
        while (!checkCollision(tmpPiece, player.game.grid, {x : 0, y: 1})) {
          tmpPiece.pos.y++;
        }
        dispatch(updatePlayerPosition(tmpPiece.pos.y - player.game.piece.pos.y, null));
        dispatch(pieceCollided(true));
        dispatch(updateBoard());
        if (!player.game.gameOver) {
          socket.emit('getPiece');
        }
        // Mejorar porque actualizo tablero cuando se actualiza la posición, pego la pieza y lo vuelvo a actualizar.
      } else if (event.keyCode === 39) {
        if (!checkCollision(player.game.piece, player.game.grid, {x: 1, y: 0})) {
          dispatch(updatePlayerPosition(null, 1));
        }
      } else if (event.keyCode === 37) {
        if (!checkCollision(player.game.piece, player.game.grid, {x: -1, y: 0})) {
          dispatch(updatePlayerPosition(null, -1));
        }
      } else if (event.keyCode === 40) {
        if (!checkCollision(player.game.piece, player.game.grid, {x: 0, y: 1})) {
          dispatch(updatePlayerPosition(1, null));
        } else {
          console.log(player.game.piece.pos.y);
          if (player.game.piece.pos.y < 1) {
            console.log('GAME OVER!!!');
            dispatch(setGameOver());
            // setDropTime(null);
          } else {
            socket.emit('getPiece');
          }
          console.log('collided');
          dispatch(pieceCollided(true));
          dispatch(updateBoard());
        }
      } else if (event.keyCode === 38) {
        pieceRotate(player.game.piece, player.game.grid, 1);
      }
    }

  };

  const rotate = (tetromino, dir) => {
    const rotatedTetro = tetromino.map((_, index) => {
      return tetromino.map((col) => {
        return col[index];
      });
    });
    if (dir > 0) {
      return rotatedTetro.map((row) => {
        return row.reverse()
      });
    }
    return rotatedTetro.reverse();
  };

  const pieceRotate = ((piece, board, dir) => {
    const clonedPiece = JSON.parse(JSON.stringify(piece));
    clonedPiece.tetromino = rotate(clonedPiece.tetromino, dir);
    clonedPiece.collided = false;

    const pos = clonedPiece.pos.x;
    let offset = 1;
    while (checkCollision(clonedPiece, board, { x: 0, y: 0 })) {
      clonedPiece.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPiece.tetromino[0].length) {
        rotate(clonedPiece.tetromino, -dir);
        clonedPiece.pos.x = pos;
        return;
      }
    }
    dispatch(setPiece(clonedPiece));
    dispatch(updateBoard());
  });

  const start = () => {

    socket.emit('getPiece');
    socket.on('setPiece', (data) => {
      // if (!player.game.gameOver && !checkCollision(data.piece, player.game.grid, {x: 0, y: 0})) {
        dispatch(setPiece(data.piece));
        dispatch(updateBoard());
        // window.addEventListener('keydown', keyDown);
      // }
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
    <div tabIndex={0} onKeyDown={(event) => keyDown(event)}>
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
                  <GamesList games={games} socket={socket} curUser={curUser.name}/>
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
        <Route path="/:room/:player" >
            <div>
              Player {curUser && curUser.name} in {player && player.game.room} room.
              <Board />
              {player && player.game.status === 'PENDING' ? (<button onClick={() => start()} >Start</button>) : ''}
            </div>
        </Route>
      </HashRouter>
    </div>

  )
};

const mapStateToProps = (state) => {
  return {
    message: state.message,
    curGame: state.curGame,
    curUser: state.curUser,
    games: state.games,
    player: state.player
  }
};

export default connect(mapStateToProps, null)(App)

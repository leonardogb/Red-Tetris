import {setRoom} from "./actions/setRoom";
import {setUsername} from "./actions/setUsername";
import {setGames} from "./actions/setGames";
import {updateGame} from "./actions/updateGame";
import {setPlayersGames} from "./actions/setPlayersGames";
import {setPieces} from "./actions/setPieces";
import {setPlayer} from "./actions/setPlayer";
import {addRooms} from "./actions/addRooms";
import { updateTetromino } from "./actions/updateTetromino";
import { setDelay } from "./actions/setDelay";

const socketsClient = (socket, dispatch) => {
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

  // socket.on('setRoom', (data) => {
  //   dispatch(setRoom(data.player, data.room, data.games));
  //   location.hash = data.room + '[' + data.player.name + ']';
  // });
  //
  // socket.on('setUsername', (data) => {
  //   dispatch(setUsername(data.username));
  //   socket.emit('getGames');
  // });

  socket.on('connect', (socket) => {
    // console.log("Connection: ", socket);
    let player = localStorage.getItem('player');
    let room = localStorage.getItem('room');
    let login = localStorage.getItem('login');
    console.log("localStorage: ", localStorage.getItem('player'));
    socket.emit('reloadPlayer', player);
  });

  socket.on('startGame', (data) => {
    dispatch(setPieces(data));
    dispatch(updateTetromino());
    dispatch(setDelay(1000));
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
    console.log("New player");
    dispatch(setPlayersGames(data));
  });

  socket.on('setPieces', (data) => {
    dispatch(setPieces(data));
  });

  socket.on('setGame', (data) => {
    location.hash = data.game.room + '[' + data.player.name + ']';
    dispatch(setPlayer(data.player, data.game.room));
    socket.emit('getGames');
    console.log(data);
  });

  socket.emit('getRooms');
  socket.on('setRooms', (data) => {
    console.log("data: ", data);
    // dispatch(addRooms(data));
  });
};

export default socketsClient;

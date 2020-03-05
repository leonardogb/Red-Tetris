import fs from 'fs';
import debug from 'debug';
import {initialBoard} from "../client/gameHelpers";
import {randomTetromino} from "../client/tetrominos";
import {Player} from "./Player";
import {Game} from "./Game";
import {Piece} from "./Piece";


const logerror = debug('tetris:error'),
  logInfo = debug('tetris:info');

const initApp = (app, params, cb) => {
  const { host, port } = params;
  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html';
    fs.readFile(__dirname + file, (err, data) => {
      if (err) {
        logerror(err);
        res.writeHead(500);
        return res.end('Error loading index.html')
      }
      res.writeHead(200);
      res.end(data)
    })
  };

  app.on('request', handler);

  app.listen({ host, port }, () => {
    logInfo(`tetris listen on ${params.url}`);
    cb()
  })
};

let users = [];
let games = {};
let games1 = [];
let players = [];

const playersGames = (games) => {
  return games.reduce((gamesList, game) => {
    return {[game.room]: game.players.reduce((playersList, player) => {
        playersList.push(player.name);
        return playersList;
      }, [])};
  }, {});
};

const initEngine = io => {
  io.on('connection', (socket) => {
    logInfo("Socket connected: " + socket.id);
    // socket.join('room 123', () => {
    //   io.in('room 123').clients((err, clients) => {
    //     console.log(clients);
    //   });
    // });

    socket.on('setTest', (data) => {
      socket.emit('setServer', {test: 'World !'});
      console.log(data);
    });
    socket.on('getRoom', (room) => {
      const player = players.find(elem =>  elem.name === socket.username);
      const game = games1.find(elem => elem.room === room.room);
      if (player && !game) {
        games1.push(new Game(room.room, player));
      }
      socket.room = room.room;
      socket.emit('setRoom', {player: player, room: room.room, games: games1});
      socket.emit('setPlayersGames', playersGames(games1));
    });

    socket.on('setUsername', (data) => {
      socket.username = data.username;
      players.push(new Player(data.username));
      socket.emit('setUsername', {username: socket.username});
    });

    socket.on('getGames', () => {
      socket.emit('setGames', {games: games1});
    });

    socket.on('getPiece', () => {
      socket.emit('setPieces', Piece.getTetrominos(5));
      // socket.to(socket.room).emit('setPieces', Piece.getTetrominos(5));
    });

    socket.on('start', () => {
      socket.emit('startGame', Piece.getTetrominos(5));
    });

    socket.on('checkUrl', (data, ackCallback) => {
      console.log("server received message", data);
      var result = 'test value';
      console.log(games1);
      console.log("players: " + players);
      // console.log("socket username: " + data.player);
      console.log("socket username: " + socket.username);
      console.log("server sending back result", result);
      
      ackCallback(result);
  });


    socket.on('ping', () => {
      console.log('pong')
    });
/*

    socket.on('getRoom', (room) => {
      // console.log(room.room);
      // socket.join(room.room);
      // console.log(io.sockets.adapter.rooms);
      // io.in(room.room).clients((err, clients) => {
      //   console.log(clients);
      // });

      // socket.join(room.room, () => {
      //   let rooms = Object.keys(socket.rooms);
      //   console.log(rooms);
      // });
      // let allRooms = Object.keys(io.sockets.adapter.rooms);

      const joinable_room = io.sockets.adapter.rooms[room.room];
      socket.join(room.room);
      socket.room = room.room;
      if (joinable_room) {
        games[room.room] = {
          ...games[room.room],
          players: {
            ...games[room.room].players,
            [socket.username]: {
              user: {
                name: socket.username
              },
              grid: initialBoard()
            }
          }
        };
      } else {
        games[socket.room] = {
          status: 'PENDING',
          room: room.room,
          master: socket.username,
          players: {
            [socket.username]: {
              user: {
                name: socket.username
              },
              grid: initialBoard()
            }
          }
        };
      }
      socket.emit('setRoom', {
        status: joinable_room ? 'JOIN_ROOM' : 'NEW_ROOM',
        room: {
          status: 'PENDING',
          room: socket.room,
          player: socket.username,
          master: games[socket.room].master,
          grid: initialBoard()
        }
      });
      socket.to(socket.room).emit('updateGames', games[socket.room]);
      // console.log(io.sockets.adapter.rooms);
    });

    socket.on('setUsername', (data) => {
      if (!users.includes(data.username) && !socket.username) {
        socket.username = data.username;
        users.push(data.username);
        socket.emit('setUsername', {status: true, username: socket.username});
      }
      players.push(new Player(data.username));
    });

    socket.on('getGames', () => {
      socket.emit('setGames', {status: true, games: games});
    });

    socket.on('action', (action) => {
      if (action.type === 'server/ping') {
        socket.emit('action', { type: 'pong' })
      }
    });
    socket.on('getPiece', () => {
      socket.emit('setPiece', {
        piece: {
          pos: { x: 0, y: 0},
          tetromino: randomTetromino(),
          collided: false
        },
      })
    });
    */
  });
};

export function create(params) {
  const promise = new Promise( (resolve, reject) => {
    const app = require('http').createServer();
    initApp(app, params, () => {
      const io = require('socket.io')(app, {'pingTimeout': 30000});
      const stop = (cb) => {
        io.close();
        app.close(() => {
          app.unref()
        });
        logInfo('Engine stopped.');
        cb()
      };

      initEngine(io);
      resolve({ stop });
    })
  });
  return promise
}

import fs from 'fs';
import debug from 'debug';
import {initialBoard} from "../client/gameHelpers";
import {randomTetromino} from "../client/tetrominos";


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
let games = {
  room1: {
    status: 'PENDING',
    room: 'room1',
    players: {
      user1: {
        user: {
          name: 'user1'
        },
        grid: initialBoard()
      },
      user2: {
        user: {
          name: 'user2'
        },
        grid: initialBoard()
      }
    }
  },
  room2: {
    status: 'PENDING',
    room: 'room2',
    players: {
      user3: {
        user: {
          name: 'user3'
        },
        grid: initialBoard()
      },
      user4: {
        user: {
          name: 'user4'
        },
        grid: [
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [2, true], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [2, true], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [2, true], [2, true], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]],
          [[0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false], [0, false]]
        ],
        pos: {
          x: 0,
          y: 0
        },
        // prevPos: false,
        tetromino: false
      }
    }
  }
};

const initEngine = io => {
  io.on('connection', (socket) => {
    logInfo("Socket connected: " + socket.id);
    // socket.join('room 123', () => {
    //   io.in('room 123').clients((err, clients) => {
    //     console.log(clients);
    //   });
    // });

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
      // if (!joinable_room || joinable_room.length < 2) {
        socket.join(room.room);
        socket.room = room.room;
        socket.emit('setRoom', {
          status: joinable_room ? 'JOIN_ROOM' : 'NEW_ROOM',
          room: {
            status: 'PENDING',
            room: room.room,
            player: socket.username,
            grid: initialBoard()
          }
        });
      // }
      // console.log(io.sockets.adapter.rooms);
    });

    socket.on('sendUsername', (data) => {
      if (!users.includes(data.username) && !socket.username) {
        socket.username = data.username;
        users.push(data.username);
        socket.emit('setUsername', {status: true, username: socket.username});
      }
      console.log(users, socket.username);
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
          // prevPos: false,
          tetromino: randomTetromino(),
          collided: false
        },
      })
    });
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

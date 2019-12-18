import fs from 'fs';
import debug from 'debug';


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
let games = [
  {
    status: 'PENDING',
    room: 'room1',
    players: [
      {
        user: {
          name: 'user1'
        }
      },
      {
        user: {
          name: 'user2'
        }
      }
    ]
  },
  {
    status: 'PENDING',
    room: 'room2',
    players: [
      {
        user: {
          name: 'user3'
        }
      },
      {
        user: {
          name: 'user4'
        }
      }
    ]
  }
];

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
      if (!joinable_room || joinable_room.length < 2) {
        socket.join(room.room);
        socket.room = room.room;
        socket.emit('setRoom', {
          room: {
            status: 'PENDING',
            room: room.room,
            players: [
              {
                user: {
                  name: socket.username
                }
              }
            ]
          },
          username: socket.username
        });
      }
      console.log(io.sockets.adapter.rooms);
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
    socket.on('getPiece', (action) => {
      console.log(action);
      socket.emit('setPiece', {
        pos: { x: 0, y: 0},
        prevPos: false,
        tetromino: [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
        ]
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

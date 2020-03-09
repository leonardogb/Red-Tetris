import fs from 'fs';
import debug from 'debug';
import {initialBoard, isEmpty} from "../client/gameHelpers";
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

let games = [];
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

    socket.on('getPiece', () => {
      // socket.emit('setPieces', Piece.getTetrominos(5));
      io.in(socket.room).emit('setPieces', Piece.getTetrominos(5));
      // socket.to(socket.room).emit('setPieces', Piece.getTetrominos(5));
    });

    socket.on('start', () => {
      io.in(socket.room).emit('startGame', Piece.getTetrominos(5));
      games = games.map((game) => {
        if (game.room === socket.room)
        {
          game.playing = true;
          // game.players.splice(game.players.findIndex(e => e.name === socket.username),1);
        }
        io.in(socket.room).emit('setPlayersGames', playersGames(games));
        return (game);
      });
    });

    socket.on('checkUrl', (data, ackCallback) => {
      console.log("server received message", data);
      var result = 'test value';
      console.log(games);
      console.log("players: " + players);
      // console.log("socket username: " + data.player);
      console.log("socket username: " + socket.username);
      console.log("server sending back result", result);
      ackCallback(result);
    });

    socket.on('getGame', (data) => {
      // players.push(new Player(data.username));
      if (!isEmpty(data.username) && !isEmpty(data.room)) {
        let player = players.find(elem =>  elem.name === data.username);
        let game = games.find(elem => elem.room === data.room);
        if (!player) {
          socket.username = data.username;
          const newPlayer = new Player(data.username);
          players.push(newPlayer);
          player = newPlayer;
          socket.room = data.room;
        }
        if (!game) {
          player.isMaster = true;
          const newGame = new Game(data.room, player);
          games.push(newGame);
          game = newGame;
        } else {
          const playerExist = game.players.find(element => element.name === player.name);
          if (!playerExist) {
            game.players.push(player);
          }
        }
        socket.join(data.room);
        socket.emit('setGame', {player: player, game: game});
        io.in(data.room).emit('setPlayersGames', playersGames(games));
      }
    });

    socket.on('disconnect', (reason) => {
      games = games.map((game) => {
        if (game.room === socket.room)
        {
          game.players.splice(game.players.findIndex(e => e.name === socket.username),1);
        }
        console.log("game: ", game);
        return (game);
      });
      players.splice(players.findIndex(e => e.name === socket.username),1);
      io.in(socket.room).emit('setPlayersGames', playersGames(games));
    });

    socket.on('getRooms', () => {
      console.log('getRooms');
      // socket.emit('setRooms', games);
      socket.emit('setRooms', []);
    })
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

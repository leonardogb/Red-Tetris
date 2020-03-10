import fs from 'fs';
import debug from 'debug';
import {initialBoard, isEmpty} from "../client/gameHelpers";
import {randomTetromino} from "../client/tetrominos";
import {Player} from "./Player";
import {Game} from "./Game";
import {Piece} from "./Piece";
import {SET_PLAYER} from "../client/actions/setPlayer";
import {SET_PIECES} from "../client/actions/setPieces";
import {UPDATE_TETROMINO} from "../client/actions/updateTetromino";
import {SET_DELAY} from "../client/actions/setDelay";
import {SET_PLAYERS_GAMES} from "../client/actions/setPlayersGames";


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
      const pieces = Piece.getTetrominos(5);
      socket.emit('serverAction', {action: {type: SET_PIECES, payload: {pieces}}});
      // socket.to(socket.room).emit('setPieces', Piece.getTetrominos(5));
    });

    socket.on('start', () => {
      const piecesStart = Piece.getTetrominos(5);
      socket.emit('serverAction', {action: {type: SET_PIECES, payload: {pieces: piecesStart}}});
      socket.emit('serverAction', {action: {type: UPDATE_TETROMINO}});
      // socket.emit('serverAction', {action: {type: SET_DELAY, payload: {delay: 1000}}});
      socket.emit('serverAction', {action: {type: 'test', payload: 'Esto es una prueba'}});
    });

    socket.on('getGame', (data) => {
      if (!isEmpty(data.username) && !isEmpty(data.room)) {
        let player = players.find(elem =>  elem.name === data.username);
        let game = games.find(elem => elem.room === data.room);
        if (!player) {
          socket.username = data.username;
          const newPlayer = new Player(data.username);
          players.push(newPlayer);
          player = newPlayer;

          if (!game) {
            player.isMaster = true;
            const newGame = new Game(data.room, player);
            games.push(newGame);
            socket.room = data.room;
            game = newGame;
          } else {
            const playerExist = game.players.find(element => element.name === player.name);
            if (!playerExist) {
              game.players.push(player);
            }
          }
          console.log(games);
          socket.join(data.room);
          socket.emit('serverAction', {action: {type: SET_PLAYER, payload: {player: player, game: game}}});
          socket.emit('redirect', {to: game.room + '[' + player.name + ']'});
          socket.emit('serverAction', {action: {type: SET_PLAYERS_GAMES, payload: {games: playersGames(games)} }});
        }
      }
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

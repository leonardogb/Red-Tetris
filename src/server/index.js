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
import { RELOAD_PLAYER } from '../client/actions/reloadPlayer';
import { SET_GAMES } from '../client/actions/setGames';


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

function checkInactivePlayers() {
  console.log("games here: ", games);
  if (!isEmpty(games)) {
  games = games.map((game) => {
    console.log("players: ", game.players);
    let timeNow = Date.now();
    for (var i = game.players.length -1; i >= 0; i--) {
      if (game.players[i].timeToDelete && game.players[i].timeToDelete <= timeNow)
      game.players.splice(i, 1);
    }
    return (game);
  })
  for (var i = games.length -1; i >=0; i--) {
    if (games[i].players == undefined || games[i].players.length == 0)
    {
      games.splice(i, 1);
    }
  }
  games.map((game) => {
    console.log("game players: ", game.players);
    return (game);
  })
}
}

const id = setInterval(checkInactivePlayers, 60000);

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
      io.in(socket.room).emit('serverAction', {action: {type: SET_PIECES, payload: {pieces}}});
      games.map((game) => {
        if (game.room === socket.room) {
          game.players = game.players.map((player) => {
            if (player.socketId === null) {
              player.pieces.push(pieces);
            }
            return (player);
          })
        }
        return (game);
      })
      // socket.to(socket.room).emit('setPieces', Piece.getTetrominos(5));
    });

    socket.on('start', () => {
      const piecesStart = Piece.getTetrominos(5);
      io.in(socket.room).emit('serverAction', {action: {type: SET_PIECES, payload: {pieces: piecesStart}}});
      io.in(socket.room).emit('serverAction', {action: {type: UPDATE_TETROMINO}});
      io.in(socket.room).emit('serverAction', {action: {type: SET_DELAY, payload: {delay: 1000}}});
      io.in(socket.room).emit('setIsPLaying');
      socket.emit('serverAction', {action: {type: 'test', payload: 'Esto es una prueba'}});
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

    function create_UUID(){
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (dt + Math.random()*16)%16 | 0;
          dt = Math.floor(dt/16);
          return (c=='x' ? r :(r&0x3|0x8)).toString(16);
      });
      return uuid;
  }

    socket.on('getGame', (data) => {
      if (!isEmpty(data.username) && !isEmpty(data.room)) {
        // let player = players.find(elem =>  elem.name === data.username);
        let game = games.find(elem => elem.room === data.room);
        let player = null;
        if (game && game.players) {
          player = game.players.find(elem => elem.name === data.username);
        }
        if (!player) {
          socket.username = data.username;
          const newPlayer = new Player(data.username, create_UUID(), socket.id);
          socket.emit('setId', newPlayer.id);
          // players.push(newPlayer);
          player = newPlayer;
          socket.room = data.room;
          // console.log("length players: ", game.players.length);
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
          socket.emit('serverAction', {action: {type: SET_PLAYER, payload: {player: player, game: game}}});
          socket.emit('redirect', {to: game.room + '[' + player.name + ']'});
          io.in(data.room).emit('serverAction', {action: {type: SET_PLAYERS_GAMES, payload: {games: playersGames(games)} }});
        }
      }
    });

    socket.on('reloadPlayer', (id) => {
        let room = null;
        let found = false;
        if (!isEmpty(id)) {
          games = games.map((game) => {
            game.players = game.players.map((player) => {
              if (player && player.id === id)
              {
                player.timeToDelete = null;
                socket.username = player.name;
                socket.room = game.room;
                player.socketId = socket.id;
                room = game.room;
                socket.join(game.room);
                socket.emit('serverAction', {action: {type: RELOAD_PLAYER, payload: {player: player, room: game.room, name: player.name}}});
                found = true;
                // socket.emit('serverAction', {action: {type: SET_GAMES, payload: {player: player, room: game.room, name: player.name}}});
              }
              return (player);
            })
            return (game);
          });
          if (found === true) {
            io.in(room).emit('serverAction', {action: {type: SET_PLAYERS_GAMES, payload: {games: playersGames(games)} }});
          }
          else {
            socket.emit('deleteId');
          }
        }
    });

    socket.on('updatePlayer', (player) => {
      games = games.map((game) => {
        game.players = game.players.map((playerIn) => {
          if (playerIn && player.id === playerIn.id)
          {
            playerIn = player;
          }
          return (playerIn);
        })
        return (game);
      })
    });

    socket.on('disconnect', (reason) => {
      games = games.map((game) => {
        if (game.room === socket.room)
        {
          let player = game.players[game.players.findIndex(e => e.name === socket.username)];
          player.timeToDelete = Date.now() + 60000;
          game.players.splice(game.players.findIndex(e => e.name === socket.username),1);
          if (player.isMaster === true && game.players.length) {
            player.isMaster = false;
            game.players[0].isMaster = true;
            io.to(game.players[0].socketId).emit('setMaster', true);
          }
          game.players.push(player);
          console.log("player disconnect: ", game.players);
        }
        return (game);
      });
      io.in(socket.room).emit('serverAction', {action: {type: SET_PLAYERS_GAMES, payload: {games: playersGames(games)} }});

      // players.splice(players.findIndex(e => e.name === socket.username),1);
      // io.in(socket.room).emit('setPlayersGames', playersGames(games));
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

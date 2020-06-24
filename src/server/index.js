import fs from 'fs';
import debug from 'debug';
import { initialBoard, isEmpty } from "../client/gameHelpers";
import { Player } from "./Player";
import { Game } from "./Game";
import { Piece } from "./Piece";
import * as types from '../client/actions/actionTypes';

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

const playersGames = (games) => {
  return games.reduce((gamesList, game) => {
    return {
      [game.room]: game.players.reduce((playersList, player) => {
        playersList.push([player.name, player.score]);
        return playersList;
      }, [])
    };
  }, {});
};

const getSpectre = (curUser) => {
  let spectre = null;
  games.map((game) => {
    game.players.map((player) => {
      if (player.name === curUser) {
        spectre = { playerName: player.name, spectre: player.spectre, score: player.score };
        // spectresArray[player.name] = { playerName: player.name, spectre: player.spectre };
      }
    });
  });
  return spectre;
};

const initEngine = io => {
  io.on('connection', (socket) => {
    logInfo("Socket connected: " + socket.id);

    socket.on('action', (action) => {
      if (action.type === 'server/ping') {
        socket.emit('action', { type: 'pong' })
      }
    });

    socket.on('getPiece', () => {
      const pieces = Piece.getTetrominos(5);
      io.in(socket.room).emit('serverAction', { action: { type: types.SET_PIECES, payload: { pieces } } });
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

    const play = () => {
      const piecesStart = Piece.getTetrominos(5);
      io.in(socket.room).emit('serverAction', { action: { type: types.SET_PIECES, payload: { pieces: piecesStart } } });
      io.in(socket.room).emit('serverAction', { action: { type: types.UPDATE_TETROMINO } });
      io.in(socket.room).emit('serverAction', { action: { type: types.SET_DELAY, payload: { delay: 1000 } } });
      io.in(socket.room).emit('serverAction', { action: { type: types.SET_IS_PLAYING, payload: { value: true } } });
      games = games.map((game) => {
        if (game.room === socket.room) {
          game.playing = true;
          // game.players.splice(game.players.findIndex(e => e.name === socket.username),1);
        }
        io.in(socket.room).emit('setPlayersGames', playersGames(games));
        return (game);
      });
    }

    socket.on('play', () => {
      play();
    });

    socket.on('replay', () => {
      io.in(socket.room).emit('serverAction', { action: { type: types.RESTART_GAME, payload: { grid: initialBoard() } } });
      play();
    });

    function create_UUID() {
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    }

    socket.on('getGame', (data) => {
      if (!isEmpty(data.username) && !isEmpty(data.room)) {
        let game = games.find(elem => elem.room === data.room);
        let player = null;
        if (game && game.players) {
          player = game.players.find(elem => elem.name === data.username);
        }
        if (!player) {
          socket.username = data.username;
          const newPlayer = new Player(data.username, create_UUID(), socket.id);
          socket.emit('setId', newPlayer.id);
          player = newPlayer;
          socket.room = data.room;
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
          socket.emit('serverAction', { action: { type: types.SET_PLAYER, payload: { player: player, game: game } } });
          socket.emit('redirect', { to: game.room + '[' + player.name + ']' });
          io.in(data.room).emit('serverAction', { action: { type: types.SET_PLAYERS_GAMES, payload: { games: playersGames(games) } } });
        } else {
          socket.emit('serverAction', { action: { type: types.SET_ERROR, payload: { error: 'Le login n\'est pas disponible' } } });
        }
      }
    });

    socket.on('updatePlayer', (player) => {
      games = games.map((game) => {
        game.players = game.players.map((playerIn) => {
          if (playerIn && player.id === playerIn.id) {
            player.spectre = playerIn.spectre;
            playerIn = player;
          }
          return (playerIn);
        })
        return (game);
      })
    });

    socket.on('setPlayerGames', (room) => {
      io.in(room).emit('serverAction', { action: { type: types.SET_PLAYERS_GAMES, payload: { games: playersGames(games) } } });
    });

    const removePlayer = () => {
      console.log("removePlayer!!!!!!\n\n\n\n\n\n\n");
      games = games.filter((game) => {
        if (game.room === socket.room) {
          let player = game.players[game.players.findIndex(e => e.name === socket.username)];
          if (player) {
            io.in(socket.room).emit('serverAction', { action: { type: types.REMOVE_SPECTRE, payload: { username: socket.username } } });
            game.players.splice(game.players.findIndex(e => e.name === socket.username), 1);
            if (player.isMaster === true && game.players.length) {
              player.isMaster = false;
              game.players[0].isMaster = true;
              io.to(game.players[0].socketId).emit('setIsMaster', true);
            }
            else if (!game.players.length) {
              return false;
            }
          }
        }
        return true;
      });
      io.in(socket.room).emit('serverAction', { action: { type: types.SET_PLAYERS_GAMES, payload: { games: playersGames(games) } } });
    }

    socket.on('removePlayer', () => {
      removePlayer();
    });

    socket.on('disconnect', (reason) => {
      removePlayer();
    });

    socket.on('updateGrid', (data) => {
      games = games.map((game) => {
        if (game.room === socket.room) {
          game.players.map((player) => {
            if (player.name === socket.username) {
              // Générer l'spectre
              const spectre = data.grid.map((row) => row.map((cell) => cell[0]));
              for (let i = 0; i < spectre.length; i++) {
                for (let j = 0; j < spectre[i].length; j++) {
                  if (spectre[i][j] > 0) {
                    for (let k = i; k < spectre.length; k++) {
                      spectre[k][j] = 1;
                    }
                  }
                }
              }
              player.spectre = spectre;
            }
          });
        }
        return game;
      });
      socket.to(socket.room).emit('serverAction', { action: { type: types.SET_SPECTRES, payload: { spectre: getSpectre(socket.username), username: socket.username } } });
    })

    socket.on('malus', data => {
      let curGame = games.find(elem => elem.room === socket.room);
      if (curGame) {

        let curPlayer = curGame.players.find(elem => elem.name === socket.username);
        curPlayer.score = curPlayer.score + (10 * data.malus.length);

        const malus = data.malus.map(row => {
          return row.reduce((acc, value) => {
            if (curGame.options.isIndestructible) {
              acc.push([8, true]);
            } else {
              acc.push([value[1] ? value[0] : 0, value[1]]);
            }
            return acc;
          }, []);
        });
        socket.to(socket.room).emit('serverAction', { action: { type: types.SET_MALUS, payload: { malus: malus } } });
        io.in(socket.room).emit('serverAction', { action: { type: types.SET_PLAYERS_GAMES, payload: { games: playersGames(games) } } });
      }
    });

    socket.on('setIsDestructible', data => {
      let game = games.find(elem => elem.room === socket.room);
      if (game) {
        game.options.isIndestructible = data;
      }
    });

    socket.on('gameOver', (player) => {
      let winner = null;
      let stillPlaying = 0;
      games = games.map((game) => {
        if (game.room === socket.room) {
          game.players = game.players.map((checkPlayer) => {
            if (checkPlayer.name === socket.username) {
              checkPlayer.gameOver = player.gameOver;
            }
            else if (checkPlayer.gameOver === false) {
              winner = checkPlayer;
              stillPlaying++;
            }
            return (checkPlayer);
          });
        }
        return (game);
      });
      if (!stillPlaying) {
        socket.emit('serverAction', { action: { type: types.SET_ROOM_OVER, payload: { games: playersGames(games) } } });
        io.in(socket.room).emit('serverAction', { action: { type: types.SET_IS_PLAYING, payload: { value: false } } });
        socket.emit('game-over');
      }
      else if (stillPlaying === 1 && winner) {
        io.to(winner.socketId).emit('winner');
        io.in(socket.room).emit('serverAction', { action: { type: types.SET_ROOM_OVER, payload: { games: playersGames(games) } } });
        io.to(winner.socketId).emit('serverAction', { action: { type: types.SET_GAME_OVER } });
        io.in(socket.room).emit('serverAction', { action: { type: types.SET_IS_PLAYING, payload: { value: false } } });
        socket.emit('loser');
      }
      else {
        socket.emit('loser');
      }
    });

  });
};

export function create(params) {
  const promise = new Promise((resolve, reject) => {
    const app = require('http').createServer();
    initApp(app, params, () => {
      const io = require('socket.io')(app, { 'pingTimeout': 30000 });
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

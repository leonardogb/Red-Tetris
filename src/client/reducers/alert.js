import { ALERT_POP } from '../actions/alert'
import { UPDATE_PLAYER_POSITION } from '../actions/updatePlayerPosition'
import { UPDATE_BOARD } from '../actions/updateBoard';
import {ADD_ROOM} from '../actions/addRoom';
import {SET_USERNAME} from '../actions/setUsername';
import {SET_GAMES} from "../actions/setGames";
import {JOIN_ROOM} from "../actions/joinRoom";
import {ADD_GAME} from "../actions/addGame";
import {PIECE_COLLIDED} from '../actions/pieceCollided';
import {SET_PIECES} from "../actions/setPieces";
import {SET_GAME_OVER} from "../actions/setGameOver";
import {UPDATE_GAME} from "../actions/updateGame";
import {SET_ROOM} from "../actions/setRoom";
import {SET_PLAYERS_GAMES} from "../actions/setPlayersGames";
import {SET_PIECE} from "../actions/setPiece";
import {UPDATE_TETROMINO} from "../actions/updateTetromino";
import { SET_CUR_ROOM } from '../actions/setCurRoom';
import {START_GAME} from "../actions/startGame";
import {checkCollision} from "../gameHelpers";
import {DROP_PLAYER} from "../actions/dropPlayer";
import {SET_DELAY} from "../actions/setDelay";



const reducer = (state = {}, action) => {
  let curTetromino = null;
  let piecesList = null;

  switch(action.type) {
    case ALERT_POP:
      return { ...state, message: action.message };
    case UPDATE_PLAYER_POSITION:
      let posX = action.payload.x ? action.payload.x : 0;
      let posY = action.payload.y ? action.payload.y : 0;
      if (!checkCollision(state.player.piece, state.player.grid, {x: posX, y: posY})) {
        return {
          ...state,
          player: {
            ...state.player,
            piece: {
              ...state.player.piece,
              pos: {
                x: state.player.piece.pos.x + posX,
                y: state.player.piece.pos.y + posY
              },
              collided: action.payload.collided
            }
          }
        };
      } else {
        return state;
      }


    case PIECE_COLLIDED:
      return {
        ...state,
        player: {
          ...state.player,
          piece: {
            ...state.player.piece,
            collided: action.payload.collided
          }
        }
      };
    case UPDATE_BOARD:
      const player = state.player;

      let newBoard = player.grid.map(row =>
        row.map(cell => (cell[1] ? cell : [0, false]))
      );

      player.piece.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newBoard[y + player.piece.pos.y][x + player.piece.pos.x] = [
              value,
              player.piece.collided,
            ];
          }
        });
      });

      if (player.piece.collided) {
        newBoard = newBoard.reduce((ack, row) => {
          if (row.findIndex(cell => cell[0] === 0) === -1) {
            // Gestión de puntos
            ack.unshift(new Array(newBoard[0].length).fill([0, false]));
            return ack;
          }
          ack.push(row);
          return ack;
        }, []);
      }

      return {
        ...state,
        player: {
          ...state.player,
          grid: newBoard
        }
      };
    case ADD_ROOM:
      return {
        ...state,
        player: {
          game: {
            room: action.payload.room.room,
            status: action.payload.room.status,
            grid: action.payload.room.grid,
            gameOver: false
          }
        },
        games: {
          ...state.games,
          [action.payload.room.room]: {
            status: action.payload.room.status,
            room: action.payload.room.room,
            master: action.payload.room.master,
            players: {
              [action.payload.room.player]: {
                user: action.payload.room.player,
                grid: action.payload.room.grid
              }
            }
          }
        }
      };
    case JOIN_ROOM:
      return {
        ...state,
        player: {
          game: {
            room: action.payload.room.room,
            status: action.payload.room.status,
            grid: action.payload.room.grid,
            gameOver: false
          }
        },
        games: {
          ...state.games,
          [action.payload.room.room]: {
            ...state.games[action.payload.room.room],
            players: {
              ...state.games[action.payload.room.room].players,
              [action.payload.room.player]: {
                user: action.payload.room.player,
                grid: action.payload.room.grid
              }
            }
          }
        }
      };
    case SET_USERNAME:
      return {...state, curUser: action.payload.username};
    case SET_ROOM:
      return {
        ...state,
        player: action.payload.player,
        curRoom: action.payload.room,
        games: action.payload.games
      };
    case SET_PIECE:
      return {
        ...state,
        player: {
          ...state.player,
          piece: action.payload.piece
        }
      };
    case SET_PLAYERS_GAMES:
      return {...state, playersGames: action.payload.games};
    case SET_GAMES:
      return {...state, games: action.payload};
    case ADD_GAME:
      // games: {
      // ...state.games,
      //     [action.payload.room.room]: {
      //     status: 'PENDING',
      //       room: action.payload.room.room,
      //       players: {
      //       [action.payload.room.player]: {
      //         user: {
      //           name: action.payload.room.player,
      //         },
      //         grid: [
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 2, 2, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      //           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      //         ],
      //           pos: {
      //           x: 0,
      //             y: 0
      //         }
      //       }
      //     }
      //   }
      // }
      return {...state};
    case UPDATE_GAME:
      return {
        ...state,
        games: {
          ...state.games,
          [action.payload.game.room]: action.payload.game
        }
      };
    case SET_PIECES:
      piecesList = [...state.player.pieces].concat(action.payload.pieces);
      return {
        ...state,
        player: {
          ...state.player,
          pieces: piecesList
        }
      };
    case UPDATE_TETROMINO:
      piecesList = [...state.player.pieces];
      curTetromino = piecesList.shift();
      return {
        ...state,
        player: {
          ...state.player,
          pieces: piecesList,
          piece: {
            ...state.player.piece,
            tetromino: curTetromino,
            pos: {
              x: state.player.grid[0].length / 2 - 2,
              y: 0
            },
            collided: false
          }
        }
      };
    case SET_GAME_OVER:
      return {
        ...state,
        player: {
          ...state.player,
          gameOver: true
        }
      };
<<<<<<< HEAD
    case SET_CUR_ROOM:
      return {
        ...state,
        curRoom: true
      }
=======
    case START_GAME:
      return {
        ...state,
        player: {
          ...state.player,
          status: 'PLAYING'
        }
      };
    case DROP_PLAYER:
      if (!checkCollision(state.player.piece, state.player.grid, {x: 0, y: 1})) {
        return {
          ...state,
          player: {
            ...state.player,
            piece: {
              ...state.player.piece,
              pos: {
                x: state.player.piece.pos.x + 0,
                y: state.player.piece.pos.y + 1
              },
              collided: false
            }
          }
        };
      } else {
        return state;
      }
    case SET_DELAY:
      return {
        ...state,
        player: {
          ...state.player,
          delay: action.payload.delay
        }
      };
>>>>>>> 2712e1d5a030b61f84c3bf28cc77e894b89a9bf0
    default:
      return state
  }
};

export default reducer

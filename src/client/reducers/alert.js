import { ALERT_POP } from '../actions/alert'
import { ADD_PIECE } from '../actions/addPiece'
import { SET_PLAYER } from '../actions/setPlayer'
import { UPDATE_PLAYER_POSITION } from '../actions/updatePlayerPosition'
import { UPDATE_BOARD } from '../actions/updateBoard';
import {ADD_ROOM} from '../actions/addRoom';
import {SET_USERNAME} from '../actions/setUsername';
import {SET_GAMES} from "../actions/setGames";
import {JOIN_ROOM} from "../actions/joinRoom";
import {ADD_GAME} from "../actions/addGame";
import {PIECE_COLLIDED} from '../actions/pieceCollided';
import {SET_PIECE} from "../actions/setPiece";

const reducer = (state = {}, action) => {
  let tmpBoard = [...state.board];

  switch(action.type) {
    case ALERT_POP:
      return { ...state, message: action.message };
    case SET_PLAYER:
      return {
        ...state,
        player: {
          ...state.player,
          game: {
            ...state.player.game,
            piece: action.payload.piece,
          }
        }
      };
    case UPDATE_PLAYER_POSITION:
      let posX = action.payload.x ? action.payload.x : 0;
      let posY = action.payload.y ? action.payload.y : 0;
        return {
          ...state,
          player: {
            ...state.player,
            game: {
              ...state.player.game,
              piece: {
                ...state.player.game.piece,
                // prevPos: state.player.game.piece.pos,
                pos: {
                  x: state.player.game.piece.pos.x + posX,
                  y: state.player.game.piece.pos.y + posY
                }
              }
            }
          }
        };

    case PIECE_COLLIDED:
      return {
        ...state,
        player: {
          ...state.player,
          game: {
            ...state.player.game,
            piece: {
              ...state.player.game.piece,
              collided: action.payload.collided
            }
          }
        }
      };
    case UPDATE_BOARD:
      const player = state.player;
      let maxY = player.game.grid.length;
      let maxX = player.game.grid[0].length;
      // if (player.game.piece.prevPos) {
      //   player.game.piece.tetromino.forEach((row, y) => {
      //     row.forEach((value, x) => {
      //       if (value !== 0) {
      //         if (y + player.game.piece.prevPos.y < maxY && x + player.game.piece.prevPos.x < maxX) {
      //           tmpBoard[y + player.game.piece.prevPos.y][x + player.game.piece.prevPos.x] = 0;
      //         }
      //       }
      //     });
      //   });
      // }

      const newStage = player.game.grid.map(row =>
        row.map(cell => (cell[1] ? cell : [0, false]))
      );

      // Then draw the tetromino
      player.game.piece.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.game.piece.pos.y][x + player.game.piece.pos.x] = [
              value,
              player.game.piece.collided,
            ];
          }
        });
      });



      // player.game.piece.tetromino.forEach((row, y) => {
      //   row.forEach((value, x) => {
      //     if (value !== 0) {
      //       if ((y + player.game.piece.pos.y) < maxY && (x + player.game.piece.pos.x) < maxX) {
      //         tmpBoard[y + player.game.piece.pos.y][x + player.game.piece.pos.x] = value;
      //       }
      //     }
      //   });
      // });
      return {
        ...state,
        player: {
          ...state.player,
          game: {
            ...state.player.game,
            grid: newStage
          }
        },
        board: newStage
      };
    case ADD_ROOM:
      return {
        ...state,
        player: {
          game: {
            room: action.payload.room.room,
            status: action.payload.room.status,
            grid: action.payload.room.grid
          }
        }
      };
    case JOIN_ROOM:
      return {
        ...state,
        player: {
          ...state.player,
          game: action.payload.room.room
        }
      };
    case SET_USERNAME:
      return {...state, curUser: {name: action.payload.username}};
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
    case SET_PIECE:
      return {
        ...state,
        player: {
          ...state.player,
          game: {
            ...state.player.game,
            piece: action.payload.piece
          }
        }
      }
    default:
      return state
  }
};

export default reducer

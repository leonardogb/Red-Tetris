import { ALERT_POP } from '../actions/alert'
import { ADD_PIECE } from '../actions/addPiece'
import { SET_PLAYER } from '../actions/setPlayer'
import { UPDATE_PLAYER_POSITION } from '../actions/updatePlayerPosition'
import { UPDATE_BOARD } from '../actions/updateBoard';
import {ADD_ROOM} from '../actions/addRoom';
import {SET_USERNAME} from '../actions/setUsername';
import {SET_GAMES} from "../actions/setGames";

const reducer = (state = {}, action) => {
  let tmpBoard = [...state.board];

  switch(action.type) {
    case ALERT_POP:
      return { ...state, message: action.message };
    case SET_PLAYER:
      return {...state, player: action.payload};
    case UPDATE_PLAYER_POSITION:
      let posX = action.payload.x ? action.payload.x : 0;
      let posY = action.payload.y ? action.payload.y : 0;
        return {
          ...state,
          player: {
            ...state.player,
            prevPos: {
              x: state.player.pos.x,
              y: state.player.pos.y
            },
            pos: {
              x: state.player.pos.x + posX,
              y: state.player.pos.y + posY
            }
          }
        };

    case UPDATE_BOARD:
      let maxY = state.board.length;
      let maxX = state.board[0].length;
      if (state.player.prevPos) {
        state.player.tetromino.forEach((row, y) => {
          row.forEach((value, x) => {
            if (value !== 0) {
              if (y + state.player.prevPos.y < maxY && x + state.player.prevPos.x < maxX) {
                tmpBoard[y + state.player.prevPos.y][x + state.player.prevPos.x] = 0;
              }
            }
          });
        });
      }
      state.player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            if ((y + state.player.pos.y) < maxY && (x + state.player.pos.x) < maxX) {
              tmpBoard[y + state.player.pos.y][x + state.player.pos.x] = value;
            }
          }
        });
      });
      return {...state, board: tmpBoard};
    case ADD_ROOM:
      return {...state, games: [...state.games, action.payload.room], curGame: action.payload.room.room};
    case SET_USERNAME:
      return {...state, curUser: {name: action.payload.username}};
    case SET_GAMES:
      return {...state, games: action.payload};
    default:
      return state
  }
};

export default reducer

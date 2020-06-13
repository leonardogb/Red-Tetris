import { UPDATE_PLAYER_POSITION } from '../actions/updatePlayerPosition'
import { UPDATE_BOARD } from '../actions/updateBoard';
import { SET_USERNAME } from '../actions/setUsername';
import { SET_GAMES } from '../actions/setGames';
import { PIECE_COLLIDED } from '../actions/pieceCollided';
import { SET_PIECES } from '../actions/setPieces';
import { SET_GAME_OVER } from '../actions/setGameOver';
import { UPDATE_GAME } from '../actions/updateGame';
import { SET_ROOM } from '../actions/setRoom';
import { SET_PLAYERS_GAMES } from '../actions/setPlayersGames';
import { SET_PIECE } from '../actions/setPiece';
import { UPDATE_TETROMINO } from '../actions/updateTetromino';
import { SET_CUR_ROOM } from '../actions/setCurRoom';
import { START_GAME } from '../actions/startGame';
import { checkCollision } from '../gameHelpers';
import { DROP_PLAYER } from '../actions/dropPlayer';
import { SET_DELAY } from '../actions/setDelay';
import { SET_PLAYER } from '../actions/setPlayer';
import { ADD_ROOMS } from '../actions/addRooms';
import { RELOAD_PLAYER } from '../actions/reloadPlayer';
import { SWAP_PIECES } from '../actions/swapPieces';
import { SET_SPECTRES } from '../actions/setSpectres';
import { SET_MALUS } from '../actions/actionTypes';

const reducer = (state = {}, action) => {
  let curTetromino = null;
  let piecesList = null;
  switch (action.type) {
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
              collided: action.payload.collided,
              new: false
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
      return {
        ...state,
        player: {
          ...state.player,
          grid: action.payload.newBoard
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
            collided: false,
            new: true
          }
        }
      };
    case SET_GAME_OVER:
      return {
        ...state,
        player: {
          ...state.player,
          gameOver: true,
          delay: null
        }
      };
    case SET_CUR_ROOM:
      return {
        ...state,
        curRoom: true
      };
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
                x: state.player.piece.pos.x,
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
    case SET_PLAYER:
      return {
        ...state,
        player: action.payload.player,
        curRoom: action.payload.game.room,
        curUser: action.payload.player.name
      };
      case ADD_ROOMS:
      return {
        ...state,
        rooms: action.payload.rooms
      };
      case RELOAD_PLAYER:
        return {
          ...state,
          player: action.payload.player,
          curRoom: action.payload.room,
          curUser: action.payload.name
        };
      case SWAP_PIECES:
        if (state.player.pieces.length > 1) {
          let pieces = [...state.player.pieces];
          const tmp = pieces[0];
          pieces[0] = pieces[1];
          pieces[1] = tmp;
          return {
            ...state,
            player: {
              ...state.player,
              pieces: pieces
            }
          }
        } else {
          return state;
        };
      case SET_SPECTRES:
        let spectres = [];
        
        if (state.spectres) {
          spectres = JSON.parse(JSON.stringify(state.spectres));
          const indexSpectre = spectres.findIndex(element => element.playerName === action.payload.username);
          if (indexSpectre !== -1) {
            spectres[indexSpectre] = action.payload.spectre
          } else {
            spectres.push(action.payload.spectre);
          }
          return {
            ...state,
            spectres: spectres
          };
        }
        return {
          ...state,
          spectres: [action.payload.spectre]
        };
      case SET_MALUS:
        const grid = state.player.grid;
        const malusArray = action.payload.malus;

        for(let i = 0; i < grid.length; i++) {
          if (grid[i].findIndex(cell => cell[0] !== 0) === -1) {
            if (malusArray.length > 0) {
              grid.splice(i, 1);
              const row = malusArray.shift();
              console.log(row);
              grid.push(row);
            }
          }
        }
        return {
          ...state,
          player: {
            ...state.player,
            grid: grid
          }
        };
    default:
      return state
  }
};

export default reducer

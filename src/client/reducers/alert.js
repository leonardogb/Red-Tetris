import { checkCollision } from '../gameHelpers';
import { ALERT_POP } from '../actions/alert';
import * as types from '../actions/actionTypes';

const reducer = (state = {}, action) => {
  let curTetromino = null;
  let piecesList = null;
  switch (action.type) {
    case ALERT_POP:
      return { message: action.message }

    case types.UPDATE_PLAYER_POSITION:
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
    case types.UPDATE_BOARD:
      const delay = state.player.isPlaying ? 1000 : null;
      return {
        ...state,
        player: {
          ...state.player,
          grid: action.payload.newBoard,
          delay: delay
        }
      };
    case types.SET_USERNAME:
      return {...state, curUser: action.payload.username};
    case types.SET_ROOM:
      return {
        ...state,
        player: action.payload.player,
        curRoom: action.payload.room,
        games: action.payload.games
      };
    case types.SET_PIECE:
      return {
        ...state,
        player: {
          ...state.player,
          piece: action.payload.piece
        }
      };
    case types.SET_PLAYERS_GAMES:
      return {...state, playersGames: action.payload.games};
    case types.SET_GAMES:
      return {...state, games: action.payload};
    case types.UPDATE_GAME:
      return {
        ...state,
        games: {
          ...state.games,
          [action.payload.game.room]: action.payload.game
        }
      };
    case types.SET_PIECES:
      piecesList = [...state.player.pieces].concat(action.payload.pieces);
      return {
        ...state,
        player: {
          ...state.player,
          pieces: piecesList
        }
      };
    case types.UPDATE_TETROMINO:
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
    case types.SET_GAME_OVER:
      return {
        ...state,
        player: {
          ...state.player,
          gameOver: true,
          delay: null
        }
      };
    case types.SET_CUR_ROOM:
      return {
        ...state,
        curRoom: true
      };
    case types.START_GAME:
      return {
        ...state,
        player: {
          ...state.player,
          status: 'PLAYING'
        }
      };
    case types.SET_DELAY:
      return {
        ...state,
        player: {
          ...state.player,
          delay: action.payload.delay
        }
      };
    case types.SET_PLAYER:
      return {
        ...state,
        player: action.payload.player,
        curRoom: action.payload.game.room,
        curUser: action.payload.player.name
      };
      case types.ADD_ROOMS:
      return {
        ...state,
        rooms: action.payload.rooms
      };
      case types.RELOAD_PLAYER:
        return {
          ...state,
          player: action.payload.player,
          curRoom: action.payload.room,
          curUser: action.payload.name
        };
      case types.SWAP_PIECES:
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
      case types.SET_SPECTRES:
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
      case types.REMOVE_SPECTRE:
      if (state.spectres) {
        spectres = JSON.parse(JSON.stringify(state.spectres));
        const indexSpectre = spectres.findIndex(element => element.playerName == action.payload.username);
        if (indexSpectre !== -1) {
          spectres.splice(indexSpectre, 1);
        }
        if (!spectres.length) {
          spectres = undefined;
        }
        return {
          ...state,
          spectres: spectres
        };
      }
      return {
        ...state
      };
      case types.SET_MALUS:
        const grid = state.player.grid;
        const malusArray = action.payload.malus;

        for(let i = 0; i < grid.length; i++) {
          if (grid[i].findIndex(cell => cell[0] !== 0) === -1) {
            if (malusArray.length > 0) {
              grid.splice(i, 1);
              const row = malusArray.shift();
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
      case types.UPDATE_SCORE:
        return {
          ...state,
          player: {
            ...state.player,
            score: state.player.score + action.payload.score
          }
        }
      case types.SET_ERROR:
        return {
          ...state,
          error: action.payload.error
        }
      case types.REMOVE_ERROR:
        return {
          ...state,
          error: null
        }
        case types.SET_IS_PLAYING:
          return {
            ...state,
            player: {
              ...state.player,
              isPlaying: action.payload.value,
            },
          };
          case types.SET_IS_MASTER:
          return {
            ...state,
            player: {
              ...state.player,
              isMaster: action.payload.value,
            },
          };
          case types.SET_ROOM_OVER:
            return {
              ...state,
              player: {
                ...state.player,
                roomOver: true,
              },
            };
            case types.RESTART_GAME:
              return {
                ...state,
                player: {
                  ...state.player,
                  grid: action.payload.grid,
                  pieces: [],
                  piece: {
                    tetromino: [],
                    pos: {
                      x: 0,
                      y: 0,
                    },
                    collided: false,
                  },
                  gameOver: false,
                  roomOver: false,
                  status: null,
                  isPlaying: true,
                  delay: null,
                  new: false,
                  score: 0
                },
              };
    default:
      return state
  }
};

export default reducer

import {configureStore} from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import chai from "chai"
import * as action from '../../src/client/actions/actions';


chai.should()

import openSocket from 'socket.io-client';
import { initialBoard } from '../../src/client/gameHelpers';
const  socket = openSocket('http://localhost:3004');

describe('Redux test', function(){

  describe('update player position', () => {
      const initialState = {
        player: {
          grid: initialBoard(),
          piece: {
            tetromino: [
              [0, 6, 0],
              [6, 6, 6],
              [0, 0, 0]
            ],
            pos: {
              x: 5,
              y: 6
            },
            collided: false,
            new: false
          }
        }
      };
    it('player down', (done) => {
      const store =  configureStore(rootReducer, null, initialState, {
        UPDATE_PLAYER_POSITION: ({dispatch, getState}) =>  {
          const state = getState()
          state.player.piece.pos.x.should.equal(5);
          state.player.piece.pos.y.should.equal(7);
          state.player.piece.collided.should.equal(false);
          done()
        }
      })
      store.dispatch(action.updatePlayerPosition(1, null, false));
    });
    it('player left', (done) => {
      const store =  configureStore(rootReducer, null, initialState, {
        UPDATE_PLAYER_POSITION: ({dispatch, getState}) =>  {
          const state = getState()
          state.player.piece.pos.x.should.equal(4);
          state.player.piece.pos.y.should.equal(6);
          state.player.piece.collided.should.equal(false);
          done()
        }
      })
      store.dispatch(action.updatePlayerPosition(null, -1, false));
    });
    it('player right', (done) => {
      const store =  configureStore(rootReducer, null, initialState, {
        UPDATE_PLAYER_POSITION: ({dispatch, getState}) =>  {
          const state = getState()
          state.player.piece.pos.x.should.equal(6);
          state.player.piece.pos.y.should.equal(6);
          state.player.piece.collided.should.equal(false);
          done()
        }
      })
      store.dispatch(action.updatePlayerPosition(null, 1, false));
    });
  });
  
  it('Update tetromino', (done) => {
    const initialState = {
      player: {
        grid: initialBoard(),
        pieces: [
          [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]
          ],
          [
            [0, 0, 3],
            [3, 3, 3],
            [0, 0, 0]
          ],
          [
            [4, 4],
            [4, 4]
          ]
        ],
        piece: {
          tetromino: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
          ],
          pos: {
            x: 5,
            y: 6
          },
          collided: false,
          new: false
        }
      }
    };
    const expectedTetromino = [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0]
    ];
    const store =  configureStore(rootReducer, null, initialState, {
      UPDATE_TETROMINO: ({dispatch, getState}) =>  {
        const state = getState()
        state.player.piece.tetromino.should.eql(expectedTetromino);
        done()
      }
    })
    store.dispatch(action.updateTetromino());
  });

  it('game over', function(done){
    const initialState = {
      player: {
        gameOver: null
      }
    };
    const store =  configureStore(rootReducer, null, initialState, {
      SET_GAME_OVER: ({dispatch, getState}) =>  {
        const state = getState()
        state.player.gameOver.should.equal(true)
        done()
      }
    })
    store.dispatch(action.setGameOver());
  });

  it('set delay', (done) => {
    const initialState = {
      player: {
        delay: null
      }
    };
    const store =  configureStore(rootReducer, null, initialState, {
      SET_DELAY: ({dispatch, getState}) =>  {
        const state = getState()
        state.player.delay.should.equal(1500)
        done()
      }
    })
    store.dispatch(action.setDelay(1500));
  });

  it('remove error', (done) => {
    const initialState = {
      error: 'This is a sample error message'
    }
    const store =  configureStore(rootReducer, null, initialState, {
      REMOVE_ERROR: ({dispatch, getState}) =>  {
        const state = getState();
        state.should.eql({error: null})
        done()
      }
    })
    store.dispatch(action.removeError());
  });

  it('swap pieces', (done) => {
    const initialState = {
      player: {
        pieces: [
          [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]
          ],
          [
            [0, 0, 3],
            [3, 3, 3],
            [0, 0, 0]
          ],
          [
            [4, 4],
            [4, 4]
          ]
        ],
      }
    }
    const expectedPieces = [
      [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
      ],
      [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
      ],
      [
        [4, 4],
        [4, 4]
      ]
    ];
    const store =  configureStore(rootReducer, null, initialState, {
      SWAP_PIECES: ({dispatch, getState}) =>  {
        const state = getState();
        state.player.pieces.should.eql(expectedPieces);
        done()
      }
    })
    store.dispatch(action.swapPieces());
  });
  
  it('set isPlaying', (done) => {
    const initialState = {
      player: {
        isPlaying: false
      }
    };
    const store =  configureStore(rootReducer, null, initialState, {
      SET_IS_PLAYING: ({dispatch, getState}) =>  {
        const state = getState();
        state.player.isPlaying.should.eql(true);
        done()
      }
    })
    store.dispatch(action.setIsPlaying(true));
  });

  it('set room over', (done) => {
    const initialState = {
      player: {
        roomOver: false
      }
    };
    const store =  configureStore(rootReducer, null, initialState, {
      SET_ROOM_OVER: ({dispatch, getState}) =>  {
        const state = getState();
        state.player.roomOver.should.eql(true);
        done()
      }
    })
    store.dispatch(action.setRoomOver());
  });

  it('Set is master', (done) => {
    const initialState = {
      player: {
        isMaster: false
      }
    };
    const store =  configureStore(rootReducer, null, initialState, {
      SET_IS_MASTER: ({dispatch, getState}) =>  {
        const state = getState();
        state.player.isMaster.should.equal(true);
        done()
      }
    })
    store.dispatch(action.setIsMaster(true));
  });

});
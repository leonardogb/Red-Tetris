import { configureStore } from '../helpers/server';
import rootReducer from '../../src/client/reducers';
import * as types from '../../src/client/actions/actionTypes';
import { initialBoard, initialSpectre } from '../../src/client/gameHelpers';
import { Piece } from '../../src/server/Piece';

describe('Reducers', () => {
    it('Update player position', (done) => {
        const board = initialBoard();
        board.shift();
        board.push([
            [1, true],
            [1, true],
            [1, true],
            [1, true],
            [1, true],
            [1, false],
            [1, true],
            [1, true],
            [1, true],
            [1, true]
            ]);
        const initialState = {
            player: {
                grid: initialBoard(),
                pieces: [
                  [
                    [2, 0, 0],
                    [2, 2, 2],
                    [0, 0, 0],
                  ],
                  [
                    [0, 0, 3],
                    [3, 3, 3],
                    [0, 0, 0],
                  ],
                  [
                    [4, 4],
                    [4, 4],
                  ],
                ],
                piece: {
                  tetromino: [
                    [0, 0, 3],
                    [3, 3, 3],
                    [0, 0, 0],
                  ],
                  pos: {
                    x: 5,
                    y: 20,
                  }
                }
              }
        };
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.UPDATE_PLAYER_POSITION, payload: {
            y: 1,
            x: null,
            collided: false
          }});
        done();
    });

    it('set username', (done) => {
        const initialState = {
            curUser: null
        };
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.SET_USERNAME, payload: { username: 'test42'}});
        done();
    });
    
    it('Set playersGames', (done) => {
        const initialState = {
            playersGames: null
        };
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.SET_PLAYERS_GAMES, payload: { games: 'games'}});
        done();
    });

    describe('Update board', () => {
        it('player is playing', (done) => {
            const initialState = {
                player: {
                    isPlaying: true,
                    grid: null,
                    delay: null
                }
            };
            const store = configureStore(rootReducer, null, initialState);

            store.dispatch({type: types.UPDATE_BOARD, payload: { newBoard: initialBoard()}});
            done();
        });
        it('player is not playing', (done) => {
            const initialState = {
                player: {
                    isPlaying: false,
                    grid: null,
                    delay: null
                }
            };
            const store = configureStore(rootReducer, null, initialState);

            store.dispatch({type: types.UPDATE_BOARD, payload: { newBoard: initialBoard()}});
            done();
        });
    });

    it('Set pieces', (done) => {
        const pieces = Piece.getTetrominos(5);
        const initialState = {
            player: {
                pieces: []
            }
        };
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.SET_PIECES, payload: { pieces: pieces}});
        done();
    });
    it('Start game', (done) => {
        const initialState = {};
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.START_GAME});
        done();
    });
    it('Set player', (done) => {
        const initialState = {
            error: 'This is an error message',
            player: null,
            curRoom: null,
            curUser: null
        };
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch(
            {
                type: types.SET_PLAYER,
                payload: {
                    player: {
                        name: 'testName'
                    },
                    game: {
                        room: 'roomName'
                    }
                }
            }
        );
        done();
    });

    it('Swap pieces, one piece', (done) => {
        const initialState = {
            player: {
                pieces: [
                  [
                    [4, 4],
                    [4, 4],
                  ],
                ],
              }
        };
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.SWAP_PIECES});
        done();
    });
    describe('Spectres', () => {
        it('Update spectre', (done) => {
            const initialState = {
                spectres: [
                    {
                        playerName: 'test',
                        spectre: null
                    }
                ]
            };
            const store = configureStore(rootReducer, null, initialState);

            store.dispatch({type: types.SET_SPECTRES, payload: {
                username: 'test',
                spectre: initialSpectre()
            }});
            done();
        });
        it('Set spectre', (done) => {
            const initialState = {
                spectres: [
                    {
                        playerName: 'test2',
                        spectre: null
                    }
                ]
            };
            const store = configureStore(rootReducer, null, initialState);

            store.dispatch({type: types.SET_SPECTRES, payload: {
                username: 'test',
                spectre: initialSpectre()
            }});
            done();
        });
        it('Set spectres when it\'s null', (done) => {
            const initialState = {
                spectres: null
            };
            const store = configureStore(rootReducer, null, initialState);

            store.dispatch({type: types.SET_SPECTRES, payload: {
                username: 'test',
                spectre: initialSpectre()
            }});
            done();
        });
        it('Return state spectre', (done) => {
            const initialState = {
                spectres: null
            };
            const store = configureStore(rootReducer, null, initialState);

            store.dispatch({type: types.SET_SPECTRES, payload: {
                username: 'test',
                spectre: null
            }});
            done();
        });
    });

    describe('Remove spectres', () => {
        it('Remove spectre by username', (done) => {
            const initialState = {
                spectres: [
                    {
                        playerName: 'test',
                        spectre: null
                    }
                ]
            };
            const store = configureStore(rootReducer, null, initialState);

            store.dispatch({type: types.REMOVE_SPECTRE, payload: {
                username: 'test',
            }});
            done();
        });
        it('Return state spectre', (done) => {
            const initialState = {
                spectres: null
            };
            const store = configureStore(rootReducer, null, initialState);

            store.dispatch({type: types.REMOVE_SPECTRE, payload: {
                username: 'test',
            }});
            done();
        });
    });

    it('Set malus', (done) => {
        const initialState = {
            player: {
                grid: initialBoard()
            }
        };
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.SET_MALUS, payload: {
            malus: [
                [1, 1, 1, 1, 1, 0, 1, 1, 1, 1]
            ]
        }});
        done();
    });

    it('Update score', (done) => {
        const initialState = {
            player: {
                score: 90
            }
        };
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.UPDATE_SCORE, payload: { score: 10 }});
        done();
    });

    it('Set error', (done) => {
        const initialState = {
            error: null
        };
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.SET_ERROR, payload: { error: 'Error 404' }});
        done();
    });

    it('Restart game', (done) => {
        const initialState = {};
        const store = configureStore(rootReducer, null, initialState);

        store.dispatch({type: types.RESTART_GAME, payload: { grid: initialBoard() }});
        done();
    });
    
});

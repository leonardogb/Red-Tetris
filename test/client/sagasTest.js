
import { expectSaga } from 'redux-saga-test-plan';
import rootSaga from '../../src/client/sagas/rootSaga';
import openSocket from 'socket.io-client';
import boardSaga from '../../src/client/sagas/boardSaga';
import socketSaga from '../../src/client/sagas/socketSaga';
import { initialBoard } from '../../src/client/gameHelpers';
import { randomTetromino } from '../../src/client/tetrominos';
import { actionChannel } from 'redux-saga/effects'

const socket = openSocket('http://localhost:3004');
 
describe('Sagas test', () => {
    it('rootSaga', (done) => {
        
        const mainSaga = rootSaga();
        mainSaga.next().value;
        done();
    });
    it('boardSaga', () => {
    
        const testBoard = initialBoard();
        testBoard.shift();
        testBoard.push([
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
        const state = {
            socket: socket,
            player: {
                grid: testBoard,
                pieces: [],
                piece: {
                    tetromino: randomTetromino(),
                    pos: {
                    x: 5,
                    y: 6,
                    },
                    collided: true,
                    new: false,
                },
                delay: null,
                gameOver: false,
                isPlaying: false,
                isMaster: true,
                roomOver: false
            }
        };
        return expectSaga(boardSaga)

            .withState(state)
        
            // Dispatch any actions that the saga will `take`.
            .dispatch({ type: 'UPDATE_GRID' })
        
            // Start the test. Returns a Promise.
            // no warning message will be printed
            // this is useful if you expect the saga to time out
            .silentRun();
    });

    it('socketSaga', () => {
        socket.emit('getGame', {username: 'usernameTest', room: 'roomTest'});
        return expectSaga(socketSaga, socket)


        .provide([
            [actionChannel('serverAction'), socket],
      
            {
              take({ channel }, next) {
                channel.close();
                return next();
              },
            },
          ])
            // Start the test. Returns a Promise.
            // no warning message will be printed
            // this is useful if you expect the saga to time out
            .silentRun();
    });
});

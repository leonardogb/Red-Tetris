import { select, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as types from '../actions/actionTypes';

// worker Saga: will be fired on UPDATE_GRID actions
function* updateBoard(action) {
   try {
       const getPlayer = (state) => state.player;
       const player = yield select(getPlayer);
       const socket = yield select(state => state.socket);

        if (player.grid) {
            let newBoard = player.grid.map(row =>
                row.map(cell => (cell[1] ? cell : [0, false]))
                );
            player.piece.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0 && newBoard[y + player.piece.pos.y]) {
                        newBoard[y + player.piece.pos.y][x + player.piece.pos.x] = [
                            value,
                            player.piece.collided,
                        ];
                    }
                });
            });
            
            if (player.piece.collided) {
                const malusArray = [];
                newBoard = newBoard.reduce((ack, row, index) => {
                    if (row.findIndex(cell => cell[0] === 0 || cell[0] === 8) === -1) {
                        // Gestión de puntos
                        malusArray.push(player.grid[index]);
                        ack.unshift(new Array(newBoard[0].length).fill([0, false]));
                        return ack;
                    }
                    ack.push(row);
                    return ack;
                }, []);
                if (malusArray.length > 0) {
                    yield put({type: types.UPDATE_SCORE, payload: {score: 10 * malusArray.length}})
                    socket.emit('malus', {malus: malusArray});
                }
            }
            yield put({type: types.UPDATE_BOARD, payload: {newBoard: newBoard}});
        }
   } catch (e) {
        yield put({type: "UPDATE_BOARD_FAILED", message: e.message});
   }
}

/*
  Starts fetchUser on each dispatched `UPDATE_GRID` action.
  Allows concurrent fetches of user.
*/
function* mySaga() {
  yield takeLatest(types.UPDATE_GRID, updateBoard);
}

export default mySaga;
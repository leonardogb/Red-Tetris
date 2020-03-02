import { takeEvery, put, select } from 'redux-saga/effects';

function* updateBoard(action) {
  try {
    console.log('Saga');
    // const getPlayer = (state) => state.player;
    // const player = yield select(getPlayer);
    // if (player) {
    //   yield put({
    //     type: 'UPDATE_BOARD',
    //     payload: {
    //       room: 'Test',
    //       player: 'Leo'
    //     }
    //   });
    // }
  } catch (e) {
    //
  }

}

function* watchUpdatePlayerPosition() {
  console.log('test')
  yield takeEvery('UPDATE_PLAYER_POSITION', updateBoard);
}

export default watchUpdatePlayerPosition;

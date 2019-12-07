import { takeEvery, put, select } from 'redux-saga/effects';

function* updateBoard() {
  try {
    const getPlayer = (state) => state.player;
    const player = yield select(getPlayer);
    console.log(player);
    if (player) {
      yield put({type: 'UPDATE_BOARD'});
    }
  } catch (e) {
    //
  }

}

function* watchUpdatePlayerPosition() {
  yield takeEvery('UPDATE_PLAYER_POSITION', updateBoard);
}

export default watchUpdatePlayerPosition;

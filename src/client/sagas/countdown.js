import { take, put, call, takeEvery, select, all } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga';
import {checkCollision} from "../gameHelpers";

const countdown = (player) => {
  return eventChannel(emitter => {
      const iv = setInterval(() => {

        if (checkCollision(player.piece, player.grid, {x: 0, y: 1})) {
          emitter(END);
        } else {
          emitter({
            type: 'UPDATE_PLAYER_POSITION',
            payload: {
              y: 1,
              x: null,
              collided: false
            }
          });
        }
      }, 1000);
      // The subscriber must return an unsubscribe function
      return () => {
        clearInterval(iv)
      }
    }
  )
};

function* pieceDown() {
  const getPlayer = (state) => state.player;
  const player = yield select(getPlayer);
  const chan = yield call(countdown, player);
  try {
    let action = yield take(chan);
    yield all([
      put(action)
    ]);
    // while (true) {
    //   // take(END) will cause the saga to terminate by jumping to the finally block
    //
    // }
  } finally {
    console.log('countdown terminated')
  }
}

function* countDownSaga() {
  // yield takeEvery('UPDATE_PLAYER_POSITION', pieceDown);
}

export default countDownSaga;

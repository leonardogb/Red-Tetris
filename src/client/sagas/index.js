import { takeEvery, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import {setUsername} from "../actions/setUsername";

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

function* watchUpdatePlayerPosition(socket, dispatch) {
  console.log('watchUpdatePlayerPosition');

  return eventChannel(emit => {
    socket.on('setUsername', () => { console.log('prueba')})
    
    const unsubscribe = () => {
      socket.off('ping')
    }

    return unsubscribe
  });
  yield takeEvery('UPDATE_PLAYER_POSITION', updateBoard);
}

export default watchUpdatePlayerPosition;

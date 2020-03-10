import { takeEvery, put, select, call, take } from 'redux-saga/effects';
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

// this function creates an event channel from a given socket
// Setup subscription to incoming `ping` events
function createSocketChannel(socket) {
  // `eventChannel` takes a subscriber function
  // the subscriber function takes an `emit` argument to put messages onto the channel
  return eventChannel(emit => {

    const serverAction = (event) => {
      // puts event payload into the channel
      // this allows a Saga to take this payload from the returned channel
      emit(event.action);
    };

    const errorHandler = (errorEvent) => {
      // create an Error object and put it into the channel
      emit(new Error(errorEvent.reason))
    };

    // setup the subscription
    socket.on('serverAction', serverAction);
    socket.on('error', errorHandler);

    // the subscriber must return an unsubscribe function
    // this will be invoked when the saga calls `channel.close` method
    const unsubscribe = () => {

    };

    return unsubscribe
  })
}

function* watchSockets(socket, dispatch) {
  console.log('socketSaga');

  const socketChannel = yield call(createSocketChannel, socket);

  while (true) {
    try {
      const action = yield take(socketChannel);
      yield put(action);
      // yield put({
      //   type: 'UPDATE_PLAYER_POSITION',
      //   payload: {
      //     y: 1,
      //     x: null,
      //     collided: false
      //   }
      // })
    } catch (err) {
      console.error('socket error:', err);
      // socketChannel is still open in catch block
      // if we want end the socketChannel, we need close it explicitly
      // socketChannel.close();
    }
  }
  // return eventChannel(emit => {
  //   socket.on('setUsername', () => { console.log('prueba')})
  //
  //   const unsubscribe = () => {
  //     socket.off('ping')
  //   }
  //
  //   return unsubscribe
  // });
  // yield takeEvery('UPDATE_PLAYER_POSITION', updateBoard);
}

export default watchSockets;

import { put, call, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';

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

function* watchSockets(socket) {
  console.log('socketSaga');

  const socketChannel = yield call(createSocketChannel, socket);

  while (true) {
    try {
      const action = yield take(socketChannel);
      yield put(action);
    } catch (err) {
      console.error('socket error:', err);
      // socketChannel is still open in catch block
      // if we want end the socketChannel, we need close it explicitly
      // socketChannel.close();
    }
  }
}

export default watchSockets;

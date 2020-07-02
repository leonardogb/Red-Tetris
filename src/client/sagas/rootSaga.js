import { all } from 'redux-saga/effects';
import socketSaga from './socketSaga';
import boardSaga from './boardSaga';

function* rootSaga(socket) {
    yield all([
      socketSaga(socket),
      boardSaga()
    ])
  }

  export default rootSaga;
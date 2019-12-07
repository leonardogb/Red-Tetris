
import React from 'react';
import ReactDom from 'react-dom';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import reducer from './reducers';
import App from './containers/app';
import { alert } from './actions/alert';
import './style.css';
import {initialBoard} from './gameHelpers';
import { setPlayer } from './actions/setPlayer';
import { updatePlayerPosition } from './actions/updatePlayerPosition';
import { updateBoard } from './actions/updateBoard';
import createSagaMiddleware from 'redux-saga';
import watchUpdatePlayerPosition from './sagas/index';

import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3004');

socket.on('action', type => {
  console.log(type)
});

socket.emit('action', {type: 'server/ping'});

const initialState = {
  message: '',
  board: initialBoard(),
  player: null,
  room: null,
};
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(sagaMiddleware, createLogger())),
);
sagaMiddleware.run(watchUpdatePlayerPosition);

// const keyDown = (keyCode) => {
//
//   store.dispatch(updatePlayerPosition(1));
//   store.dispatch(updateBoard());
// };

ReactDom.render((
  <Provider store={store}>
    <App socket={socket} />
  </Provider>
), document.getElementById('tetris'));

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'));




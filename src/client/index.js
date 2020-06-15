
import React from 'react';
import ReactDom from 'react-dom';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import reducer from './reducers';
import App from './containers/app';
import './style.css';

import createSagaMiddleware from 'redux-saga';
// import socketSaga from './sagas/socketSaga';
import rootSaga from './sagas/rootSaga';

import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3004'); // prevent the initial http polling , {transports: ['websocket'], upgrade: false}

socket.emit('action', {type: 'server/ping'});

const initialState = {
  socket: socket,
  id: null,
  isMaster: null,
  player: {
    // grid: initialBoard(),
    grid: null,
    pieces: [],
    piece: {
      tetromino: [],
      pos: {
        x: 0,
        y: 0
      },
      collided: false
    },
    gameOver: null,
    status: null,
    delay: null,
    new: false,
    score: 0
  },
  curUser: null,
  curRoom: null,
  rooms: [],
  playersGames: {}
};
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  initialState,
  // composeEnhancer(applyMiddleware(sagaMiddleware, createLogger())),
  composeEnhancer(applyMiddleware(sagaMiddleware)),
);
// sagaMiddleware.run(socketSaga, socket, store.dispatch);
sagaMiddleware.run(rootSaga, socket, store.dispatch);

// const keyDown = (keyCode) => {
//
//   store.dispatch(updatePlayerPosition(1));
//   store.dispatch(action.updateBoard());
// };

ReactDom.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('tetris'));



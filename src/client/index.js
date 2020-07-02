import React from 'react';
import ReactDom from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';
import App from './containers/app';
import { HashRouter } from 'react-router-dom';

import './style.css';

import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';

import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3004');

socket.emit('action', {type: 'server/ping'});

const initialState = {
  message: '',
  socket: socket,
  id: null,
  isMaster: null,
  player: {
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
    roomOver: false,
    status: null,
    isPlaying: false,
    delay: null,
    timer: null,
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
  composeEnhancer(applyMiddleware(sagaMiddleware)),
);
sagaMiddleware.run(rootSaga, socket, store.dispatch);


ReactDom.render((
  <Provider store={store}>
    <HashRouter hashType="noslash">
    <App />
    </HashRouter>
  </Provider>
), document.getElementById('tetris'));



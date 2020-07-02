import React from 'react';
import App from '../../../src/client/containers/app';
import { shallow, render } from 'enzyme';
import { Provider } from 'react-redux';
import { configureStore } from '../../helpers/server'
import rootReducer from '../../../src/client/reducers'
import { startServer } from '../../helpers/server'
import params from '../../../params';
import io from 'socket.io-client';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import { initialBoard } from '../../../src/client/gameHelpers';

describe('App Component', () => {
  let initialState = {}
  let store = {};
  const context = {};
  let paramsTest = params;
  paramsTest.server.port = 3007;
  let socket = io(paramsTest.server.url);
  let location = '';
  let error = false;

  afterEach(() => {
    const wrapper = mount(

      <Provider store={store}>
        <StaticRouter location={location} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )

    if (error)
      wrapper.find('.error').simulate('click');
      error = false;
  });

  it('Render the App', (done) => {
    initialState = {
      socket: socket,
      player: {
        delay: null,
        socketId: socket.id,
        pieces: [
          [
            [4, 4],
            [4, 4],
          ],
          [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0],
          ],
          [
            [0, 0, 3],
            [3, 3, 3],
            [0, 0, 0],
          ],
        ],
        piece: {
          tetromino: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
          ],
          pos: {
            x: 5,
            y: 6
          },
          collided: false,
          new: false
        }
      }
    }
    store = configureStore(rootReducer, null, initialState);
    done();
  });

  it('renders the App piece new', (done) => {
    initialState.player.piece.new = true;
    store = configureStore(rootReducer, null, initialState);
    done();
  });

  it('renders the App piece new and pos y 0', (done) => {
    initialState.player.piece.pos.y = 0;
    initialState.player.piece.collided = true;
    store = configureStore(rootReducer, null, initialState);
    done();
  });

  it('renders the App hash router', (done) => {
    location = '/testRoom[testPlayer]';
    done();
  });

  it('renders the App click error', (done) => {
    initialState.error = 'test error';
    store = configureStore(rootReducer, null, initialState);
    error = true;
    done();
  });

  it('renders the App updateTetronimo', (done) => {
    initialState.player.grid = initialBoard();
    initialState.player.piece.pos.y = 2;
    initialState.player.pieces = [
      [
        [4, 4],
        [4, 4],
      ],
      [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
      ],
      [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
      ],
      [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0],
      ],
    ];
    store = configureStore(rootReducer, null, initialState);
    done();
  });

})

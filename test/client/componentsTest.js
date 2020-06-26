import jsdom from 'jsdom';
import chai from 'chai';
import React from 'react';
import { configureStore } from '../helpers/server';
import rootReducer from '../../src/client/reducers';
import { Provider } from 'react-redux';

import { shallow, render, mount } from 'enzyme';
import Square from '../../src/client/components/Square';
import Board from '../../src/client/components/Board';
import Error from '../../src/client/components/Error';
import Footer from '../../src/client/components/Footer';
import { initialBoard, initialSpectre } from '../../src/client/gameHelpers';
import GamesList from '../../src/client/components/GamesList';
import openSocket from 'socket.io-client';
import NextPiece from '../../src/client/components/NextPiece';
import ToggleSwitch from '../../src/client/components/ToggleSwitch';
import Spectres from '../../src/client/components/Spectres';
import Login from '../../src/client/components/Login';
import BoardGame from '../../src/client/components/BoardGame';
const  socket = openSocket('http://localhost:3004');

chai.should()

const { JSDOM } = jsdom;
const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;
const  LocalStorageMock = {

  store: {
    id: '1234'
  },
  
  clear: function() {
    this.store = {};
  },

  getItem: function(key) {
    return this.store[key] || null;
  },

  setItem: function(key, value) {
    this.store[key] = value.toString();
  },

  removeItem: function(key) {
    delete this.store[key];
  }
};

global.localStorage = LocalStorageMock;

describe('Components renders', function(){
  it('Square component', () => {
      shallow(<Square />);
  });

  it('Error component', () => {
    const initialState = {};
    const store =  configureStore(rootReducer, null, initialState);
    const error = render(
      <Provider store={store}>
        <Error />
      </Provider>
      );
  });

  it('Footer component', () => {
    const initialState = {};
    const store =  configureStore(rootReducer, null, initialState);
    const footer = mount(
    <Provider store={store}>
      <Footer />
    </Provider>
    );
    const expectedHtml = '<div class="full-footer"><div class="sub-footer"><div class="arrow-up"></div></div></div>';
    const expectedClickHtml = '<div class="full-footer"><div class="sub-footer"><div class="arrow-down"></div></div><div class="main-footer"><div class="container"><div class="row"><div class="social"><h4>LGARCIA-</h4><div class="row"><a href="https://github.com/leonardogb" target="_blank" class="fa fa-github" title="Github lgarcia-"></a><a href="https://www.linkedin.com/in/leonardogb/" target="_blank" class="fa fa-linkedin" title="Linkedin lgarcia-"></a></div></div><div class="social"><h4>DEWALTER</h4><div class="row"><div><a href="https://github.com/nis267" target="_blank" class="fa fa-github" title="Github dewalter"></a></div><div><a href="https://www.linkedin.com/in/denis-walter/" target="_blank" class="fa fa-linkedin" title="Linkedin dewalter"></a></div></div></div></div><div class="row"><p>©2020 <a href="/src/assets/red_tetris.fr.pdf" class="subject" target="_blank" title="red tetris subject">Red Tetris</a></p></div></div></div></div>';
    footer.html().should.equal(expectedHtml);
    footer.findWhere(node => node.hasClass('sub-footer')).simulate('click');
    footer.html().should.equal(expectedClickHtml);
  });

  describe('Board component', () => {
    it('Board component with grid', () => {
      const initialState = {
        player: {
          grid: initialBoard()
        }
      };
      const store =  configureStore(rootReducer, null, initialState);
      const wrapper =  mount(
      <Provider store={store}>
        <Board />
      </Provider>
      );
    });
    it('Board component without grid', () => {
      const initialState = {};
      const store =  configureStore(rootReducer, null, initialState);
      const wrapper =  mount(
      <Provider store={store}>
        <Board />
      </Provider>
      );
    });
  });
  
  it('Games list', () => {
    const initialState = {};
    const playersGames = {
      test2: [
        [
          'test2',
          50
        ]
      ]
    };
    const store =  configureStore(rootReducer, null, initialState);
    const wrapper =  mount(
    <Provider store={store}>
      <GamesList playersGames={playersGames} socket={socket} />
    </Provider>
    );
    wrapper.find('.game').simulate('click');
  });

  describe('NextPiece component', () => {
    it('NextPiece with pieces', () => {
      const initialState = {
        player: {
          pieces: [
            [
              [4, 4],
              [4, 4]
            ],
            [
              [2, 0, 0],
              [2, 2, 2],
              [0, 0, 0]
            ],
            [
              [0, 0, 3],
              [3, 3, 3],
              [0, 0, 0]
            ]
          ]
        }
      };
      const store =  configureStore(rootReducer, null, initialState);
      const wrapper =  mount(
      <Provider store={store}>
        <NextPiece />
      </Provider>
      );
    });
    it('NextPiece without pieces', () => {
      const initialState = {
        player: {
          pieces: []
        }
      };
      const store =  configureStore(rootReducer, null, initialState);
      const wrapper =  mount(
      <Provider store={store}>
        <NextPiece />
      </Provider>
      );
    });
  });
  
  it('ToggleSwitch component', () => {
    const initialState = {
      switchValue: true
    };
    const setIsDestructible = () => {};
    const store =  configureStore(rootReducer, null, initialState);
    const wrapper =  mount(
    <Provider store={store}>
      <ToggleSwitch isOn={store.switchValue} onColor="#41C83C" handleToggle={() => setIsDestructible()} id="react-switch-new" />
    </Provider>
    );
    wrapper.find('input#react-switch-new').simulate('click');
  });

  describe('Spectres component', () => {
    it('Spectres if is playing', () => {
      let spectre = initialSpectre();
      spectre.shift();
      spectre.push([1, 1, 1, 0, 0, 2, 2, 3, 3, 3]);
      const initialState = {
        player: {
          isPlaying: true
        },
        spectres: [
          {
          playerName: 'test2',
          spectre: spectre,
          score: 50
          }
        ]
      };
      let store =  configureStore(rootReducer, null, initialState);
      let state = store.getState();
      let wrapper =  mount(
      <Provider store={store}>
        <Spectres isPlaying={state.player.isPlaying} />
      </Provider>
      );
    });
    it('Without Spectres if is not playing', () => {
      let spectre = initialSpectre();
      spectre.shift();
      spectre.push([1, 1, 1, 0, 0, 2, 2, 3, 3, 3]);
      const initialState = {
        player: {
          isPlaying: false
        },
      };
      let store =  configureStore(rootReducer, null, initialState);
      let state = store.getState();
      let wrapper =  mount(
      <Provider store={store}>
        <Spectres isPlaying={state.player.isPlaying} />
      </Provider>
      );
    });
    it('With Spectres if is playing', () => {
      let spectre = initialSpectre();
      spectre.shift();
      spectre.push([1, 1, 1, 0, 0, 2, 2, 3, 3, 3]);
      const initialState = {
        player: {
          isPlaying: true
        },
      };
      let store =  configureStore(rootReducer, null, initialState);
      let state = store.getState();
      let wrapper =  mount(
      <Provider store={store}>
        <Spectres isPlaying={state.player.isPlaying} />
      </Provider>
      );
    });
  });
  
  it('Login component', () => {

    const initialState = {
      socket: socket,
      playersGames: {
        test2: [
          [
            'test2',
            50
          ]
        ]
      },
      player: {
        delay: 1000
      }
    };
    const store =  configureStore(rootReducer, null, initialState);
    const state = store.getState();
    const wrapper =  mount(
    <Provider store={store}>
      <Login />
    </Provider>
    );
    socket.emit('getGame', {username: 'test', room: 'test'});
    wrapper.find('input[name="room"]').simulate('input', { target: { value: "Hola" }});
    wrapper.find('input[name="username"]').simulate('input', { target: { value: "Hola" }});
    wrapper.find('input[name="room"]').simulate('keypress', {key: 'a'});
    wrapper.find('input[name="username"]').simulate('keypress', {key: 'a'});
    wrapper.find('input[name="room"]').simulate('keypress', {key: 'Enter', charCode: 13});
    wrapper.find('input[name="username"]').simulate('keypress', {key: 'Enter', charCode: 13});
    wrapper.find('.buttonLogin').simulate('click');
    // console.log(wrapper.find('input[name="username"]').props());
  });

  it('BoardGame component', () => {
    const initialState = {
      socket: socket,
      curRoom: 'test',
      curUser: 'test',
      player: {
        grid: initialBoard(),
        pieces: [
          [
            [2, 0, 0],
            [2, 2, 2],
            [0, 0, 0]
          ],
          [
            [0, 0, 3],
            [3, 3, 3],
            [0, 0, 0]
          ],
          [
            [4, 4],
            [4, 4]
          ]
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
        },
        gameOver: null,
        isPlaying: false,
        isMaster: true
      }
    };
    let store =  configureStore(rootReducer, null, initialState);
    let state = store.getState();
    let wrapper =  mount(
    <Provider store={store}>
      <BoardGame />
    </Provider>
    );
  });

})

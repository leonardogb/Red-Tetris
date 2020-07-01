import React from 'react';
import '../../src/server/main';
import io from 'socket.io-client';
import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import { startServer } from '../helpers/server'
import params from '../../params';
import { initialBoard, initialSpectre } from '../../src/client/gameHelpers';
import { configureStore } from '../helpers/server'
import rootReducer from '../../src/client/reducers'
import { shallow, render, mount } from 'enzyme';
import { Provider } from 'react-redux';
import App from '../../src/client/containers/app';
import { createBrowserHistory, createMemoryHistory, createHashHistory } from 'history';
import ReactDOM from 'react-dom';
import jsdom from 'mocha-jsdom';
import { StaticRouter, MemoryRouter } from 'react-router-dom';
import spies from 'chai-spies';
import jest from 'jest'
// import { renderHook, act } from '@testing-library/react-hooks'
// const history = createBrowserHistory(/* ... */);
// const history = createMemoryHistory();
// sinon.spy(history, "push");

// // now you should be able to run assertions on history.push

// assert(history.push.calledOnce)

chai.use(chaiHttp);
chai.use(spies)
var expect = chai.expect;

describe('Check index server', () => {


  let tetrisServer;
  let socket;
  let socket1;
  let socket2
  let paramsTest = params;
  paramsTest.server.port = 3006;

  before(cb => startServer(paramsTest.server, function (err, server) {
    tetrisServer = server
    socket = io(paramsTest.server.url);
    socket.room = 'testRoom';
    socket1 = io(paramsTest.server.url);
    socket1.room = 'testRoom';
    socket2 = io(paramsTest.server.url);
    cb()
  }))

  after(function (done) { tetrisServer.stop(done) })

  it('test initApp', (done) => {

    chai.request(params.server.url)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
    done();
  });

  it('test initApp err', (done) => {

    fs.rename(__dirname + '/../../index.html', __dirname + '/../../index_new.html', (err) => {
      if (err) {
        console.log('rename before: ', err);
      }
    });

    chai.request(params.server.url)
      .get('/')
      .end((err, res) => {
        fs.rename(__dirname + '/../../index_new.html', __dirname + '/../../index.html', (err) => {
          console.log('rename after: ', err);
        });
        expect(res).to.have.status(500);
      });
    done();
  });

  it('test socket getGame with data', (done) => {
    socket.emit('getGame', { username: 'testPlayer', room: 'testRoom' });
    done();
  });

  it('test socket1 getGame with data', (done) => {
    socket1.emit('getGame', { username: 'testPlayer1', room: 'testRoom' });
    done();
  });

  it('test socket getGame without data', (done) => {
    socket.emit('getGame', { username: '', room: '' });
    done();
  });

  it('test socket getGame without invalid login', (done) => {
    socket.emit('getGame', { username: 'testPlayer!', room: 'testRoom' });
    done();
  });

  it('test socket getGame without invalid room', (done) => {
    socket.emit('getGame', { username: 'testPlayer', room: 'testRoom!' });
    done();
  });

  it('test socket setIsDestructible', (done) => {
    socket.emit('setIsDestructible', false);
    done();
  });

  it('test socket2 getGame room playing', (done) => {
    socket2.emit('getGame', { username: 'testPlayer', room: 'testRoom' });
    done();
  });

  it('test socket play', (done) => {
    socket.emit('play');
    done();
  });

  it('test socket2 getGame room playing', (done) => {
    socket2.emit('getGame', { username: 'testPlayer', room: 'testRoom' });
    done();
  });

  it('test socket malus', (done) => {
    socket.emit('malus', { malus: [[0, 0, 0, 0, 1, 0, 0, 0, 0, 0]] });
    done();
  });

  it('test socket setPlayerGames', (done) => {
    socket.emit('setPlayerGames');
    done();
  });

  it('test socket updateGride', (done) => {
    socket.emit('updateGrid', { grid: initialBoard() });
    done();
  });

  it('test socket updatePlayer', (done) => {
    const initialState = {
      player: {
        socketId: socket.id,
        // grid: initialBoard(),
        // spectre: initialSpectre(),
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
    };
    socket.emit('updatePlayer', initialState);
    done();
  });

  it('test socket getPiece', (done) => {
    socket.emit('getPiece');
    done();
  });

  it('test socket gameOver', (done) => {
    socket.emit('gameOver', { gameOver: false });
    done();
  });

  it('test socket replay', (done) => {
    socket.emit('replay');
    done();
  });

  it('test socket removePlayer', (done) => {
    socket.emit('removePlayer');
    done();
  });

  it('test socket1 removePlayer', (done) => {
    socket1.emit('removePlayer');
    done();
  });

  it('renders the App', (done) => {
    // jsdom();

    const initialState = {
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
        // socketId: socket.id,
        // grid: initialBoard(),
        // spectre: initialSpectre(),
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
    const store = configureStore(rootReducer, null, initialState);
    const context = {};

    // beforeEach(() => {
    // useEffect = jest.spyOn(React, "useEffect").mockImplementation(f => f());
    const error = mount(

      <Provider store={store}>
        <StaticRouter context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )


    // });


    // const app = shallow(
    //   <Provider store={store}>
    //     <StaticRouter   context={context}>
    // <App />
    // </StaticRouter>
    // </Provider>
    // );




    done();
    // const app = shallow(<App />);
  });

  it('renders the App piece new', (done) => {
    // jsdom();

    const initialState = {
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
        // socketId: socket.id,
        // grid: initialBoard(),
        // spectre: initialSpectre(),
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
          new: true
        }
      }
    }
    const store = configureStore(rootReducer, null, initialState);
    const context = {};

    mount(
      <Provider store={store}>
        <StaticRouter context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )
    done();
  });

  it('renders the App piece new and pos 0', (done) => {
    // jsdom();

    const initialState = {
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
        // socketId: socket.id,
        // grid: initialBoard(),
        // spectre: initialSpectre(),
        piece: {
          tetromino: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
          ],
          pos: {
            x: 5,
            y: 0
          },
          collided: true,
          new: true
        }
      }
    }
    const store = configureStore(rootReducer, null, initialState);
    const context = {};

    mount(
      <Provider store={store}>
        <StaticRouter context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )
    done();
  });

  // it('renders the App piece new and pos superior than 1', (done) => {
  //   // jsdom();

  //   const initialState = {
  //     socket: socket,
  //     player: {
  //       delay: null,
  //       socketId: socket.id,
  //       pieces: [
  //         [
  //           [4, 4],
  //           [4, 4],
  //         ],
  //         [
  //           [2, 0, 0],
  //           [2, 2, 2],
  //           [0, 0, 0],
  //         ],
  //         [
  //           [0, 0, 3],
  //           [3, 3, 3],
  //           [0, 0, 0],
  //         ],
  //       ],
  //       // socketId: socket.id,
  //       // grid: initialBoard(),
  //       // spectre: initialSpectre(),
  //       piece: {
  //         tetromino: [
  //           [0, 6, 0],
  //           [6, 6, 6],
  //           [0, 0, 0]
  //         ],
  //         pos: {
  //           x: 5,
  //           y: 2
  //         },
  //         collided: true,
  //         new: false
  //       }
  //     }
  //   }
  //   const store = configureStore(rootReducer, null, initialState);
  //   const context = {};

  //   mount(
  //     <Provider store={store}>
  //       <StaticRouter   context={context}>
  //       <App />
  //       </StaticRouter>
  //     </Provider>
  //   )
  //   done();
  // });

  it('test initApp hash router', (done) => {

    chai.request(params.server.url)
      .get('/#erherherh[wegwegergergrg]')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
      });
    done();
  });

  it('renders the App hash router', (done) => {
    // jsdom();

    const initialState = {
      socket: socket,
      player: {
        delay: 1000,
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
        // socketId: socket.id,
        // grid: initialBoard(),
        // spectre: initialSpectre(),
        piece: {
          tetromino: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
          ],
          pos: {
            x: 5,
            y: 0
          },
          collided: true,
          new: true
        }
      }
    }
    const store = configureStore(rootReducer, null, initialState);
    const context = {};

    mount(
      <Provider store={store}>
        <StaticRouter location={'/testRoom[testPlayer]'} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )
    done();
  });

  it('renders the App hash router', (done) => {
    // jsdom();

    const initialState = {
      socket: socket,
      player: {
        delay: 1000,
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
        // socketId: socket.id,
        // grid: initialBoard(),
        // spectre: initialSpectre(),
        piece: {
          tetromino: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
          ],
          pos: {
            x: 5,
            y: 0
          },
          collided: true,
          new: true
        }
      }
    }
    const store = configureStore(rootReducer, null, initialState);
    const context = {};

    mount(
      <Provider store={store}>
        <StaticRouter location={'/testRoom[testPlayer]'} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )
    done();
  });

  it('renders the App click error', (done) => {
    // jsdom();

    const initialState = {
      error: 'test error',
      socket: socket,
      player: {
        delay: 1000,
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
        // socketId: socket.id,
        // grid: initialBoard(),
        // spectre: initialSpectre(),
        piece: {
          tetromino: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
          ],
          pos: {
            x: 5,
            y: 0
          },
          collided: false,
          new: true
        }
      }
    }
    const store = configureStore(rootReducer, null, initialState);
    const context = {};

    const wrapper = mount(
      <Provider store={store}>
        <StaticRouter location={'/testRoom[testPlayer]'} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )

    wrapper.find('.error').simulate('click');
    done();
  });

  it('renders the App updateTetronimo', (done) => {

    const initialState = {
      socket: socket,
      player: {
        delay: 1000,
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
        grid: initialBoard(),
        piece: {
          tetromino: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
          ],
          pos: {
            x: 5,
            y: 2
          },
          collided: true,
          new: false
        }
      }
    }

    console.log("intilstate pieces: ", initialState.player.pieces.length);
    console.log("intilstate collided: ", initialState.player.piece.collided);
    console.log("intilstate pos y: ", initialState.player.piece.pos.y);
    const store = configureStore(rootReducer, null, initialState);
    const context = {};

    const wrapper = mount(
      <Provider store={store}>
        <StaticRouter context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )

    done();
  });

  it('renders the App updateTetronimo', (done) => {

    const initialState = {
      socket: socket,
      player: {
        delay: 1000,
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
          [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0],
          ],
        ],
        grid: initialBoard(),
        piece: {
          tetromino: [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0]
          ],
          pos: {
            x: 5,
            y: 2
          },
          collided: true,
          new: false
        }
      }
    }
    const store = configureStore(rootReducer, null, initialState);
    const context = {};

    const wrapper = mount(
      <Provider store={store}>
        <StaticRouter context={context}>
          <App />
        </StaticRouter>
      </Provider>
    )

    done();
  });

});

import '../../src/server/main';
import io from 'socket.io-client';
import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import { startServer } from '../helpers/server'
import params from '../../params';
import { initialBoard, initialSpectre } from '../../src/client/gameHelpers';

chai.use(chaiHttp);

var expect = chai.expect;

describe('Check index server', () => {

  let tetrisServer;
  let socket;
  let socket1;
  let socket2
  let paramsTest = params;
  paramsTest.server.port = 3005;

  before(cb => startServer(paramsTest.server, function (err, server) {
    tetrisServer = server
    socket = io(params.server.url);
    socket.room = 'testRoom';
    socket1 = io(params.server.url);
    socket1.room = 'testRoom';
    socket2 = io(params.server.url);
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
    socket.emit('getGame', { username: 'testPlayer', room: 'testRoom'});
    done();
  });

  it('test socket1 getGame with data', (done) => {
    socket1.emit('getGame', { username: 'testPlayer1', room: 'testRoom'});
    done();
  });

  it('test socket getGame without data', (done) => {
    socket.emit('getGame', { username: '', room: ''});
    done();
  });

  it('test socket getGame without invalid login', (done) => {
    socket.emit('getGame', { username: 'testPlayer!', room: 'testRoom'});
    done();
  });

  it('test socket getGame without invalid room', (done) => {
    socket.emit('getGame', { username: 'testPlayer', room: 'testRoom!'});
    done();
  });

  it('test socket setIsDestructible', (done) => {
    socket.emit('setIsDestructible', false);
    done();
  });

  it('test socket2 getGame room playing', (done) => {
    socket2.emit('getGame', { username: 'testPlayer', room: 'testRoom'});
    done();
  });

  it('test socket play', (done) => {
    socket.emit('play');
    done();
  });

  it('test socket2 getGame room playing', (done) => {
    socket2.emit('getGame', { username: 'testPlayer', room: 'testRoom'});
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
    socket.emit('updateGrid', { grid: initialBoard() } );
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

});

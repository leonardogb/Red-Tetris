import { Game } from '../../src/server/Game';

describe('Check Game class', () => {
  it('Game test', (done) => {
    const myGame = new Game('testRoom', 'testPlayer');
    done();
  })
});

import { Player } from '../../src/server/Player';
import chai from "chai";

chai.should();

describe('Check Player class', () => {
  it('Player test', () => {
    const myPlayer = new Player('testPlayer', 1, 2);
    myPlayer.increaseScore(10);
    myPlayer.score.should.equal(10);
    myPlayer.getScore().should.equal(10);
  });
});

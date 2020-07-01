import { Piece } from '../../src/server/Piece';

describe('Check Piece Class', () => {
  it('Piece test', (done) => {
    Piece.randomTetromino();
    Piece.getTetrominos(7);
    done();
  });
});

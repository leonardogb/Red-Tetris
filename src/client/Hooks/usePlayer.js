import { useDispatch, useSelector } from "react-redux";
import { checkCollision } from "../gameHelpers";
import * as action from '../actions/actions';

export  const usePlayer = () => {
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);

  const updatePlayerPos = (y, x, collided ) => {
    dispatch(action.updatePlayerPosition(y, x, collided));
  };

  const drop = (bottom = false) => {
    if (!bottom) {
      if (checkCollision(player.piece, player.grid, { x: 0, y: 1 }) === false) {
        updatePlayerPos(1, null, false);
      }
      else {
        if (player.piece.pos.y < 1) {
          console.log('GAME OVER 1!!!');
          dispatch(action.setGameOver());

          // setDropTime(null);
        }
        else {
          updatePlayerPos(null, null, true);
        }
        console.log('collided');
      }
    } else {
      let tmpPiece = JSON.parse(JSON.stringify(player.piece));
      while (!checkCollision(tmpPiece, player.grid, { x: 0, y: 1 })) {
        tmpPiece.pos.y++;
      }
      updatePlayerPos(tmpPiece.pos.y - player.piece.pos.y, null, true);
    }
  };

  const rotate = (tetromino, dir) => {
    const rotatedTetro = tetromino.map((_, index) => {
      return tetromino.map((col) => {
        return col[index];
      });
    });
    if (dir > 0) {
      return rotatedTetro.map((row) => {
        return row.reverse()
      });
    }
    return rotatedTetro.reverse();
  };

  const pieceRotate = (piece, board, dir) => {
    const clonedPiece = JSON.parse(JSON.stringify(piece));
    clonedPiece.tetromino = rotate(clonedPiece.tetromino, dir);
    clonedPiece.collided = false;

    const pos = clonedPiece.pos.x;
    let offset = 1;
    while (checkCollision(clonedPiece, board, { x: 0, y: 0 })) {
      clonedPiece.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPiece.tetromino[0].length) {
        rotate(clonedPiece.tetromino, -dir);
        clonedPiece.pos.x = pos;
        return;
      }
    }
    dispatch(action.setPiece(clonedPiece));
  };

  return [updatePlayerPos, pieceRotate, drop];
};

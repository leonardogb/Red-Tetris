import {useDispatch} from "react-redux";
import {updatePlayerPosition} from "../actions/updatePlayerPosition";
import {updateTetromino} from "../actions/updateTetromino";
import {checkCollision} from "../gameHelpers";
import {setPiece} from "../actions/setPiece";
import {updateBoard} from "../actions/updateBoard";

export  const usePlayer = () => {
  const dispatch = useDispatch();

  const updatePlayerPos = (y, x, collided ) => {
    dispatch(updatePlayerPosition(y, x, collided));
    if (collided) {
      // buscar otra forma de que se actualice el board sin poner setTimeout
      setTimeout(() => {
        dispatch(updateTetromino());
      });
    }
  };

  const drop = () => {
    //
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
    dispatch(setPiece(clonedPiece));
  };

  return [updatePlayerPos, pieceRotate];
};

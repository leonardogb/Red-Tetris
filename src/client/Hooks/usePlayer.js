import { useDispatch, useSelector } from "react-redux";
import { updatePlayerPosition } from "../actions/updatePlayerPosition";
import { checkCollision } from "../gameHelpers";
import { setPiece } from "../actions/setPiece";

export  const usePlayer = () => {
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);
  const socket = useSelector(state => state.socket);

  const updatePlayerPos = (y, x, collided ) => {
    dispatch(updatePlayerPosition(y, x, collided));
  };

  const drop = () => {
    if (checkCollision(player.piece, player.grid, { x: 0, y: 1 }) === false) {
      updatePlayerPos(1, null, false);
    }
    else {
      if (player.piece.pos.y < 1) {
        console.log('GAME OVER 1!!!');
        dispatch(setGameOver());

        // setDropTime(null);
      }
      else {
        updatePlayerPos(null, null, true);
      }
      console.log('collided');
      socket.emit('updateGrid', { grid: player.grid });
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
    dispatch(setPiece(clonedPiece));
  };

  return [updatePlayerPos, pieceRotate, drop];
};

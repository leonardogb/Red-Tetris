import React from 'react';
import {useSelector} from "react-redux";
import Square from "./Square";

const NextPiece = () => {
  const pieces = useSelector(store => store.player.pieces);

  const resizePiece = (piece) => {
    if (piece) {
      if (piece.length < 4) {
        for (let i = 0; i < 4; i++) {
          if (piece[i]) {
            if (piece[i].length < 4) {
              for (let j = 0; j < 4 - piece[i].length; j++) {
                piece[i].push(0);
              }
            }
          } else {
            piece.push([0, 0, 0, 0]);
          }
        }
      }
      return piece;
    }
  };

  const firstPiece = pieces[0] ? resizePiece([...pieces[0]]) : null;
  const secondPiece = pieces[1] ? resizePiece([...pieces[1]]) : null;
  const emptyPiece = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];


  const style = {
    nextPieceContainer: {
      margin: '30px'
    },
    line: {
      display: 'flex',
      justifyContent: 'center'
    }
  };
  return (
    <div>
      <div style={style.nextPieceContainer}>
        {secondPiece ? secondPiece.map((value, index) =>
          <div key={index} style={style.line}>
            {value.map((sValue, sIndex) => <Square color={sValue} key={sIndex} />)}
          </div>
        ) : emptyPiece.map((row, rIndex) =>
            <div key={rIndex} style={style.line}>
              {row.map((cell, cIndex) => <Square color={cell} key={cIndex}/>)}
            </div>)
        }
      </div>
      <div style={style.nextPieceContainer}>
        {firstPiece ? firstPiece.map((value, index) =>
          <div key={index} style={style.line}>
            {value.map((sValue, sIndex) => <Square color={sValue} key={sIndex} />)}
          </div>
        ) : 
            emptyPiece.map((row, rIndex) =>
            <div key={rIndex} style={style.line}>
              {row.map((cell, cIndex) => <Square color={cell} key={cIndex}/>)}
            </div>)
        }
      </div>
    </div>
  );
};

export default NextPiece;

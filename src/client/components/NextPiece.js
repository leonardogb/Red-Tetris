import React from 'react';
import {useSelector} from "react-redux";
import Square from "./Square";

const NextPiece = () => {
  const pieces = useSelector(store => store.player.pieces);
  let firstPiece = pieces[0] ? [...pieces[0]] : null;

  if (firstPiece) {
    if (firstPiece.length < 4) {
      for (let i = 0; i < 4; i++) {
        if (firstPiece[i]) {
          if (firstPiece[i].length < 4) {
            for (let j = 0; j < 4 - firstPiece[i].length; j++) {
              firstPiece[i].push(0);
            }
          }
        } else {
          firstPiece.push([0, 0, 0, 0]);
        }
      }
    }
  }
  const style = {
    line: {
      display: 'flex',
      justifyContent: 'center'
    }
  };
  return (
    <div>
      {firstPiece ? firstPiece.map((value, index) =>
        <div key={index} style={style.line}>
          {value.map((sValue, sIndex) => <Square color={sValue} key={sIndex} />)}
        </div>
      ) : null
      }
    </div>
  );
};

export default NextPiece;

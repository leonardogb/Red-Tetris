import React from 'react';
import { connect } from 'react-redux';
import { addPiece } from '../actions/addPiece';
import Square from '../components/square';

const Board = ({board, addPiece}) => {
  return (
    <div className={'board'}>
      {board.map((value, index) =>
        <div key={index} className={'line line_' + index}>
          {value.map((sValue, sIndex) => <Square color={sValue} key={sIndex}/>)}
        </div>
        )
      }
      <button onClick={() => addPiece(
        [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0]
        ]
      )}>Click me</button>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    board: state.board,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPiece: (texto) => dispatch(addPiece(texto))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Board)

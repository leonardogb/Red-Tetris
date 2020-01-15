import React from 'react';
import { connect } from 'react-redux';
import Square from '../components/square';
import { useParams } from 'react-router-dom';

const Board = ({board}) => {
    return board ? (
      <div className={'board'}>
        {board.map((value, index) =>
          <div key={index} className={'line line_' + index}>
            {value.map((sValue, sIndex) => <Square color={sValue[0]} key={sIndex}/>)}
          </div>
        )
        }
      </div>
    ) : null;
};

const mapStateToProps = (state) => {
  return {
    board: state.player && state.player.game ? state.player.game.grid : null
  }
};

export default connect(mapStateToProps, null)(Board)

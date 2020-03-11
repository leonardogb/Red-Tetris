import React from 'react';

const colors = [
  '#29393D',
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF'
];

const square = ({color}) => {
  const style = {
    backgroundColor: colors[color],
    width: '30px',
    height: '30px',
    textAlign: 'center',
    border: '1px solid #242e30'
  };
  return (
    <div style={style} />
  )
};

export default square;

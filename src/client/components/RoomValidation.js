import React from 'react';
import { Redirect, useParams } from 'react-router-dom';

const RoomValidation = ({socket}) => {
  const params = useParams();
  socket.emit('validateRoom', { room: params.room, master: params.player });
  socket.on('validateRoom', (isValidRoom) => {
    //
  });
  return (
    <p>Prueba P</p>
  );
};




export default RoomValidation;

import React from 'react';
import { useSelector } from 'react-redux';

const PlayersList = () => {
    const [socket] = useSelector(store => [store.socket]);
    console.log(socket);
    socket.emit('getPlayerList');
    
    // socket.on('setPlayerList', (data) => {
        // console.log('Players: ' + data);
    // });
    return (<div>HELLO</div>);
}

export default PlayersList;
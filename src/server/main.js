import params  from '../../params'
import * as server from './index'

server.create(params.server).then(() => console.log('Ready to play tetris with U ...'));

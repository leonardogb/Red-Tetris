// import React from 'react';
// import App from '../../../src/client/containers/app';
// import { shallow, render } from 'enzyme';
// import { Provider } from 'react-redux';
// import { configureStore } from '../../helpers/server'
// import rootReducer from '../../../src/client/reducers'
// import { startServer } from '../../helpers/server'
// import params from '../../../params';
// // describe('Check App', () => {
// //   it('Test App', (done) => {

// //     done();
// //   });
// // })


// describe('App Component', () => {

//   let tetrisServer;
//   let socket;

//   let paramsTest = params;
//   paramsTest.server.port = 8080;
//   before(cb => startServer(paramsTest.server, function (err, server) {
//     tetrisServer = server
//     socket = io(paramsTest.server.url);
//     cb()
//   }))

//   // after(function (done) { tetrisServer.stop(done) })

//   it('renders the Counter wrapper', (done) => {

//     const initialState = {
//       player: {
//         delay: null,
//         // socketId: socket.id,
//         // grid: initialBoard(),
//         // spectre: initialSpectre(),
//         piece: {
//           tetromino: [
//             [0, 6, 0],
//             [6, 6, 6],
//             [0, 0, 0]
//           ],
//           pos: {
//             x: 5,
//             y: 6
//           },
//           collided: false,
//           new: false
//         }
//       }
//     }
//     const store = configureStore(rootReducer, null, initialState);
//     const error = render(
//       <Provider store={store}>
//         <App />
//       </Provider>
//     );


//     done();
//     // const app = shallow(<App />);
//     // expect(wrapper.find(Counter)).to.have.length(1);
//   });
// });




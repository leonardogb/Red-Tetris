import chai from "chai"
import React from 'react'
// import equalJSX from 'chai-equal-jsx'
// import {TestUtils} from 'react-dom/test-utils'
// import ShallowRenderer from 'react-test-renderer/shallow';
import { shallow } from 'enzyme';
import { Tetris, Board } from '../src/client/components/test'

chai.should()
// chai.use(equalJSX)

// describe('Fake react test', function(){
//   it('works', function(){
//     // const renderer = new ShallowRenderer();
//     const renderer = shallow(<Tetris />);
//     // renderer.render(React.createElement(Tetris))
//     // const output = renderer.getRenderOutput()
//     // output.should.equalJSX(<Board/>)
//     renderer.should.equal(<Board />);
//   })

// })

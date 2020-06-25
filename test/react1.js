import chai from 'chai';
import React from 'react';

import { shallow } from 'enzyme';
import { Tetris, Board, Test } from '../src/client/components/test';

chai.should()

describe('Fake react test', function(){
  it('Render Tetris', function(){
    const renderer = shallow(<Tetris />);
    renderer.equals(<Board/>);
  });
  it('Render Board', function(){
    const renderer = shallow(<Board />);
  });
  it('Render Test', function(){
    const renderer = shallow(<Test />);
  });

})

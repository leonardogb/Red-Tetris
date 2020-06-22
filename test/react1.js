import chai from 'chai';
import React from 'react';

import { shallow } from 'enzyme';
import { Tetris, Board } from '../src/client/components/test';

chai.should()

describe('Fake react test', function(){
  it('works', function(){
    const renderer = shallow(<Tetris />);

    renderer.equals(<Board/>);
  })

})

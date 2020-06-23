import chai from 'chai';
import React from 'react';

import { shallow } from 'enzyme';
import BoardGame from '../../src/client/components/BoardGame';
import App from '../../src/client/containers/app';

chai.should()

describe('Components renders', function(){
  it('works', () => {
      const wrapper = shallow(<BoardGame />);
    // shallow(<Board />);
  });

})
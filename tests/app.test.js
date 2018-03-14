import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../client/src/components/App';
import testData from './test_data';

configure({ adapter: new Adapter() });

describe('Photo Gallery App', () => {
  const mock = new MockAdapter(axios);
  const data = testData;

  mock.onGet('/api/restaurants/:id').reply(200, data);

  it('should render correctly', () => {
    const wrapper = shallow(<App />);
    expect(wrapper).toMatchSnapshot();
  });
});

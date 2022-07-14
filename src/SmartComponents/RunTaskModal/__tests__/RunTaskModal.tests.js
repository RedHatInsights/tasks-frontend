import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';

import RunTaskModal from '../RunTaskModal';
//import { dispatchNotification } from '../../../Utilities/Dispatcher';

jest.mock('../../../Utilities/Dispatcher');

describe('RunTaskModal', () => {
  let props;
  const store = init().getStore();

  beforeEach(() => {
    props = {
      description: 'This is a description of the task.',
      error: {},
      isOpen: true,
      selectedSystems: [],
      setModalOpened: jest.fn(),
      slug: 'taska',
      title: 'This is the title of the task',
    };
  });

  it.skip('should render correctly', () => {
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <RunTaskModal {...props} />
        </Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

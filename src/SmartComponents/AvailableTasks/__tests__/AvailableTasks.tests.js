import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import AvailableTasks from '../AvailableTasks';
import {
  availableTasksTableError,
  availableTasksTableItems,
} from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import { dispatchNotification } from '../../../Utilities/Dispatcher';
import { fetchAvailableTasks } from '../../../../api';

jest.mock('../../../../api');
jest.mock('../../../Utilities/Dispatcher');

describe('AvailableTasks', () => {
  let mockStore = configureStore();
  let props;

  beforeEach(() => {
    props = {
      openTaskModal: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('should render correctly', async () => {
    fetchAvailableTasks.mockImplementation(
      async () => availableTasksTableItems
    );

    const { asFragment } = act(async () => {
      render(
        <MemoryRouter keyLength={0}>
          <AvailableTasks {...props} />
        </MemoryRouter>
      );
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it.skip('should fetch api data and build table', async () => {
    fetchAvailableTasks.mockImplementation(
      async () => availableTasksTableItems
    );

    const store = mockStore(props);
    await act(async () => {
      render(
        <MemoryRouter keyLength={0}>
          <Provider store={store}>
            <AvailableTasks {...props} />
          </Provider>
        </MemoryRouter>
      );
    });

    waitFor(() => {
      expect(
        screen.getByLabelText('available-tasks-table').toBeInTheDocument()
      );
      expect(screen.getByLabelText('taska').toBeInTheDocument());
    });
  });

  it.skip('should render error', async () => {
    const mockedNotification = jest.fn();
    fetchAvailableTasks.mockImplementation(
      async () => availableTasksTableError
    );
    dispatchNotification.mockImplementation(mockedNotification);

    const store = mockStore(props);
    await act(async () => {
      render(
        <MemoryRouter keyLength={0}>
          <Provider store={store}>
            <AvailableTasks {...props} />
          </Provider>
        </MemoryRouter>
      );
    });

    waitFor(() => {
      //const thing = screen.getByLabelText('taska');
      expect(screen.getByLabelText('taska')).toBeTruthy();
    });
  });
});

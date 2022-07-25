import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import TasksPage from '../TasksPage';
import { fetchExecutedTasks } from '../../../../api';
import { fetchAvailableTasks } from '../../../../api';

jest.mock('../../../../api');

describe('TasksPage', () => {
  let props;
  let mockStore = configureStore();

  it('should render correctly', async () => {
    fetchAvailableTasks.mockImplementation(async () => {
      return { data: [] };
    });
    const store = mockStore(props);
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <TasksPage tab={0} />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(asFragment()).toMatchSnapshot());
    await waitFor(() =>
      expect(screen.getByLabelText('available-tasks')).toBeInTheDocument()
    );
  });

  it('should update tab index', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return { meta: { count: 0 }, data: [] };
    });
    const store = mockStore(props);

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <TasksPage {...props} />
        </Provider>
      </MemoryRouter>
    );

    await userEvent.click(screen.getByText('Completed tasks'));
    await waitFor(() =>
      expect(screen.getByLabelText('completed-tasks')).toBeInTheDocument()
    );
    await userEvent.click(screen.getByText('Available tasks'));
    await waitFor(() =>
      expect(screen.getByLabelText('available-tasks')).toBeInTheDocument()
    );
  });
});

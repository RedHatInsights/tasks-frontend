import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import TasksPage from '../TasksPage';

describe('TasksPage', () => {
  let props;
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    const store = mockStore(props);
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <TasksPage {...props} />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(asFragment()).toMatchSnapshot());
    await waitFor(() =>
      expect(screen.getByLabelText('available-tasks')).toBeInTheDocument()
    );
  });

  it('should update tab index', async () => {
    const store = mockStore(props);

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <TasksPage {...props} />
        </Provider>
      </MemoryRouter>
    );

    userEvent.click(screen.getByText('Completed tasks'));
    await waitFor(() =>
      expect(screen.getByLabelText('completed-tasks')).toBeInTheDocument()
    );
  });
});

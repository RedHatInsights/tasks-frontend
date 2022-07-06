import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import CompletedTasksTable from '../CompletedTasksTable';
import { completedTasksTableItems } from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import { fetchExecutedTasks } from '../../../../api';

jest.mock('../../../../api');

describe('CompletedTasksTable', () => {
  let mockStore = configureStore();
  let props;

  it('should render correctly', () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return { meta: { count: 0 }, data: [] };
    });

    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <CompletedTasksTable />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it.skip('should export', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    const store = mockStore(props);
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTasksTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => userEvent.click(screen.getByLabelText('Export')));
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it('should add filter', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    const store = mockStore(props);
    await act(async () => {
      render(
        <MemoryRouter keyLength={0}>
          <Provider store={store}>
            <CompletedTasksTable />
          </Provider>
        </MemoryRouter>
      );
    });

    const input = screen.getByLabelText('text input');
    fireEvent.change(input, { target: { value: 'A' } });
    expect(input.value).toBe('A');
  });

  it('should remove filter', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    const store = mockStore(props);
    await act(async () => {
      render(
        <MemoryRouter keyLength={0}>
          <Provider store={store}>
            <CompletedTasksTable />
          </Provider>
        </MemoryRouter>
      );
    });

    const input = screen.getByLabelText('text input');
    fireEvent.change(input, { target: { value: 'A' } });
    expect(input.value).toBe('A');
    await waitFor(() => userEvent.click(screen.getByLabelText('close')));
    expect(input.value).toBe('');
  });
});

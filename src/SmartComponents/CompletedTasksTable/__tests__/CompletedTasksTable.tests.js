import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import * as dispatcher from '../../../Utilities/Dispatcher';

import CompletedTasksTable from '../CompletedTasksTable';
import {
  availableTasksTableError,
  completedTasksTableItems,
} from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import {
  log4j_task,
  log4j_task_jobs,
} from '../../CompletedTaskDetails/__tests__/__fixtures__/completedTasksDetails.fixtures';
import {
  executeTask,
  fetchExecutedTask,
  fetchExecutedTaskJobs,
  fetchExecutedTasks,
} from '../../../../api';

jest.mock('../../../../api');

describe('CompletedTasksTable', () => {
  const store = init().getStore();
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <CompletedTasksTable />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should export', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTasksTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => userEvent.click(screen.getByLabelText('Export')));
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
    await waitFor(() => userEvent.click(screen.getByText('Export to CSV')));
  });

  it('should add filter', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTasksTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTasks).toHaveBeenCalled());
    const input = screen.getByLabelText('text input');
    await waitFor(() => fireEvent.change(input, { target: { value: 'A' } }));
    expect(input.value).toBe('A');
  });

  it('should remove filter', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTasksTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTasks).toHaveBeenCalled());
    const input = screen.getByLabelText('text input');
    fireEvent.change(input, { target: { value: 'A' } });
    expect(input.value).toBe('A');
    await waitFor(() => userEvent.click(screen.getByLabelText('close')));
    expect(input.value).toBe('');
  });

  it('should not fetch task jobs if there are no task details on run this task again', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    fetchExecutedTask.mockImplementation(async () => {
      return {};
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTasksTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTasks).toHaveBeenCalled());
    await waitFor(() =>
      userEvent.click(screen.getAllByLabelText('Actions')[0])
    );
    await waitFor(() =>
      userEvent.click(screen.getByText('Run this task again'))
    );
    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());
    await waitFor(() => expect(fetchExecutedTaskJobs).not.toHaveBeenCalled());
  });

  it('should run this task again', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    fetchExecutedTask.mockImplementation(async () => {
      return log4j_task;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: log4j_task_jobs };
    });

    executeTask.mockImplementation(async () => {
      return { data: { id: 1 } };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTasksTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTasks).toHaveBeenCalled());
    await waitFor(() =>
      userEvent.click(screen.getAllByLabelText('Actions')[0])
    );
    await waitFor(() =>
      userEvent.click(screen.getByText('Run this task again'))
    );
    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());
    await waitFor(() => expect(fetchExecutedTaskJobs).toHaveBeenCalled());
    await waitFor(() =>
      userEvent.click(screen.getByLabelText('log4j-submit-task-button'))
    );
    await waitFor(() => expect(executeTask).toHaveBeenCalled());
    expect(fetchExecutedTasks).toHaveBeenCalledTimes(2);
  });

  it('should set errors', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return availableTasksTableError;
    });

    const notification = jest
      .spyOn(dispatcher, 'dispatchNotification')
      .mockImplementation();

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTasksTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(notification).toHaveBeenCalled());
  });

  it('should open delete modal', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return completedTasksTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTasksTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTasks).toHaveBeenCalled());
    await waitFor(() =>
      userEvent.click(screen.getAllByLabelText('Actions')[1])
    );
    await waitFor(() => userEvent.click(screen.getByText('Delete')));
    await waitFor(() =>
      userEvent.click(screen.getByLabelText('delete-task-button'))
    );
    expect(fetchExecutedTasks).toHaveBeenCalledTimes(2);
  });
});

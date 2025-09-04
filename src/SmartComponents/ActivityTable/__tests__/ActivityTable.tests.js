import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import * as dispatcher from '../../../Utilities/Dispatcher';

import ActivityTable from '../ActivityTable';
import {
  availableTasksTableError,
  activityTableItems,
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

describe('ActivityTable', () => {
  const store = init().getStore();
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <ActivityTable />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render empty', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return { data: [] };
    });

    render(
      <MemoryRouter keyLength={0}>
        <ActivityTable />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByLabelText('empty-state')).toBeInTheDocument()
    );
  });

  it('should export', async () => {
    global.URL.createObjectURL = jest.fn();

    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    const notification = jest
      .spyOn(dispatcher, 'dispatchNotification')
      .mockImplementation();

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => userEvent.click(screen.getByLabelText('Export')));
    await waitFor(() => userEvent.click(screen.getByText('Export to CSV')));
    expect(notification).toHaveBeenCalled();

    global.URL.createObjectURL.mockRestore();
  });

  it('should add name filter', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTasks).toHaveBeenCalled());
    const input = screen.getByLabelText('text input');
    await waitFor(() => fireEvent.change(input, { target: { value: 'A' } }));
    expect(input.value).toBe('A');
  });

  it('should remove name filter', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
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

  it('should filter by status completed', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalled();
    });

    await userEvent.click(
      screen.getByRole('button', {
        name: /conditional filter toggle/i,
      })
    );

    await userEvent.click(screen.getAllByText('Status')[0]);

    await userEvent.click(screen.getByLabelText('Options menu'));

    await userEvent.click(screen.getAllByText('Completed')[0]);

    await waitFor(() => {
      expect(screen.getByText('Task A')).toBeInTheDocument();
      expect(screen.queryByText('Task B')).not.toBeInTheDocument();
    });
  });

  it('should filter by status running', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalled();
    });

    await userEvent.click(
      screen.getByRole('button', {
        name: /conditional filter toggle/i,
      })
    );

    await userEvent.click(screen.getAllByText('Status')[0]);
    await userEvent.click(screen.getByLabelText('Options menu'));
    await userEvent.click(screen.getAllByText('Running')[0]);

    await waitFor(() => {
      expect(screen.getByText('Task B')).toBeInTheDocument();
      expect(screen.queryByText('Task A')).not.toBeInTheDocument();
    });
  });

  it('should not fetch task jobs if there are no task details on run this task again', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    fetchExecutedTask.mockImplementation(async () => {
      return {};
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() =>
      screen.findByRole('row', {
        name: /task b 5 running 21 apr 2022, 10:10 utc/i,
      })
    );
    const row = screen.getByRole('row', {
      name: /task b 5 running 21 apr 2022, 10:10 utc/i,
    });

    await userEvent.click(
      within(row).getByRole('button', {
        name: /kebab toggle/i,
      })
    );

    await userEvent.click(
      screen.getByRole('menuitem', {
        name: /run this task again/i,
      })
    );

    expect(fetchExecutedTask).toHaveBeenCalled();
    expect(fetchExecutedTaskJobs).not.toHaveBeenCalled();
  });

  it.skip('should run this task again', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
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
          <ActivityTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalled();
    });
    await waitFor(() => {
      userEvent.click(screen.getAllByLabelText('Kebab toggle')[0]);
    });
    await waitFor(() => {
      userEvent.click(screen.getByText('Run this task again'));
    });
    await waitFor(() => {
      expect(fetchExecutedTask).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(fetchExecutedTaskJobs).toHaveBeenCalled();
    });
    expect(executeTask).toHaveBeenCalled();
    expect(fetchExecutedTasks).toHaveBeenCalledTimes(3);
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
          <ActivityTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(notification).toHaveBeenCalled());
  });

  it('should open delete modal', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalled();
      userEvent.click(screen.getAllByLabelText('Kebab toggle')[1]);
      userEvent.click(screen.getByText('Delete'));
      userEvent.click(screen.getByTestId('delete-task-button'));
    });
    expect(fetchExecutedTasks).toHaveBeenCalledTimes(4);
  });
});

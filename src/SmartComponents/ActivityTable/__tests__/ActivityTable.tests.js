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

import ActivityTable from '../ActivityTable';

import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';

jest.mock('@redhat-cloud-services/frontend-components-notifications', () => ({
  useAddNotification: jest.fn(),
}));
import {
  availableTasksTableError,
  activityTableItems,
} from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import {
  log4j_task,
  log4j_task_jobs,
} from '../../CompletedTaskDetails/__tests__/__fixtures__/completedTasksDetails.fixtures';
import {
  deleteExecutedTask,
  executeTask,
  fetchExecutedTask,
  fetchExecutedTaskJobs,
  fetchExecutedTasks,
} from '../../../../api';

jest.mock('../../../../api');

describe('ActivityTable', () => {
  const store = init().getStore();
  const mockAddNotification = jest.fn();

  beforeEach(() => {
    useAddNotification.mockReturnValue(mockAddNotification);
  });

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
      </MemoryRouter>,
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
      </MemoryRouter>,
    );

    expect(await screen.findByLabelText('empty-state')).toBeInTheDocument();
  });

  it('should export', async () => {
    global.URL.createObjectURL = jest.fn();

    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByLabelText('Export'));
    await userEvent.click(screen.getByText('Export to CSV'));
    expect(mockAddNotification).toHaveBeenCalled();

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
      </MemoryRouter>,
    );

    await waitFor(() => expect(fetchExecutedTasks).toHaveBeenCalled());
    const input = screen.getByLabelText('text input');
    fireEvent.change(input, { target: { value: 'A' } });
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
      </MemoryRouter>,
    );

    await waitFor(() => expect(fetchExecutedTasks).toHaveBeenCalled());
    const input = screen.getByLabelText('text input');
    fireEvent.change(input, { target: { value: 'A' } });
    expect(input.value).toBe('A');
    fireEvent.change(input, { target: { value: '' } });
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalled();
    });

    // Click the conditional filter toggle
    await userEvent.click(
      screen.getByRole('button', {
        name: /conditional filter toggle/i,
      }),
    );

    // Click the "Status" menuitem from the dropdown
    await userEvent.click(screen.getByRole('menuitem', { name: 'Status' }));

    // After selecting Status filter, wait for the Options menu button to appear
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Options menu' }),
      ).toBeInTheDocument();
    });

    // Click the Options menu button to open the checkboxes
    await userEvent.click(screen.getByRole('button', { name: 'Options menu' }));

    // Now click the Completed checkbox
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
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalled();
    });

    // Click the conditional filter toggle
    await userEvent.click(
      screen.getByRole('button', {
        name: /conditional filter toggle/i,
      }),
    );

    // Click the "Status" menuitem from the dropdown
    await userEvent.click(screen.getByRole('menuitem', { name: 'Status' }));

    // After selecting Status filter, wait for the Options menu button to appear
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Options menu' }),
      ).toBeInTheDocument();
    });

    // Click the Options menu button to open the checkboxes
    await userEvent.click(screen.getByRole('button', { name: 'Options menu' }));

    // Now click the Running checkbox
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
      </MemoryRouter>,
    );

    await waitFor(() =>
      screen.findByRole('row', {
        name: /task b 5 running 21 apr 2022, 10:10 utc/i,
      }),
    );
    const row = screen.getByRole('row', {
      name: /task b 5 running 21 apr 2022, 10:10 utc/i,
    });

    await userEvent.click(
      within(row).getByRole('button', {
        name: /kebab toggle/i,
      }),
    );

    await userEvent.click(
      screen.getByRole('menuitem', {
        name: /run this task again/i,
      }),
    );

    expect(fetchExecutedTask).toHaveBeenCalled();
    expect(fetchExecutedTaskJobs).not.toHaveBeenCalled();
  });

  it('should run this task again', async () => {
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
      </MemoryRouter>,
    );

    await waitFor(() =>
      screen.findByRole('row', {
        name: /task a 10 completed/i,
      }),
    );
    const row = screen.getByRole('row', {
      name: /task a 10 completed/i,
    });

    await userEvent.click(
      within(row).getByRole('button', {
        name: /kebab toggle/i,
      }),
    );

    await userEvent.click(
      screen.getByRole('menuitem', {
        name: /run this task again/i,
      }),
    );

    await waitFor(() => {
      expect(fetchExecutedTask).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(fetchExecutedTaskJobs).toHaveBeenCalled();
    });

    const runButton = await screen.findByLabelText('log4j-submit-task-button');
    await userEvent.click(runButton);

    expect(executeTask).toHaveBeenCalled();

    await waitFor(() => {
      // 1 call on mount + 1 call after delete/cancel = 2 calls with server-side pagination
      expect(fetchExecutedTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('should set errors', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return availableTasksTableError;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => expect(mockAddNotification).toHaveBeenCalled());
  });

  it('should open delete modal', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    deleteExecutedTask.mockImplementation(async () => {
      return { data: {} };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() =>
      screen.findByRole('row', {
        name: /task a 10 completed/i,
      }),
    );
    const row = screen.getByRole('row', {
      name: /task a 10 completed/i,
    });

    await userEvent.click(
      within(row).getByRole('button', {
        name: /kebab toggle/i,
      }),
    );

    await userEvent.click(
      screen.getByRole('menuitem', {
        name: /delete/i,
      }),
    );

    await userEvent.click(await screen.findByLabelText('Delete task button'));

    expect(deleteExecutedTask).toHaveBeenCalledWith(1);

    await waitFor(() => {
      // 1 call on mount + 1 call after delete/cancel = 2 calls with server-side pagination
      expect(fetchExecutedTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('should use server-side pagination with correct offset and limit on initial load', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=-start_time',
      );
    });
  });

  it('should use server-side sorting when clicking column headers', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=-start_time',
      );
    });

    fetchExecutedTasks.mockClear();

    const taskHeader = screen.getAllByRole('columnheader')[0];
    const taskHeaderButton = within(taskHeader).getByRole('button');
    await userEvent.click(taskHeaderButton);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=name',
      );
    });
  });

  it('should toggle sort direction when clicking same column twice', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalled();
    });

    fetchExecutedTasks.mockClear();

    const systemsHeader = screen.getAllByRole('columnheader')[1];
    const systemsHeaderButton = within(systemsHeader).getByRole('button');

    await userEvent.click(systemsHeaderButton);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=systems_count',
      );
    });

    fetchExecutedTasks.mockClear();

    await userEvent.click(systemsHeaderButton);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=-systems_count',
      );
    });
  });

  it('should sort by status column', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalled();
    });

    fetchExecutedTasks.mockClear();

    const statusHeader = screen.getAllByRole('columnheader')[2];
    const statusHeaderButton = within(statusHeader).getByRole('button');
    await userEvent.click(statusHeaderButton);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=status',
      );
    });
  });

  it('should reset to page 1 when sorting from a different page', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return { data: activityTableItems.data, meta: { count: 100 } };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=-start_time',
      );
    });

    fetchExecutedTasks.mockClear();

    const pagination = screen.getAllByLabelText('Go to next page')[0];
    await userEvent.click(pagination);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=20&sort=-start_time',
      );
    });

    fetchExecutedTasks.mockClear();

    const taskHeader = screen.getAllByRole('columnheader')[0];
    const taskHeaderButton = within(taskHeader).getByRole('button');
    await userEvent.click(taskHeaderButton);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=name',
      );
    });
  });

  it('should sort by run date/time column in ascending order', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalled();
    });

    fetchExecutedTasks.mockClear();

    const runDateHeader = screen.getAllByRole('columnheader')[3];
    const runDateHeaderButton = within(runDateHeader).getByRole('button');
    await userEvent.click(runDateHeaderButton);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=start_time',
      );
    });
  });

  it('should refetch with current sort after delete', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return activityTableItems;
    });

    deleteExecutedTask.mockImplementation(async () => {
      return { data: {} };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=-start_time',
      );
    });

    fetchExecutedTasks.mockClear();

    const taskHeader = screen.getAllByRole('columnheader')[0];
    const taskHeaderButton = within(taskHeader).getByRole('button');
    await userEvent.click(taskHeaderButton);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=name',
      );
    });

    fetchExecutedTasks.mockClear();

    const row = screen.getByRole('row', {
      name: /task a 10 completed/i,
    });

    await userEvent.click(
      within(row).getByRole('button', {
        name: /kebab toggle/i,
      }),
    );

    await userEvent.click(
      screen.getByRole('menuitem', {
        name: /delete/i,
      }),
    );

    await userEvent.click(await screen.findByLabelText('Delete task button'));

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=name',
      );
    });
  });

  it('should handle pagination with sorted data', async () => {
    fetchExecutedTasks.mockImplementation(async () => {
      return { data: activityTableItems.data, meta: { count: 100 } };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <ActivityTable />
        </Provider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=-start_time',
      );
    });

    fetchExecutedTasks.mockClear();

    const statusHeader = screen.getAllByRole('columnheader')[2];
    const statusHeaderButton = within(statusHeader).getByRole('button');
    await userEvent.click(statusHeaderButton);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=0&sort=status',
      );
    });

    fetchExecutedTasks.mockClear();

    const nextPageButton = screen.getAllByLabelText('Go to next page')[0];
    await userEvent.click(nextPageButton);

    await waitFor(() => {
      expect(fetchExecutedTasks).toHaveBeenCalledWith(
        '?limit=20&offset=20&sort=status',
      );
    });
  });
});

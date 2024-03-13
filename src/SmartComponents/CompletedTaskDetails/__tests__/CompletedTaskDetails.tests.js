import React from 'react';
import {
  act,
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

import CompletedTaskDetails from '../CompletedTaskDetails';
import {
  deleteExecutedTask,
  fetchExecutedTask,
  fetchExecutedTaskJobs,
} from '../../../../api';
import {
  convert2rhel_task_details,
  convert2rhel_task_jobs,
  leapp_task_jobs,
  log4j_task,
  log4j_task_jobs,
  running_task,
  running_task_jobs,
  upgrade_leapp_task,
} from './__fixtures__/completedTasksDetails.fixtures';
import * as dispatcher from '../../../Utilities/Dispatcher';
import useInsightsNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

jest.mock('../../../../api');
jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/RBACHook',
  () => ({
    esModule: true,
    usePermissions: () => ({ hasAccess: true, isLoading: false }),
  })
);

jest.mock(
  '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate'
);

describe('CompletedTaskDetails', () => {
  const store = init().getStore();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly completed', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return log4j_task;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: log4j_task_jobs };
    });

    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());
    await waitFor(() => expect(fetchExecutedTaskJobs).toHaveBeenCalled());
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it('should render convert2rhel correctly completed', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return convert2rhel_task_details;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: convert2rhel_task_jobs };
    });

    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());
    await waitFor(() => expect(fetchExecutedTaskJobs).toHaveBeenCalled());
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it('should render expandable rows correctly', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return upgrade_leapp_task;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: leapp_task_jobs };
    });

    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());
    await waitFor(() => expect(fetchExecutedTaskJobs).toHaveBeenCalled());
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it('should render correctly running', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return running_task;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: running_task_jobs };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByLabelText('217-completed-jobs')).toBeInTheDocument()
    );
    await waitFor(() => {
      const noResultCells = screen.getAllByText('No result yet');
      expect(noResultCells).toHaveLength(3);
    });
  });

  it('should add system name filter', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return log4j_task;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: log4j_task_jobs };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(async () => {
      expect(fetchExecutedTask).toHaveBeenCalled();
      expect(fetchExecutedTaskJobs).toHaveBeenCalled();
      const input = screen.getByLabelText('text input');
      await waitFor(() => fireEvent.change(input, { target: { value: 'A' } }));
      expect(input.value).toBe('A');
    });
  });

  it('should remove system name filter', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return log4j_task;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: log4j_task_jobs };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(async () => {
      expect(fetchExecutedTask).toHaveBeenCalled();
      expect(fetchExecutedTaskJobs).toHaveBeenCalled();
      const input = screen.getByLabelText('text input');
      await waitFor(() => fireEvent.change(input, { target: { value: 'A' } }));
      expect(input.value).toBe('A');
      await waitFor(() => userEvent.click(screen.getByLabelText('close')));
      expect(input.value).toBe('');
    });
  });

  it('should filter by status', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return log4j_task;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: log4j_task_jobs };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());
    await waitFor(() => expect(fetchExecutedTaskJobs).toHaveBeenCalled());
    userEvent.click(screen.getByLabelText('Conditional filter'));
    userEvent.click(screen.getAllByText('Status')[0]);
    await waitFor(() => userEvent.click(screen.getByLabelText('Options menu')));
    await waitFor(() => userEvent.click(screen.getAllByText('Success')[0]));
    await waitFor(() =>
      expect(screen.getByText('dl-test-device-2')).toBeInTheDocument()
    );
  });

  it('should delete task', async () => {
    const navigateMock = jest.fn(() => ({}));
    useInsightsNavigate.mockImplementation(() => navigateMock);
    fetchExecutedTask.mockImplementation(async () => {
      return log4j_task;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: log4j_task_jobs };
    });

    act(() =>
      render(
        <MemoryRouter keyLength={0}>
          <Provider store={store}>
            <CompletedTaskDetails />
          </Provider>
        </MemoryRouter>
      )
    );

    await waitFor(() =>
      userEvent.click(screen.getByLabelText('Task details menu toggle'))
    );
    await waitFor(() =>
      userEvent.click(screen.getByLabelText('delete task menu item'))
    );
    await waitFor(() =>
      userEvent.click(screen.getByTestId('delete-task-button'))
    );
    expect(deleteExecutedTask).toHaveBeenCalled();
  });

  it('should export as CSV', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return log4j_task;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: log4j_task_jobs };
    });

    const notification = jest
      .spyOn(dispatcher, 'dispatchNotification')
      .mockImplementation();

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(async () => {
      await waitFor(() => userEvent.click(screen.getByLabelText('Export')));
      await waitFor(() => userEvent.click(screen.getByText('Export to CSV')));
      expect(notification).toHaveBeenCalled();
    });
  });

  it('should open log drawer', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return convert2rhel_task_details;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: convert2rhel_task_jobs };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());
    await waitFor(() => expect(fetchExecutedTaskJobs).toHaveBeenCalled());

    const row = screen.getByRole('row', {
      name: /details centos7-test-device-3 success no inhibtors found, conversion should run smoothly for this system\./i,
    });

    fireEvent.click(
      within(row).getByRole('button', {
        name: /kebab toggle/i,
      })
    );

    userEvent.click(
      screen.getByRole('menuitem', { name: /View system logs/i })
    );

    expect(
      screen.getByRole('heading', {
        name: /log for: centos7-test-device-3/i,
      })
    ).toBeVisible();
  });

  it('should open system in inventory', async () => {
    const navigateMock = jest.fn(() => ({}));
    useInsightsNavigate.mockImplementation(() => navigateMock);
    fetchExecutedTask.mockImplementation(async () => {
      return convert2rhel_task_details;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: convert2rhel_task_jobs };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());
    await waitFor(() => expect(fetchExecutedTaskJobs).toHaveBeenCalled());

    const row = screen.getByRole('row', {
      name: /details centos7-test-device-3 success no inhibtors found, conversion should run smoothly for this system\./i,
    });

    fireEvent.click(
      within(row).getByRole('button', {
        name: /kebab toggle/i,
      })
    );

    userEvent.click(
      screen.getByRole('menuitem', { name: /View system in Inventory/i })
    );

    expect(navigateMock).toHaveBeenCalled();
  });

  it('should disable system logs and view system in inventory', async () => {
    fetchExecutedTask.mockImplementation(async () => {
      return convert2rhel_task_details;
    });

    fetchExecutedTaskJobs.mockImplementation(async () => {
      return { data: convert2rhel_task_jobs };
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchExecutedTask).toHaveBeenCalled());
    await waitFor(() => expect(fetchExecutedTaskJobs).toHaveBeenCalled());

    const row = screen.getByRole('row', {
      name: /system deleted success no inhibtors found, conversion should run smoothly for this system\./i,
    });

    fireEvent.click(
      within(row).getByRole('button', {
        name: /kebab toggle/i,
      })
    );

    expect(
      screen.getByRole('menuitem', { name: /View system logs/i })
    ).toBeDisabled();

    expect(
      screen.getByRole('menuitem', { name: /View system in Inventory/i })
    ).toBeDisabled();
  });
});

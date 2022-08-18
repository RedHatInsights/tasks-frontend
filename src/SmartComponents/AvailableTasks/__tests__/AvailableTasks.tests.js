import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AvailableTasks from '../AvailableTasks';
import {
  availableTasksTableError,
  availableTasksTableItems,
} from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import * as dispatcher from '../../../Utilities/Dispatcher';
import { fetchAvailableTasks } from '../../../../api';

jest.mock('../../../../api');

describe('AvailableTasks', () => {
  let props;

  beforeEach(() => {
    props = {
      openTaskModal: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', async () => {
    fetchAvailableTasks.mockImplementation(
      async () => availableTasksTableItems
    );

    render(
      <MemoryRouter keyLength={0}>
        <AvailableTasks {...props} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('available-tasks')).toBeInTheDocument();
  });

  it('should fetch api data and build table', async () => {
    fetchAvailableTasks.mockImplementation(
      async () => availableTasksTableItems
    );

    act(async () => {
      render(
        <MemoryRouter keyLength={0}>
          <AvailableTasks {...props} />
        </MemoryRouter>
      );
    });
    await waitFor(() => {
      expect(fetchAvailableTasks).toHaveBeenCalled();
      expect(
        screen.getByLabelText('available-tasks-table')
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText('taska-run-task-button')
      ).toBeInTheDocument();
    });
  });

  it('should render error', async () => {
    fetchAvailableTasks.mockImplementation(
      async () => availableTasksTableError
    );
    const notification = jest
      .spyOn(dispatcher, 'dispatchNotification')
      .mockImplementation();

    act(async () => {
      render(
        <MemoryRouter keyLength={0}>
          <AvailableTasks {...props} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(notification).toHaveBeenCalled();
      expect(screen.getByLabelText('error-empty-state')).toBeInTheDocument();
    });
  });
});

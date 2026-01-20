import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AvailableTasks from '../AvailableTasks';
import {
  availableTasksTableError,
  availableTasksTableItems,
} from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import { fetchAvailableTasks } from '../../../../api';
import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications';

jest.mock('../../../../api');
jest.mock('@redhat-cloud-services/frontend-components-notifications', () => ({
  useAddNotification: jest.fn(),
}));
jest.mock('../../../Utilities/useFeatureFlag', () => () => true);

describe('AvailableTasks', () => {
  let props;
  const mockAddNotification = jest.fn();

  beforeEach(() => {
    useAddNotification.mockReturnValue(mockAddNotification);
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

    await waitFor(() => {
      expect(screen.getByLabelText('available-tasks')).toBeInTheDocument();
    });
  });

  it('should fetch api data and build table', async () => {
    fetchAvailableTasks.mockImplementation(
      async () => availableTasksTableItems
    );

    await act(async () => {
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

    await act(async () => {
      render(
        <MemoryRouter keyLength={0}>
          <AvailableTasks {...props} />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalled();
      expect(screen.getByLabelText('error-empty-state')).toBeInTheDocument();
    });
  });
});

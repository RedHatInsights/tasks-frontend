import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AvailableTasksTable from '../AvailableTasksTable';
import { fetchAvailableTasksError } from './__fixtures__/availableTasks.fixtures';
import { availableTasksTableItems } from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';

jest.mock('../../../Utilities/useFeatureFlag', () => () => true);

describe('test data', () => {
  it('task C has a real slug', () => {
    expect(
      availableTasksTableItems.data.find(({ name }) => name === 'Task C').slug
    ).toBe('convert-to-rhel-conversion');
  });
});

describe('AvailableTasksTable', () => {
  let props;

  beforeEach(() => {
    props = {
      availableTasks: [],
      error: undefined,
      openTaskModal: jest.fn(),
    };
  });

  it('should render empty state', () => {
    render(
      <MemoryRouter keyLength={0}>
        <AvailableTasksTable {...props} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('available-tasks-table')).toBeInTheDocument();
    expect(screen.getByLabelText('empty-state')).toBeInTheDocument();
  });

  it('should build table', () => {
    props.availableTasks = availableTasksTableItems.data;

    render(
      <MemoryRouter keyLength={0}>
        <AvailableTasksTable {...props} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('available-tasks-table')).toBeInTheDocument();
    expect(screen.getByLabelText('taska-run-task-button')).toBeInTheDocument();
  });

  it('should show quickstart button for known slug', () => {
    props.availableTasks = availableTasksTableItems.data;

    render(
      <MemoryRouter keyLength={0}>
        <AvailableTasksTable {...props} />
      </MemoryRouter>
    );

    const taskC = screen.getByLabelText('taskC');

    within(taskC, () => {
      expect(
        screen.getByRole('button', {
          name: /help me get started/i,
        })
      ).toBeVisible();
    });
  });

  it('should render error', () => {
    props.error = fetchAvailableTasksError;

    render(
      <MemoryRouter keyLength={0}>
        <AvailableTasksTable {...props} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('error-empty-state')).toBeInTheDocument();
  });
});

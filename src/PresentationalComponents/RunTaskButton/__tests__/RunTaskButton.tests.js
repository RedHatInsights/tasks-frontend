import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import RunTaskButton from '../RunTaskButton';
import { availableTasksTableItems } from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';

describe('RunTaskButton', () => {
  let props;

  beforeEach(() => {
    props = {
      className: '',
      slug: availableTasksTableItems.data[0].slug,
      isFirst: true,
      openTaskModal: jest.fn(),
      variant: 'primary',
    };
  });

  it('should render correctly', () => {
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <RunTaskButton {...props} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render Run task again', () => {
    props.isFirst = false;

    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <RunTaskButton {...props} />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should handle onClick', async () => {
    render(
      <MemoryRouter keyLength={0}>
        <RunTaskButton {...props} />
      </MemoryRouter>
    );

    await waitFor(() =>
      userEvent.click(screen.getByLabelText('taska-run-task-button'))
    );
    expect(props.openTaskModal).toHaveBeenCalledWith(props.slug);
  });
});

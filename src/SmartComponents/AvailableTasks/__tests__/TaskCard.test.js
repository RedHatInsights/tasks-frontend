import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TaskCard } from '../TaskCard';
import userEvent from '@testing-library/user-event';

describe('TaskCard', () => {
  const mockedTask = {
    title: 'Task title',
    slug: 'foo-bar-task',
    description: 'Task description',
  };
  const openTaskModalMocked = jest.fn();

  it('renders simple task', () => {
    render(<TaskCard task={mockedTask} openTaskModal={openTaskModalMocked} />);

    expect(screen.getByText(/task title/i)).toBeVisible();
    expect(
      screen.getByRole('button', {
        name: /foo-bar-task-run-task-button/i,
      })
    ).toBeVisible();
    expect(screen.queryByText(/task description/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', {
        name: /download preview of playbook/i,
      })
    ).not.toBeInTheDocument();
  });

  it('can expand the card', async () => {
    render(<TaskCard task={mockedTask} openTaskModal={openTaskModalMocked} />);

    await userEvent.click(
      screen.getByRole('button', {
        name: /expand task title description/i,
      })
    );

    expect(screen.getByText(/task description/i)).toBeVisible();
    expect(
      screen.getByRole('link', {
        name: /download preview of playbook/i,
      })
    ).toBeVisible();
  });

  it('calls select systems callback', async () => {
    render(<TaskCard task={mockedTask} openTaskModal={openTaskModalMocked} />);

    await userEvent.click(
      screen.getByRole('button', {
        name: /foo-bar-task-run-task-button/i,
      })
    );

    await waitFor(() => {
      expect(openTaskModalMocked).toBeCalled();
    });
  });
});

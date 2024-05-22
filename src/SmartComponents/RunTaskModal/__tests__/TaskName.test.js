import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { TaskName } from '../TaskName';

describe('TaskName', () => {
  it('renders initial task name', () => {
    render(<TaskName taskName="Initial task name" createTaskError={{}} />);

    expect(
      screen.getByRole('textbox', {
        name: /edit task name text field/i,
      })
    ).toHaveValue('Initial task name');
  });

  it('calls callback on name change', async () => {
    const setTaskNameMock = jest.fn();

    render(
      <TaskName
        taskName="Initial task name"
        setTaskName={setTaskNameMock}
        createTaskError={{}}
      />
    );

    await userEvent.type(
      screen.getByRole('textbox', {
        name: /edit task name text field/i,
      }),
      'A'
    );

    expect(setTaskNameMock).toBeCalledWith('Initial task nameA');
  });

  it('shows alert on empty name', () => {
    render(<TaskName taskName="" createTaskError={{}} />);

    screen.getByText(/task name cannot be empty/i);
  });
});

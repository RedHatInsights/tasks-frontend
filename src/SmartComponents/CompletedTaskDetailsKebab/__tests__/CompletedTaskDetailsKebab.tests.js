import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import CompletedTaskDetailsKebab from '../CompletedTaskDetailsKebab';

describe('AvailableTasks', () => {
  let props;

  beforeEach(() => {
    props = {
      status: 'Completed',
      setModalOpened: jest.fn(),
    };
  });

  it('should render correctly', async () => {
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <CompletedTaskDetailsKebab {...props} />
      </MemoryRouter>
    );

    await waitFor(() => userEvent.click(screen.getByLabelText('Actions')));
    expect(
      screen.getByLabelText('delete-task-kebab-button')
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render Delete disabled', async () => {
    props.status = 'Running';
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <CompletedTaskDetailsKebab {...props} />
      </MemoryRouter>
    );

    await waitFor(() => userEvent.click(screen.getByLabelText('Actions')));
    expect(asFragment()).toMatchSnapshot();
  });

  it('should call setModalOpened', async () => {
    render(
      <MemoryRouter keyLength={0}>
        <CompletedTaskDetailsKebab {...props} />
      </MemoryRouter>
    );

    await waitFor(() => userEvent.click(screen.getByLabelText('Actions')));
    await waitFor(() =>
      userEvent.click(screen.getByLabelText('delete-task-kebab-button'))
    );
    expect(props.setModalOpened).toHaveBeenCalled();
  });
});

import React from 'react';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import CompletedTaskDetails from '../CompletedTaskDetails';
import { fetchExecutedTask } from '../../../../api';
import { log4j_task } from './__fixtures__/completedTasksDetails.fixtures';

jest.mock('../../../../api');

describe('CompletedTaskDetails', () => {
  let props;
  let mockStore = configureStore();

  it('should render correctly', async () => {
    const store = mockStore(props);
    fetchExecutedTask.mockImplementation(async () => {
      return log4j_task;
    });

    render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('lalala')).toBeInTheDocument();
  });

  it.skip('should add filter', async () => {
    const store = mockStore(props);
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    const input = screen.getByLabelText('text input');
    fireEvent.change(input, { target: { value: 'A' } });
    expect(input.value).toBe('A');
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it.skip('should remove filter', async () => {
    const store = mockStore(props);
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    const input = screen.getByLabelText('text input');
    fireEvent.change(input, { target: { value: 'A' } });
    expect(input.value).toBe('A');
    await waitFor(() => userEvent.click(screen.getByLabelText('close')));
    expect(input.value).toBe('');
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });
});

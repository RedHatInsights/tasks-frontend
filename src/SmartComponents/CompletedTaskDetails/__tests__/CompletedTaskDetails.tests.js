import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import CompletedTaskDetails from '../CompletedTaskDetails';

describe('CompletedTaskDetails', () => {
  let props;
  let mockStore = configureStore();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const store = mockStore(props);
    const { asFragment } = render(
      <MemoryRouter keyLength={0}>
        <Provider store={store}>
          <CompletedTaskDetails />
        </Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should add filter', async () => {
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

  it('should remove filter', async () => {
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

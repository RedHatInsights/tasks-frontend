import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { init } from '../../../store';
import fixtures from './__fixtures__/RunTaskModal.fixtures';

import InputParameters, { InputParameter } from '../InputParameters';

describe('InputParameters', () => {
  let props;
  const store = init().getStore();

  beforeEach(() => {
    props = {
      parameters: fixtures.parameters,
      setDefinedParameters: jest.fn(),
    };
  });

  it('should render InputParameters', async () => {
    render(
      <Provider store={store}>
        <InputParameters {...props} />
      </Provider>
    );

    expect(screen.getByText('Playbook Path')).toBeInTheDocument();
    expect(screen.getByText('Help Text')).toBeInTheDocument();
    expect(screen.getByText('Add Tags')).toBeInTheDocument();
    expect(screen.getByText('Remove_Tags')).toBeInTheDocument();
    expect(screen.getByText('blah')).toBeInTheDocument();
  });

  it('should call setDefinedParameters', async () => {
    render(
      <Provider store={store}>
        <InputParameters {...props} />
      </Provider>
    );

    const input = screen.getByLabelText('path');
    await waitFor(() =>
      fireEvent.change(input, { target: { value: 'bogus/path' } })
    );
    expect(props.setDefinedParameters).toHaveBeenCalled();
  });
});

describe('InputParameter', () => {
  let props;
  const store = init().getStore();

  beforeEach(() => {
    props = {
      parameter: fixtures.parameters[0],
      updateParameter: jest.fn(),
    };
  });

  it('should render InputParameter', async () => {
    render(
      <Provider store={store}>
        <InputParameter {...props} />
      </Provider>
    );

    expect(screen.getByText('Playbook Path')).toBeInTheDocument();
  });

  it('should call setDefinedParameters', async () => {
    render(
      <Provider store={store}>
        <InputParameter {...props} />
      </Provider>
    );

    const input = screen.getByLabelText('path');
    await waitFor(() =>
      fireEvent.change(input, { target: { value: 'bogus/path' } })
    );
    expect(props.updateParameter).toHaveBeenCalled();
  });
});

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

    expect(screen.getByText('path')).toBeInTheDocument();
    expect(screen.getByText('this-is-your-label')).toBeInTheDocument();
    expect(screen.getByText('Add_Tags')).toBeInTheDocument();
    expect(screen.getByText('Remove_Tags')).toBeInTheDocument();
    expect(screen.getByText('blah')).toBeInTheDocument();
  });

  it('should call setDefinedParameters', async () => {
    render(
      <Provider store={store}>
        <InputParameters {...props} />
      </Provider>
    );

    const input = screen.getByLabelText('path-input');
    await waitFor(() =>
      fireEvent.change(input, { target: { value: 'bogus/path' } })
    );
    expect(props.setDefinedParameters).toHaveBeenCalled();
  });

  it('should show validation when input parameter is empty', async () => {
    render(
      <Provider store={store}>
        <InputParameters {...props} />
      </Provider>
    );

    const input = screen.getByLabelText('path-input');
    await waitFor(() => fireEvent.change(input, { target: { value: 'a' } }));
    await waitFor(() => fireEvent.change(input, { target: { value: '' } }));

    expect(screen.getByText('This parameter is required')).toBeInTheDocument();
  });
});

describe('InputParameter', () => {
  let props;
  const store = init().getStore();

  beforeEach(() => {
    props = {
      parameter: fixtures.parameters[0],
      setDefinedParameters: jest.fn(),
    };
  });

  it('should render InputParameter', async () => {
    render(
      <Provider store={store}>
        <InputParameter {...props} />
      </Provider>
    );

    expect(screen.getByText('path')).toBeInTheDocument();
  });

  it.skip('should call setDefinedParameters', async () => {
    /*const setState = jest.fn();
    jest
      .spyOn(React, 'useState')
      .mockImplementation((initState) => [initState, props.setDefinedParameters]);*/
    const spy = jest.spyOn(props, 'setDefinedParameters');
    /*spy.mockImplementation(
      (prevState = fixtures.parameters) => fixtures.pathFilledParameters
    );*/
    render(
      <Provider store={store}>
        <InputParameter {...props} />
      </Provider>
    );

    const input = screen.getByLabelText('path-input');
    await waitFor(() =>
      fireEvent.change(input, { target: { value: 'bogus/path' } })
    );
    expect(spy).toHaveBeenCalledWith(fixtures.pathFilledParameters);
  });
});

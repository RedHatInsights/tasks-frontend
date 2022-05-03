import React from 'react';
import { render } from '@testing-library/react';
import SelectedFilterSwitch from '../SelectedFilterSwitch';

describe('SelectedFilterSwitch', () => {
  let props;

  beforeEach(() => {
    props = {
      isChecked: true,
      setActiveFilter: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('expect to render without error', () => {
    const { asFragment } = render(<SelectedFilterSwitch {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render without error when isChecked is false', () => {
    props.isChecked = false;
    const { asFragment } = render(<SelectedFilterSwitch {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});

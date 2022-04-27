import React from 'react';
import { render } from '@testing-library/react';

import CompletedTasksTable from '../CompletedTasksTable';

describe('CompletedTasksTable', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { asFragment } = render(<CompletedTasksTable />);

    expect(asFragment()).toMatchSnapshot();
  });
});

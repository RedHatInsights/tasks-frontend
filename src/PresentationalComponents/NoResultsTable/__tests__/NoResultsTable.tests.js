//import React from 'react';
import { render } from '@testing-library/react';

import emptyRows from '../NoResultsTable';

jest.mock('../../../../api');

describe('NoResultsTable', () => {
  let type = 'items';

  it('should render correctly', async () => {
    const { asFragment } = render(emptyRows(type));

    expect(asFragment()).toMatchSnapshot();
  });
});

import React from 'react';
import { render } from '@testing-library/react';

import CardBuilder from '../CardBuilder';
import { availableTasksTableItems } from '../../../Utilities/hooks/useTableTools/Components/__tests__/TasksTable.fixtures';
import {
  AVAILABLE_TASK_CARD_HEADER,
  AVAILABLE_TASK_CARD_BODY,
  AVAILABLE_TASK_CARD_FOOTER,
} from '../../../constants';

describe('TasksTables', () => {
  let props;

  beforeEach(() => {
    props = {
      data: availableTasksTableItems[0],
      cardHeader: AVAILABLE_TASK_CARD_HEADER,
      cardBody: AVAILABLE_TASK_CARD_BODY,
      cardFooter: AVAILABLE_TASK_CARD_FOOTER,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { asFragment } = render(<CardBuilder {...props} />);

    expect(asFragment()).toMatchSnapshot();
  });
});

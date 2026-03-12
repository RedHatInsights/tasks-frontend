import React from 'react';
import { render, screen } from '@testing-library/react';

import NoResultsTable, { emptyRows } from '../NoResultsTable';
import { NO_RESULTS_REASONS } from '../../../constants';

jest.mock('../../../../api');

describe('NoResultsTable', () => {
  let type = 'items';

  it('should render correctly', async () => {
    const rows = emptyRows(type);
    const { asFragment } = render(rows[0].cells[0].title());

    expect(asFragment()).toMatchSnapshot();
  });

  describe('with different reason props', () => {
    it('should display no_match reason content by default', () => {
      render(<NoResultsTable type="systems" />);

      expect(screen.getByText('No matching systems found')).toBeInTheDocument();
      expect(
        screen.getByText(
          'To continue, edit your filter settings and search again.'
        )
      ).toBeInTheDocument();
    });

    it('should display no_match reason content explicitly', () => {
      render(
        <NoResultsTable type="systems" reason={NO_RESULTS_REASONS.NO_MATCH} />
      );

      expect(screen.getByText('No matching systems found')).toBeInTheDocument();
      expect(
        screen.getByText(
          'To continue, edit your filter settings and search again.'
        )
      ).toBeInTheDocument();
    });

    it('should display error reason content', () => {
      render(
        <NoResultsTable type="systems" reason={NO_RESULTS_REASONS.ERROR} />
      );

      expect(
        screen.getByText('Error encountered when fetching systems.')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'To continue, try resetting the filters and search again.'
        )
      ).toBeInTheDocument();
    });

    it('should use custom titleText when provided', () => {
      render(
        <NoResultsTable type="systems" titleText="Custom error message" />
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('should use custom titleText with error reason', () => {
      render(
        <NoResultsTable
          type="systems"
          titleText="Custom error message"
          reason={NO_RESULTS_REASONS.ERROR}
        />
      );

      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(
        screen.getByText(
          'To continue, try resetting the filters and search again.'
        )
      ).toBeInTheDocument();
    });

    it('should fallback to default content for unknown reason', () => {
      render(<NoResultsTable type="systems" reason="unknown_reason" />);

      expect(screen.getByText('No matching systems found')).toBeInTheDocument();
      expect(
        screen.getByText(
          'To continue, edit your filter settings and search again.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('emptyRows helper', () => {
    it('should pass reason prop to NoResultsTable component', () => {
      const rows = emptyRows('systems', null, NO_RESULTS_REASONS.ERROR);
      const { container } = render(rows[0].cells[0].title());

      expect(
        container.querySelector('.pf-v6-c-empty-state')
      ).toBeInTheDocument();
    });

    it('should pass titleText prop to NoResultsTable component', () => {
      const rows = emptyRows('systems', 'Custom title');
      render(rows[0].cells[0].title());

      expect(screen.getByText('Custom title')).toBeInTheDocument();
    });
  });
});

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import useFeatureFlag from '../../../Utilities/useFeatureFlag';
import { QuickstartButton } from '../QuickstartButton';

jest.mock('@redhat-cloud-services/frontend-components/useChrome');
jest.mock('../../../Utilities/useFeatureFlag');

describe('QuickstartButton', () => {
  it('renders button with known slug', () => {
    useFeatureFlag.mockReturnValue(true);
    render(<QuickstartButton slug="leapp-preupgrade" />);

    expect(
      screen.getByRole('button', {
        name: /help me get started/i,
      })
    ).toBeVisible();
  });

  it('renders nothing if feature flag is off', () => {
    useFeatureFlag.mockReturnValue(false);
    render(<QuickstartButton slug="leapp-preupgrade" />);

    expect(
      screen.queryByRole('button', {
        name: /help me get started/i,
      })
    ).not.toBeInTheDocument();
  });
});

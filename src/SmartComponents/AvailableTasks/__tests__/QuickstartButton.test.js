import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import useFeatureFlag from '../../../Utilities/useFeatureFlag';
import { QuickstartButton } from '../QuickstartButton';

const mockActivateQuickstart = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () =>
  jest.fn(),
);
jest.mock('../../../Utilities/useFeatureFlag');

describe('QuickstartButton', () => {
  const useChrome = require('@redhat-cloud-services/frontend-components/useChrome');

  beforeEach(() => {
    mockActivateQuickstart.mockClear();
    useChrome.mockReturnValue({
      quickStarts: {
        activateQuickstart: mockActivateQuickstart,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Hook calling behavior (tests for conditional hook fix)', () => {
    it('should always call useChrome hook even when no feature flag is defined', () => {
      useFeatureFlag.mockReturnValue(true);

      render(<QuickstartButton slug="some-unknown-slug" />);

      expect(useChrome).toHaveBeenCalled();
    });

    it('should always call useFeatureFlag hook even when feature flag name is undefined', () => {
      useFeatureFlag.mockReturnValue(true);

      render(<QuickstartButton slug="some-unknown-slug" />);

      expect(useFeatureFlag).toHaveBeenCalledWith(undefined);
    });

    it('should call both hooks unconditionally regardless of slug', () => {
      useFeatureFlag.mockReturnValue(false);

      render(<QuickstartButton slug="unknown-slug" />);

      expect(useChrome).toHaveBeenCalled();
      expect(useFeatureFlag).toHaveBeenCalled();
    });
  });

  it('renders button with known slug', () => {
    useFeatureFlag.mockReturnValue(true);
    render(<QuickstartButton slug="leapp-preupgrade" />);

    expect(
      screen.getByRole('button', {
        name: /help me get started/i,
      }),
    ).toBeVisible();
  });

  it('renders nothing if feature flag is off', () => {
    useFeatureFlag.mockReturnValue(false);
    render(<QuickstartButton slug="leapp-preupgrade" />);

    expect(
      screen.queryByRole('button', {
        name: /help me get started/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('should render button when feature flag name is undefined (default enabled)', () => {
    useFeatureFlag.mockReturnValue(undefined);

    render(<QuickstartButton slug="some-unknown-slug" />);

    expect(
      screen.getByRole('button', { name: /help me get started/i }),
    ).toBeInTheDocument();
  });

  it('should activate correct quickstart when button is clicked', async () => {
    useFeatureFlag.mockReturnValue(true);

    render(<QuickstartButton slug="convert-to-rhel-analysis" />);

    const button = screen.getByRole('button', {
      name: /help me get started/i,
    });
    await userEvent.click(button);

    expect(mockActivateQuickstart).toHaveBeenCalledWith(
      'insights-tasks-pre-conversion',
    );
  });
});

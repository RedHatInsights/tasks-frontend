import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from '../App';
import useFeatureFlag from '../Utilities/useFeatureFlag';
import { useFlagsStatus } from '@unleash/proxy-client-react';

jest.mock('../Routes', () => {
  const MockRoutes = () => <div data-testid="routes">Routes</div>;
  MockRoutes.displayName = 'MockRoutes';
  return MockRoutes;
});
jest.mock('../Utilities/useFeatureFlag');
jest.mock('@unleash/proxy-client-react');
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    identifyApp: jest.fn(),
    on: jest.fn(),
    mapGlobalFilter: jest.fn(),
  }),
}));
jest.mock('@redhat-cloud-services/frontend-components/RBACProvider', () => ({
  // eslint-disable-next-line react/prop-types
  RBACProvider: function MockRBACProvider({ children }) {
    return <div data-testid="rbac-provider">{children}</div>;
  },
}));
jest.mock('@project-kessel/react-kessel-access-check', () => ({
  AccessCheck: {
    // eslint-disable-next-line react/prop-types
    Provider: function MockKesselProvider({ children }) {
      return <div data-testid="kessel-provider">{children}</div>;
    },
  },
}));

const mockStore = configureStore([]);

describe('App', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    useFlagsStatus.mockReturnValue({ flagsReady: true });
    useFeatureFlag.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Feature flag loading states', () => {
    it('waits for feature flags to load before rendering', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: false });
      useFeatureFlag.mockReturnValue(false);

      render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(screen.queryByTestId('rbac-provider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('routes')).not.toBeInTheDocument();
    });

    it('renders RBAC provider after flags load with Kessel disabled', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: true });
      useFeatureFlag.mockReturnValue(false);

      render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(screen.getByTestId('rbac-provider')).toBeInTheDocument();
      expect(screen.getByTestId('routes')).toBeInTheDocument();
    });

    it('renders Kessel provider after flags load with Kessel enabled', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: true });
      useFeatureFlag.mockReturnValue(true);

      render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(screen.getByTestId('kessel-provider')).toBeInTheDocument();
      expect(screen.queryByTestId('rbac-provider')).not.toBeInTheDocument();
      expect(screen.getByTestId('routes')).toBeInTheDocument();
    });

    it('avoids rendering RBACProvider during flag loading phase', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: false });
      useFeatureFlag.mockReturnValue(false);

      render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(screen.queryByTestId('rbac-provider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('routes')).not.toBeInTheDocument();
    });
  });

  describe('RBAC v1 mode', () => {
    it('renders only RBACProvider when Kessel is disabled', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: true });
      useFeatureFlag.mockReturnValue(false);

      render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(screen.getByTestId('rbac-provider')).toBeInTheDocument();
      expect(screen.queryByTestId('kessel-provider')).not.toBeInTheDocument();
    });
  });

  describe('Kessel mode', () => {
    it('renders only Kessel provider when enabled', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: true });
      useFeatureFlag.mockReturnValue(true);

      render(
        <Provider store={store}>
          <App />
        </Provider>,
      );

      expect(screen.getByTestId('kessel-provider')).toBeInTheDocument();
      expect(screen.queryByTestId('rbac-provider')).not.toBeInTheDocument();
    });
  });
});

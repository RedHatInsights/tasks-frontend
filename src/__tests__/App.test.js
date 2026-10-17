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
jest.mock('@redhat-cloud-services/frontend-components/InvalidObject', () => {
  const MockInvalidObject = () => <div data-testid="not-found">NotFound</div>;
  MockInvalidObject.displayName = 'MockInvalidObject';
  return MockInvalidObject;
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

  const renderApp = () =>
    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

  beforeEach(() => {
    store = mockStore({});
    useFlagsStatus.mockReturnValue({ flagsReady: true });
    useFeatureFlag.mockImplementation((flag) => {
      if (flag === 'platform.tasks.enabled') {
        return true;
      }
      return false;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Feature flag loading states', () => {
    it('shows loading spinner while waiting for feature flags', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: false });

      renderApp();

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.queryByTestId('rbac-provider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('kessel-provider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('routes')).not.toBeInTheDocument();
      expect(screen.queryByTestId('not-found')).not.toBeInTheDocument();
    });

    it('renders InvalidObject when platform.tasks.enabled is false', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: true });
      useFeatureFlag.mockImplementation((flag) => {
        if (flag === 'platform.tasks.enabled') {
          return false;
        }
        return false;
      });

      renderApp();

      expect(screen.getByTestId('not-found')).toBeInTheDocument();
      expect(screen.queryByTestId('rbac-provider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('kessel-provider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('routes')).not.toBeInTheDocument();
    });

    it('renders RBAC provider after flags load with Kessel disabled and tasks enabled', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: true });
      useFeatureFlag.mockImplementation((flag) => {
        if (flag === 'platform.tasks.enabled') {
          return true;
        }
        if (flag === 'tasks.kessel_enabled') {
          return false;
        }
        return false;
      });

      renderApp();

      expect(screen.getByTestId('rbac-provider')).toBeInTheDocument();
      expect(screen.getByTestId('routes')).toBeInTheDocument();
      expect(screen.queryByTestId('kessel-provider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('not-found')).not.toBeInTheDocument();
    });

    it('renders Kessel provider after flags load with Kessel enabled and tasks enabled', () => {
      useFlagsStatus.mockReturnValue({ flagsReady: true });
      useFeatureFlag.mockImplementation((flag) => {
        if (flag === 'platform.tasks.enabled') {
          return true;
        }
        if (flag === 'tasks.kessel_enabled') {
          return true;
        }
        return false;
      });

      renderApp();

      expect(screen.getByTestId('kessel-provider')).toBeInTheDocument();
      expect(screen.getByTestId('routes')).toBeInTheDocument();
      expect(screen.queryByTestId('rbac-provider')).not.toBeInTheDocument();
      expect(screen.queryByTestId('not-found')).not.toBeInTheDocument();
    });
  });

  describe('RBAC v1 mode', () => {
    it('renders only RBACProvider when Kessel is disabled and tasks enabled', () => {
      useFeatureFlag.mockImplementation((flag) => {
        if (flag === 'platform.tasks.enabled') {
          return true;
        }
        return false;
      });

      renderApp();

      expect(screen.getByTestId('rbac-provider')).toBeInTheDocument();
      expect(screen.queryByTestId('kessel-provider')).not.toBeInTheDocument();
    });
  });

  describe('Kessel mode', () => {
    it('renders only Kessel provider when enabled and tasks enabled', () => {
      useFeatureFlag.mockImplementation((flag) => {
        if (flag === 'platform.tasks.enabled') {
          return true;
        }
        if (flag === 'tasks.kessel_enabled') {
          return true;
        }
        return false;
      });

      renderApp();

      expect(screen.getByTestId('kessel-provider')).toBeInTheDocument();
      expect(screen.queryByTestId('rbac-provider')).not.toBeInTheDocument();
    });
  });
});

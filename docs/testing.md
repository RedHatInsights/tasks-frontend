# Testing Guide

Comprehensive testing patterns and principles for tasks-frontend.

---

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Stack](#test-stack)
- [Running Tests](#running-tests)
- [Testing Patterns](#testing-patterns)
- [Component Testing](#component-testing)
- [Permission Testing](#permission-testing)
- [Common Pitfalls](#common-pitfalls)
- [Coverage](#coverage)

---

## Testing Philosophy

### Core Principle

**Test like a user, not like a developer.**

### Good Tests

✅ Test user-visible behavior  
✅ Mock at system edges (HTTP, external APIs)  
✅ Use semantic queries (`getByRole`, `getByLabelText`)  
✅ Survive refactoring  
✅ Clear test names describing what is being tested

### Bad Tests

❌ Test implementation details (internal state, private methods)  
❌ Mock internal components  
❌ Use snapshots for behavior verification  
❌ Break on non-behavioral refactors  
❌ Vague test names like "it works"

---

## Test Stack

### Jest

**Purpose**: Unit and integration testing  
**Config**: `jest.config.js`

**Key Features**:
- Automatic test discovery (`*.test.js`, `__tests__/*.js`)
- Mocking support
- Coverage reporting
- Watch mode for development

### React Testing Library

**Purpose**: Component testing with user-centric queries

**Key Queries** (in order of preference):
1. `getByRole()` - Most accessible
2. `getByLabelText()` - Form elements
3. `getByPlaceholderText()` - Form inputs
4. `getByText()` - Non-interactive elements
5. `getByTestId()` - Last resort

**Avoid**:
- `container.querySelector()` - Use Testing Library queries instead
- `wrapper.find()` - Not compatible with React Testing Library

---

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- App.test.js

# Run tests matching pattern
npm test -- Permission

# Watch mode (re-run on file changes)
npm test -- --watch

# Update snapshots (if used)
npm test -- -u

# Coverage report
npm test -- --coverage

# Verbose output
npm test -- --verbose

# Run lint and tests together
npm run verify
```

### Test File Patterns

Tests are located in:
- `src/__tests__/` - Top-level tests
- `src/*/___tests__/` - Component-specific tests

---

## Testing Patterns

### 1. Basic Component Test

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders content', () => {
    render(<MyComponent />);
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### 2. Testing User Interactions

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('handles button click', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  const button = screen.getByRole('button', { name: /submit/i });
  await user.click(button);
  
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

### 3. Testing Async Behavior

```javascript
import { render, screen, waitFor } from '@testing-library/react';

it('loads data asynchronously', async () => {
  render(<MyComponent />);
  
  // Wait for async operation
  await waitFor(() => {
    expect(screen.getByText('Loaded Data')).toBeInTheDocument();
  });
});
```

### 4. Mocking Modules

```javascript
// Mock entire module
jest.mock('./myModule', () => ({
  myFunction: jest.fn(),
}));

// Mock specific export
jest.mock('./myModule', () => ({
  ...jest.requireActual('./myModule'),
  myFunction: jest.fn(),
}));

// Mock with implementation
jest.mock('./myModule', () => ({
  myFunction: jest.fn(() => 'mocked value'),
}));
```

### 5. Testing with Redux

```javascript
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

it('renders with Redux store', () => {
  const store = mockStore({
    tasks: { items: [] },
  });
  
  render(
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );
});
```

---

## Component Testing

### WithPermission Component

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import WithPermission from './WithPermission';
import { useRbacV1Permissions, useKesselPermissions } from '../../Utilities/usePermissionCheck';
import useFeatureFlag from '../../Utilities/useFeatureFlag';

jest.mock('../../Utilities/usePermissionCheck');
jest.mock('../../Utilities/useFeatureFlag');

describe('WithPermission', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFeatureFlag.mockReturnValue(false);
    useRbacV1Permissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });
    useKesselPermissions.mockReturnValue({
      hasAccess: true,
      isLoading: false,
    });
  });

  it('renders children when user has access', () => {
    render(
      <WithPermission requiredPermissions={['tasks:*:*']}>
        <div>Protected Content</div>
      </WithPermission>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows NotAuthorized when user lacks access', () => {
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: false,
    });
    
    render(
      <WithPermission requiredPermissions={['tasks:*:*']}>
        <div>Protected Content</div>
      </WithPermission>
    );
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText(/You do not have access/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    useRbacV1Permissions.mockReturnValue({
      hasAccess: false,
      isLoading: true,
    });
    
    const { container } = render(
      <WithPermission requiredPermissions={['tasks:*:*']}>
        <div>Protected Content</div>
      </WithPermission>
    );
    
    expect(container.firstChild).toBeNull();
  });
});
```

### App Component

```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from './App';
import useFeatureFlag from './Utilities/useFeatureFlag';
import { useFlagsStatus } from '@unleash/proxy-client-react';

jest.mock('./Routes', () => {
  const MockRoutes = () => <div data-testid="routes">Routes</div>;
  MockRoutes.displayName = 'MockRoutes';
  return MockRoutes;
});
jest.mock('./Utilities/useFeatureFlag');
jest.mock('@unleash/proxy-client-react');

const mockStore = configureStore([]);

describe('App', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    useFlagsStatus.mockReturnValue({ flagsReady: true });
    useFeatureFlag.mockReturnValue(false);
  });

  it('waits for feature flags to load', () => {
    useFlagsStatus.mockReturnValue({ flagsReady: false });
    
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    expect(screen.queryByTestId('routes')).not.toBeInTheDocument();
  });

  it('renders after flags are ready', () => {
    useFlagsStatus.mockReturnValue({ flagsReady: true });
    
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });
});
```

---

## Permission Testing

### Testing Both RBAC v1 and Kessel

**Key Pattern**: Both hooks are **always called** (React Rules of Hooks), but feature flag determines which result is used.

```javascript
describe('Permission checks', () => {
  describe('RBAC v1 mode', () => {
    beforeEach(() => {
      useFeatureFlag.mockReturnValue(false);
    });

    it('uses RBAC v1 permissions', () => {
      useRbacV1Permissions.mockReturnValue({
        hasAccess: true,
        isLoading: false,
      });
      useKesselPermissions.mockReturnValue({
        hasAccess: false,  // Different value
        isLoading: false,
      });
      
      render(<MyComponent />);
      
      // Should use RBAC result (true)
      expect(screen.getByText('Content')).toBeInTheDocument();
      
      // Both hooks should be called
      expect(useRbacV1Permissions).toHaveBeenCalled();
      expect(useKesselPermissions).toHaveBeenCalled();
    });
  });

  describe('Kessel mode', () => {
    beforeEach(() => {
      useFeatureFlag.mockReturnValue(true);
    });

    it('uses Kessel permissions', () => {
      useRbacV1Permissions.mockReturnValue({
        hasAccess: false,  // Different value
        isLoading: false,
      });
      useKesselPermissions.mockReturnValue({
        hasAccess: true,
        isLoading: false,
      });
      
      render(<MyComponent />);
      
      // Should use Kessel result (true)
      expect(screen.getByText('Content')).toBeInTheDocument();
      
      // Both hooks should be called
      expect(useRbacV1Permissions).toHaveBeenCalled();
      expect(useKesselPermissions).toHaveBeenCalled();
    });
  });
});
```

### Permission Hook Testing

```javascript
import { renderHook } from '@testing-library/react';
import { usePermissionCheck } from './usePermissionCheck';
import { useRbacV1Permissions, useKesselPermissions } from './usePermissionCheck';
import useFeatureFlag from './useFeatureFlag';

jest.mock('./useFeatureFlag');

describe('usePermissionCheck', () => {
  it('returns RBAC v1 result when flag is disabled', () => {
    useFeatureFlag.mockReturnValue(false);
    
    const { result } = renderHook(() => 
      usePermissionCheck('tasks', ['tasks:*:*'])
    );
    
    expect(result.current.hasAccess).toBe(true);
  });

  it('returns Kessel result when flag is enabled', () => {
    useFeatureFlag.mockReturnValue(true);
    
    const { result } = renderHook(() => 
      usePermissionCheck('tasks', ['tasks:*:*'])
    );
    
    expect(result.current.hasAccess).toBe(true);
  });
});
```

---

## Common Pitfalls

### 1. Not Mocking Feature Flags

**Problem**:
```javascript
// Test fails because useFeatureFlag is not mocked
render(<App />);
```

**Fix**:
```javascript
jest.mock('./Utilities/useFeatureFlag');

beforeEach(() => {
  useFeatureFlag.mockReturnValue(false);
});
```

### 2. Forgetting to Mock Both Permission Hooks

**Problem**:
```javascript
// Only mocking one hook causes the other to be undefined
jest.mock('../../Utilities/usePermissionCheck', () => ({
  useRbacV1Permissions: jest.fn(),
  // Missing useKesselPermissions!
}));
```

**Fix**:
```javascript
jest.mock('../../Utilities/usePermissionCheck', () => ({
  useRbacV1Permissions: jest.fn(),
  useKesselPermissions: jest.fn(),
}));
```

### 3. Using Old Mock Imports

**Problem**:
```javascript
// Old RBACHook import no longer exists
jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook');
```

**Fix**:
```javascript
jest.mock('../../Utilities/usePermissionCheck');
```

### 4. Not Waiting for Async Operations

**Problem**:
```javascript
// Assertion runs before data loads
render(<MyComponent />);
expect(screen.getByText('Loaded Data')).toBeInTheDocument(); // Fails!
```

**Fix**:
```javascript
render(<MyComponent />);
await waitFor(() => {
  expect(screen.getByText('Loaded Data')).toBeInTheDocument();
});
```

### 5. Testing Implementation Details

**Problem**:
```javascript
// Testing internal state instead of user-visible behavior
expect(wrapper.state('isOpen')).toBe(true);
```

**Fix**:
```javascript
// Test what the user sees
expect(screen.getByRole('dialog')).toBeInTheDocument();
```

### 6. Using `container.querySelector`

**Problem**:
```javascript
const element = container.querySelector('.my-class');
```

**Fix**:
```javascript
const element = screen.getByTestId('my-element');
// Or better:
const element = screen.getByRole('button', { name: /submit/i });
```

---

## Coverage

### Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical user flows
- **Component Tests**: All interactive components

### Running Coverage

```bash
# Generate coverage report
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
```

### Coverage Output

```
-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------
All files              |   85.23 |    78.45 |   82.67 |   86.12 |
 App.js                |     100 |      100 |     100 |     100 |
 Routes.js             |   91.23 |    85.71 |   88.89 |   92.45 |
 WithPermission.js     |     100 |      100 |     100 |     100 |
 usePermissionCheck.js |   87.50 |    75.00 |   90.00 |   88.24 | 45-47,62
-----------------------|---------|----------|---------|---------|-------------------
```

### What to Cover

✅ **Must Cover**:
- Permission checks
- User interactions
- API error handling
- Loading states
- Feature flag branches

⚠️ **Optional Coverage**:
- Utility functions (if pure)
- Constants (usually skip)
- Types/interfaces (skip)

❌ **Don't Cover**:
- Third-party libraries
- Mock files
- Configuration files

---

## Best Practices

### 1. Organize Tests by Behavior

```javascript
describe('MyComponent', () => {
  describe('when user is authenticated', () => {
    // Tests for authenticated state
  });

  describe('when user is not authenticated', () => {
    // Tests for unauthenticated state
  });

  describe('error handling', () => {
    // Tests for error states
  });
});
```

### 2. Use `beforeEach` for Common Setup

```javascript
describe('MyComponent', () => {
  let mockFn;

  beforeEach(() => {
    mockFn = jest.fn();
    useFeatureFlag.mockReturnValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Tests...
});
```

### 3. Write Descriptive Test Names

```javascript
// ❌ Bad
it('works', () => { ... });
it('test 1', () => { ... });

// ✅ Good
it('renders task list when user has permissions', () => { ... });
it('shows loading spinner while fetching tasks', () => { ... });
it('displays error message when API call fails', () => { ... });
```

### 4. Test Edge Cases

```javascript
it('handles empty task list', () => { ... });
it('handles API timeout', () => { ... });
it('handles permission denied', () => { ... });
it('handles malformed API response', () => { ... });
```

### 5. Avoid Test Interdependence

```javascript
// ❌ Bad - Tests depend on order
let sharedState;
it('test 1', () => { sharedState = 'value'; });
it('test 2', () => { expect(sharedState).toBe('value'); });

// ✅ Good - Each test is independent
it('test 1', () => {
  const state = 'value';
  expect(state).toBe('value');
});

it('test 2', () => {
  const state = 'value';
  expect(state).toBe('value');
});
```

---

## Debugging Tests

### Common Debug Commands

```bash
# Run single test with verbose output
npm test -- --testNamePattern="my test name" --verbose

# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Add debug output in test
console.log(screen.debug());
```

### Debug Helpers

```javascript
import { screen } from '@testing-library/react';

// Print entire DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Print with more lines
screen.debug(undefined, 100000);
```

---

## Resources

- **Testing Library Docs**: https://testing-library.com/docs/react-testing-library/intro/
- **Jest Docs**: https://jestjs.io/docs/getting-started
- **Common Testing Mistakes**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

**Last Updated**: 2026-04-29  
**Maintainer**: Development Team

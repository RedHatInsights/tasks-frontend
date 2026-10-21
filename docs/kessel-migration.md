# Kessel Permission Migration Guide

Complete guide to the Kessel permission system implementation in tasks-frontend, including migration from RBAC v1, race condition fixes, and testing.

---

## Table of Contents

- [Overview](#overview)
- [Implementation Status](#implementation-status)
- [Permission System Comparison](#permission-system-comparison)
- [Architecture](#architecture)
- [Race Condition Fix](#race-condition-fix)
- [Permission Mapping](#permission-mapping)
- [Testing](#testing)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)

---

## Overview

Tasks-frontend supports two permission systems controlled by the `tasks.kessel_enabled` feature flag:

- **RBAC v1**: Legacy role-based access control via `/api/rbac/v1/access/`
- **Kessel**: New unified permissions system with workspace support

### Why Kessel?

- **Workspace-aware**: Supports multi-tenancy and organizational boundaries
- **Relationship-based**: Zanzibar-inspired ReBAC model for complex permissions
- **Platform standard**: Unified permission system across Red Hat Insights
- **Future-proof**: New features will be Kessel-only

### Migration Strategy

**Feature flag gated** - Both systems coexist:
1. Deploy with flag OFF (RBAC v1)
2. Enable flag gradually (10% → 50% → 100%)
3. Monitor for issues
4. Eventually remove RBAC v1 code (after full rollout)

---

## Implementation Status

✅ **COMPLETE** - All implementation tasks finished and tested

**Date Completed**: February 27, 2026  
**Test Results**: All tests passing (6 new App tests, 4 WithPermission tests, 12 CompletedTaskDetails tests)

### What Was Implemented

1. ✅ Package dependencies installed
2. ✅ Utility hooks created (`useDefaultWorkspace`, `usePermissionCheck`)
3. ✅ Permission constants defined (`PERMISSIONS`, `KESSEL_RELATIONS`)
4. ✅ Components updated (`WithPermission`, `CompletedTaskDetails`)
5. ✅ Tests updated and passing
6. ✅ Race condition fix implemented
7. ✅ Documentation created

---

## Permission System Comparison

### RBAC v1 (Legacy)

**How it works**:
```javascript
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

const { hasAccess, isLoading } = usePermissions('tasks', ['tasks:*:*']);
```

**API Call**: `GET /api/rbac/v1/access/?application=tasks&limit=1000`

**Response**:
```json
{
  "data": [
    { "permission": "tasks:*:*", "resourceDefinitions": [] }
  ]
}
```

**Pros**:
- Simple application-based checks
- Well-tested, stable
- No workspace concept needed

**Cons**:
- No multi-tenancy support
- Coarse-grained permissions
- Legacy API

### Kessel (New)

**How it works**:
```javascript
import { useKesselPermissions } from './Utilities/usePermissionCheck';

const [hasAccess, isLoading] = useKesselPermissions([
  'tasks_all_execute',
  'tasks_all_view'
]);
```

**API Calls**:
1. `GET /api/rbac/v2/workspaces/?type=default` (fetch workspace)
2. Kessel API permission checks (workspace-scoped)

**Response**: Boolean permission results

**Pros**:
- Workspace-aware (multi-tenancy)
- Fine-grained relationship-based permissions
- Platform standard
- Future-proof

**Cons**:
- More complex (workspace concept)
- Requires workspace fetch
- Newer, less battle-tested

---

## Architecture

### Feature Flag Flow

```
App.js mounts
    ↓
useFlagsStatus() → flagsReady?
    ↓
  FALSE: return null (wait)
  TRUE: ↓
    ↓
useFeatureFlag('tasks.kessel_enabled')
    ↓
    ├─ FALSE (RBAC v1)
    │   ↓
    │   <RBACProvider appName="tasks">
    │     <Routes />
    │   </RBACProvider>
    │
    └─ TRUE (Kessel)
        ↓
        <AccessCheck.Provider>
          <Routes />
        </AccessCheck.Provider>
```

### Permission Check Flow

**WithPermission Component**:
```javascript
const WithPermission = ({ children, requiredPermissions }) => {
  const isKesselEnabled = useFeatureFlag('tasks.kessel_enabled');

  // Both hooks ALWAYS called (React Rules of Hooks)
  const rbacResult = useRbacV1Permissions('tasks', requiredPermissions);
  const kesselResult = useKesselPermissions(kesselRelations);

  // Feature flag determines which result to use
  const { hasAccess, isLoading } = isKesselEnabled ? kesselResult : rbacResult;

  if (isLoading) return '';
  return hasAccess ? children : <NotAuthorized />;
};
```

**Key Pattern**: Both hooks are **always called** (React requirement), but only one result is used based on feature flag.

### File Structure

```
src/
├── App.js                                 [MODIFIED] - Feature flag + race fix
├── Utilities/
│   ├── useFeatureFlag.js                  [EXISTING] - Feature flag hook
│   ├── useDefaultWorkspace.js             [NEW] - Kessel workspace fetcher
│   └── usePermissionCheck.js              [NEW] - Permission hooks
├── PresentationalComponents/
│   └── WithPermission/
│       ├── WithPermission.js              [MODIFIED] - Uses new hooks
│       └── __tests__/WithPermission.tests.js  [MODIFIED] - Updated mocks
├── SmartComponents/
│   └── CompletedTaskDetails/
│       ├── CompletedTaskDetails.js        [MODIFIED] - Uses new hooks
│       └── __tests__/...                  [MODIFIED] - Updated mocks
└── constants.js                           [MODIFIED] - Added PERMISSIONS, KESSEL_RELATIONS
```

---

## Race Condition Fix

### Problem

When `tasks.kessel_enabled` feature flag was enabled, the app still made RBAC v1 API calls during initial load.

**Root Cause**:

```javascript
// useFeatureFlag.js
export default (flag) => {
  const { flagsReady } = useFlagsStatus();
  const isFlagEnabled = useFlag(flag);
  return flagsReady ? isFlagEnabled : false;  // ← Returns FALSE while loading
};
```

During the ~100-500ms Unleash loading phase:
1. `useFeatureFlag('tasks.kessel_enabled')` returns `false`
2. App renders `<RBACProvider>` (RBAC v1 branch)
3. RBACProvider makes `/api/rbac/v1/access/?application=tasks` call
4. Flags finish loading, `useFeatureFlag` now returns `true`
5. App switches to Kessel branch
6. **Result**: Unwanted RBAC v1 call even though Kessel is enabled

### Solution

**Wait for `flagsReady` before rendering either provider**:

```javascript
// src/App.js
const App = () => {
  const { flagsReady } = useFlagsStatus();
  const isKesselEnabled = useFeatureFlag('tasks.kessel_enabled');

  if (!flagsReady) {
    return null;  // Don't render anything until we know which system to use
  }

  return isKesselEnabled ? (
    <AccessCheck.Provider>
      <Routes />
    </AccessCheck.Provider>
  ) : (
    <RBACProvider appName="tasks">
      <Routes />
    </RBACProvider>
  );
};
```

**Additional Fix**: Remove `RBACProvider` from Kessel branch (it was nested inside `AccessCheck.Provider`).

### Verification

**Network Tab**: With Kessel enabled, should see **ZERO** calls to:
```
GET /api/rbac/v1/access/?application=tasks
```

**Note**: You might still see RBAC calls for other applications (e.g., `application=inventory`). Those are from other components and are expected.

---

## Permission Mapping

### Naming Convention

**RBAC v1**: `application:resource:action` (colon-delimited)  
**Kessel**: `application_resource_action` (underscore-delimited)

### Action Verb Translation

| RBAC Action | Kessel Action | Use Case |
|-------------|---------------|----------|
| `read` | `view` | Read-only access |
| `write` | `edit` | Modify/update |
| `*` (wildcard) | `all` or `execute` | Full access (context-dependent) |

### Tasks Permissions

```javascript
// src/constants.js

// RBAC v1
export const PERMISSIONS = {
  tasks: 'tasks:*:*',
  inventoryAll: 'inventory:hosts:*',
  inventoryRead: 'inventory:hosts:read',
};

// Kessel
export const KESSEL_RELATIONS = {
  tasksView: 'tasks_all_view',
  tasksEdit: 'tasks_all_execute',
  inventoryAll: 'inventory_hosts_all',
  inventoryRead: 'inventory_hosts_view',
};
```

### Mapping Table

| Component | RBAC v1 Permission | Kessel Relation | Usage |
|-----------|-------------------|-----------------|-------|
| WithPermission (tasks) | `tasks:*:*` | `tasks_all_execute` | All task operations |
| CompletedTaskDetails (inventory) | `inventory:hosts:*` | `inventory_hosts_all` | Full host access |
| CompletedTaskDetails (inventory) | `inventory:hosts:read` | `inventory_hosts_view` | Read-only host access |

### Usage Examples

**WithPermission Component**:
```javascript
// RBAC v1
const rbacResult = useRbacV1Permissions('tasks', ['tasks:*:*']);

// Kessel
const kesselResult = useKesselPermissions([
  KESSEL_RELATIONS.tasksView,
  KESSEL_RELATIONS.tasksEdit
]);
```

**CompletedTaskDetails Component**:
```javascript
// RBAC v1
const rbacResult = useRbacV1Permissions('inventory', [
  'inventory:hosts:*',
  'inventory:hosts:read'
]);

// Kessel
const kesselResult = useKesselPermissions([
  KESSEL_RELATIONS.inventoryAll,
  KESSEL_RELATIONS.inventoryRead
]);
```

---

## Testing

### Test Files

1. **`src/__tests__/App.test.js`** (6 tests)
   - Feature flag loading states
   - RBAC v1 mode rendering
   - Kessel mode rendering
   - Race condition prevention

2. **`src/PresentationalComponents/WithPermission/__tests__/WithPermission.tests.js`** (4 tests)
   - Permission granted/denied scenarios
   - Loading states
   - Both RBAC v1 and Kessel modes

3. **`src/SmartComponents/CompletedTaskDetails/__tests__/CompletedTaskDetails.tests.js`** (12 tests)
   - Inventory permission checks
   - NotAuthorized rendering
   - Both permission systems

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test -- App.test.js

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Patterns

**Mocking Feature Flags**:
```javascript
jest.mock('./Utilities/useFeatureFlag');
jest.mock('@unleash/proxy-client-react');

beforeEach(() => {
  useFlagsStatus.mockReturnValue({ flagsReady: true });
  useFeatureFlag.mockReturnValue(false);  // or true for Kessel
});
```

**Mocking Permission Hooks**:
```javascript
jest.mock('../../Utilities/usePermissionCheck');

beforeEach(() => {
  useRbacV1Permissions.mockReturnValue({
    hasAccess: true,
    isLoading: false,
  });
  useKesselPermissions.mockReturnValue({
    hasAccess: true,
    isLoading: false,
  });
});
```

**Testing Both Modes**:
```javascript
describe('RBAC v1 mode', () => {
  beforeEach(() => {
    useFeatureFlag.mockReturnValue(false);
  });

  it('uses RBAC v1 permissions', () => {
    render(<MyComponent />);
    expect(useRbacV1Permissions).toHaveBeenCalled();
    expect(useKesselPermissions).toHaveBeenCalled(); // Still called!
  });
});

describe('Kessel mode', () => {
  beforeEach(() => {
    useFeatureFlag.mockReturnValue(true);
  });

  it('uses Kessel permissions', () => {
    render(<MyComponent />);
    expect(useKesselPermissions).toHaveBeenCalled();
    expect(useRbacV1Permissions).toHaveBeenCalled(); // Still called!
  });
});
```

---

## Deployment Guide

### Prerequisites

1. ✅ Code review completed
2. ✅ All tests passing
3. ✅ Lint passing
4. ✅ Documentation updated

### Deployment Steps

#### 1. Deploy to Stage

```bash
npm run build
# Deploy to stage environment
```

**Test with flag disabled**:
- Navigate to `https://console.stage.redhat.com/insights/tasks`
- Open DevTools → Network
- Verify RBAC v1 calls present: `GET /api/rbac/v1/access/?application=tasks`

#### 2. Enable Feature Flag in Stage

**Unleash Configuration**:
- Flag name: `tasks.kessel_enabled`
- Environment: `stage`
- Enable for: 100% of users

**Test with flag enabled**:
- Hard refresh (Ctrl+Shift+R)
- Open DevTools → Network
- **Expected**: ZERO calls to `/api/rbac/v1/access/?application=tasks`
- **Expected**: Kessel API calls present

#### 3. Verify Functionality

Test scenarios:
- ✅ User with `tasks:*:*` permission can access all pages
- ✅ User without `tasks` permission sees NotAuthorized
- ✅ Inventory permissions work in CompletedTaskDetails
- ✅ No console errors
- ✅ Loading states work correctly

#### 4. Deploy to Production

```bash
npm run build
# Deploy to production environment
```

**Start with flag DISABLED**:
- Verify existing functionality works
- Monitor error rates

#### 5. Gradual Rollout

**Phase 1: 10%**
- Enable flag for 10% of users in Unleash
- Monitor for 24-48 hours
- Check error rates, API call patterns

**Phase 2: 50%**
- Increase to 50% of users
- Monitor for 24-48 hours

**Phase 3: 100%**
- Enable for all users
- Monitor for 1 week

**Phase 4: Cleanup** (Optional)
- After successful rollout, can remove RBAC v1 code
- Remove feature flag checks
- Simplify to Kessel-only

### Rollback Plan

If issues are detected:

1. **Immediate**: Disable feature flag in Unleash (reverts to RBAC v1)
2. **Investigate**: Check logs, network calls, error reports
3. **Fix**: Update code if needed
4. **Re-test**: Verify fix in stage
5. **Re-deploy**: Try gradual rollout again

---

## Troubleshooting

### Issue: RBAC v1 calls still happening with Kessel enabled

**Symptoms**:
- Network tab shows `GET /api/rbac/v1/access/?application=tasks`
- Even though feature flag is enabled in Unleash

**Debug Steps**:

1. **Check feature flag state**:
   ```javascript
   // Add temporary logging in App.js
   console.log('flagsReady:', flagsReady, 'isKesselEnabled:', isKesselEnabled);
   ```

2. **Verify hard refresh**:
   - Press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   - Clear browser cache if needed

3. **Check App.js implementation**:
   - Ensure `flagsReady` check is present
   - Ensure `RBACProvider` is NOT in Kessel branch

4. **Check Network timing**:
   - RBAC call should NOT happen after flags are ready
   - If it happens immediately on load, flags aren't being waited for

**Fix**: See [Race Condition Fix](#race-condition-fix) section

### Issue: NotAuthorized screen when user should have access

**Symptoms**:
- User sees "You do not have access to Tasks" screen
- User should have `tasks:*:*` permission

**Debug Steps**:

1. **Check permission API response**:
   - RBAC v1: Look for `GET /api/rbac/v1/access/?application=tasks` in Network tab
   - Kessel: Check Kessel API calls
   - Verify response includes expected permissions

2. **Check hook return values**:
   ```javascript
   // Add logging in WithPermission.js
   console.log('hasAccess:', hasAccess, 'isLoading:', isLoading);
   ```

3. **Verify feature flag**:
   - Check if flag is actually enabled/disabled as expected
   - Test with flag explicitly toggled

4. **Check permission mapping**:
   - RBAC v1: Should check for `tasks:*:*`
   - Kessel: Should check for `tasks_all_execute` and `tasks_all_view`

**Fix**: Ensure permission mappings in `constants.js` are correct and hooks are properly using them.

### Issue: Tests failing after migration

**Symptoms**:
- Tests fail with "Cannot read property 'hasAccess' of undefined"
- Tests expect old hook names

**Debug Steps**:

1. **Update mocks**:
   ```javascript
   // OLD (wrong)
   jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook');
   
   // NEW (correct)
   jest.mock('../../Utilities/usePermissionCheck');
   ```

2. **Mock both hooks**:
   ```javascript
   useRbacV1Permissions.mockReturnValue({ hasAccess: true, isLoading: false });
   useKesselPermissions.mockReturnValue({ hasAccess: true, isLoading: false });
   ```

3. **Mock feature flags**:
   ```javascript
   useFlagsStatus.mockReturnValue({ flagsReady: true });
   useFeatureFlag.mockReturnValue(false); // or true
   ```

**Fix**: Update all test files to use new mocks (see [Testing](#testing) section).

### Issue: Stuck on loading state

**Symptoms**:
- App shows blank screen or loading spinner indefinitely
- No content renders

**Debug Steps**:

1. **Check console for errors**:
   - Look for JavaScript errors
   - Look for API errors

2. **Check feature flag loading**:
   ```javascript
   console.log('flagsReady:', flagsReady);
   ```
   - Should eventually become `true`
   - If stuck on `false`, Unleash connection might be broken

3. **Check network tab**:
   - Look for failed API calls
   - Check if Unleash endpoint is accessible

**Fix**: Ensure Unleash is accessible and responding. Add timeout/error handling if needed.

---

## Network Debugging

### Expected API Calls

**With Feature Flag DISABLED (RBAC v1)**:
```
GET /api/rbac/v1/access/?application=tasks&limit=1000
GET /api/rbac/v1/access/?application=inventory&limit=1000  (on task details page)
```

**With Feature Flag ENABLED (Kessel)**:
```
GET /api/rbac/v2/workspaces/?type=default
(Kessel API permission check calls)
```

**Should NOT see** (with Kessel enabled):
```
GET /api/rbac/v1/access/?application=tasks&limit=1000  ← This is the bug!
```

### Timeline Analysis

**Before Race Condition Fix**:
```
0ms    - Page load
10ms   - useFeatureFlag returns false (flags not ready)
15ms   - RBACProvider mounts
50ms   - RBAC v1 API call: application=tasks ❌
200ms  - Flags ready, isKesselEnabled = true
205ms  - RBACProvider unmounts, Kessel provider mounts
220ms  - Kessel API calls ✅
```

**After Race Condition Fix**:
```
0ms    - Page load
10ms   - flagsReady = false
15ms   - App returns null (nothing renders)
200ms  - Flags ready, isKesselEnabled = true
205ms  - Kessel provider mounts
220ms  - Kessel API calls ✅
```

No RBAC v1 call for `application=tasks`!

---

## Future Improvements

### 1. Loading Indicator

Instead of `return null` during flag loading, show a loading indicator:

```javascript
if (!flagsReady) {
  return (
    <Bullseye>
      <Spinner size="lg" />
    </Bullseye>
  );
}
```

### 2. Granular Task Permissions

Replace wildcards with specific permissions:

```javascript
// Current
PERMISSIONS.tasks = 'tasks:*:*'

// Future
PERMISSIONS.tasksAvailable = 'tasks:available:read'
PERMISSIONS.tasksExecute = 'tasks:available:execute'
PERMISSIONS.tasksExecuted = 'tasks:executed:read'
```

### 3. Workspace Selector

Allow users to switch between workspaces:

```javascript
const [selectedWorkspace, setSelectedWorkspace] = useState(null);
const workspaceId = selectedWorkspace || defaultWorkspaceId;
```

### 4. Permission Caching

Cache permission results to reduce API calls:

```javascript
const permissionCache = useRef({});
if (permissionCache.current[workspaceId]) {
  return permissionCache.current[workspaceId];
}
```

---

## Resources

- **Insights Advisor Frontend Pattern**: [PR #1732](https://github.com/RedHatInsights/insights-advisor-frontend/pull/1732)
- **Kessel Relations API**: [GitHub](https://github.com/project-kessel/relations-api)
- **RBAC Config**: [GitHub](https://github.com/RedHatInsights/rbac-config)
- **Platform Docs**: [Frontend Starter](https://github.com/RedHatInsights/insights-frontend-starter-app)

---

**Last Updated**: 2026-04-29  
**Status**: ✅ Implementation Complete, Ready for Deployment

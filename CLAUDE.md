# Red Hat Insights Tasks Frontend

React-based frontend for Red Hat Insights Tasks, enabling administrators to execute automation tasks across their RHEL fleet.

**Stack**: React 18, Redux, PatternFly 5, React Router v6  
**Testing**: Jest + React Testing Library

---

## Quick Links

- **[Kessel Migration Guide](docs/kessel-migration.md)** - RBAC v1 to Kessel permission migration
- **[Testing Guide](docs/testing.md)** - Testing patterns and principles

---

## What is Tasks?

Tasks is a Red Hat Insights application that allows administrators to execute automation tasks (Ansible playbooks) across their Red Hat Enterprise Linux (RHEL) systems inventory. It provides:

1. **Task Discovery** - Browse available automation tasks from Red Hat's catalog
2. **Task Execution** - Run tasks on selected systems
3. **Execution History** - View past task executions and results
4. **Inventory Integration** - Tight integration with Red Hat Insights Inventory

### Key Features

- **Available Tasks**: Catalog of automation tasks that can be run on RHEL systems
- **Executed Tasks**: History of all task runs with status and results
- **Task Details**: Detailed view of task execution results per system
- **Permission Control**: RBAC-based access control for task execution
- **Zero State**: Graceful handling when no systems are connected

---

## Application Architecture

### Routes

| Route | Purpose | Component | Permission |
|-------|---------|-----------|------------|
| `/insights/tasks/available` | Browse available tasks | `TasksPage` (tab 0) | `tasks:*:*` |
| `/insights/tasks/available/:slug` | Run task modal | `RunTaskModalRoute` | `tasks:*:*` |
| `/insights/tasks/executed` | View executed tasks | `TasksPage` (tab 1) | `tasks:*:*` |
| `/insights/tasks/executed/:id` | Task execution details | `CompletedTaskDetails` | `tasks:*:*` |

**Default Route**: Navigates to `/available` for any unmatched path

### Permission System

Tasks uses **two parallel permission systems** controlled by feature flag:

| System | When Used | Hook | API Endpoint |
|--------|-----------|------|--------------|
| **RBAC v1** | Default (flag OFF) | `useRbacV1Permissions` | `/api/rbac/v1/access/` |
| **Kessel** | Feature flag ON | `useKesselPermissions` | Kessel API |

**Feature Flag**: `tasks.kessel_enabled` (managed via Unleash)

See **[Kessel Migration Guide](docs/kessel-migration.md)** for details.

### Component Structure

```
src/
├── App.js                           # Root component with permission provider
├── Routes.js                        # Route configuration + permission wrapper
├── SmartComponents/
│   ├── TasksPage/                   # Main tasks list (available + executed tabs)
│   ├── CompletedTaskDetails/        # Individual task execution details
│   ├── RunTaskModal/                # Modal for running tasks
│   ├── ActivityTable/               # Executed tasks table
│   └── SystemTable/                 # Available tasks table
├── PresentationalComponents/
│   └── WithPermission/              # Permission wrapper component
├── Utilities/
│   ├── usePermissionCheck.js        # Permission hooks (RBAC v1 + Kessel)
│   ├── useDefaultWorkspace.js       # Kessel workspace fetcher
│   ├── useFeatureFlag.js            # Feature flag hook
│   └── helpers.js                   # Utility functions
├── modules/                         # Redux actions, reducers, types
└── store/                           # Redux store configuration
```

---

## Key Workflows

### 1. Available Tasks Flow

```
User visits /available
        ↓
Routes.js checks hasSystems (inventory count > 0)
        ↓
    NO: Show AppZeroState (dashboard federated module)
    YES: ↓
        ↓
WithPermission wrapper checks tasks:*:* permission
        ↓
    NO ACCESS: Show NotAuthorized screen
    HAS ACCESS: ↓
        ↓
TasksPage renders (tab 0)
        ↓
SystemTable displays available tasks
        ↓
User clicks task → RunTaskModal opens
        ↓
User selects systems → Executes task
```

### 2. Executed Tasks Flow

```
User visits /executed
        ↓
WithPermission checks tasks:*:* permission
        ↓
TasksPage renders (tab 1)
        ↓
ActivityTable displays executed tasks
        ↓
User clicks row → Navigate to /executed/:id
        ↓
CompletedTaskDetails component
        ↓
Checks inventory:hosts:* permission
        ↓
Shows task results per system
```

### 3. Permission Check Flow

**App.js** (Root Level):
```
App mounts
    ↓
Wait for flagsReady (Unleash)
    ↓
isKesselEnabled ?
    ↓
  TRUE: Render AccessCheck.Provider (Kessel)
    ↓       + Routes
  FALSE: Render RBACProvider (RBAC v1)
    ↓       + Routes
```

**WithPermission** (Route Level):
```
Route renders
    ↓
WithPermission component
    ↓
isKesselEnabled ?
    ↓
  TRUE: useKesselPermissions([KESSEL_RELATIONS.tasksView, ...])
    ↓
  FALSE: useRbacV1Permissions('tasks', ['tasks:*:*'])
    ↓
{ hasAccess, isLoading }
    ↓
  isLoading: Show empty string (loading)
  hasAccess: Render children
  NO ACCESS: Show NotAuthorized
```

---

## Permission Details

### Tasks Permissions

**RBAC v1 Format**: `tasks:*:*` (colon-delimited)  
**Kessel Format**: `tasks_all_execute` (underscore-delimited)

**Mapping**:
```javascript
// src/constants.js
export const PERMISSIONS = {
  tasks: 'tasks:*:*',
  inventoryAll: 'inventory:hosts:*',
  inventoryRead: 'inventory:hosts:read',
};

export const KESSEL_RELATIONS = {
  tasksView: 'tasks_all_view',
  tasksEdit: 'tasks_all_execute',
  inventoryAll: 'inventory_hosts_all',
  inventoryRead: 'inventory_hosts_view',
};
```

### Inventory Permissions

Used in **CompletedTaskDetails** to show/hide system-specific results:

- **RBAC v1**: `inventory:hosts:*` or `inventory:hosts:read`
- **Kessel**: `inventory_hosts_all` or `inventory_hosts_view`

If user lacks inventory permissions, shows NotAuthorized instead of task results.

---

## Feature Flags

### Primary Flag: `tasks.kessel_enabled`

**Purpose**: Controls permission system (RBAC v1 vs Kessel)  
**Default**: `false` (uses RBAC v1)  
**Managed By**: Unleash

**Implementation**:
```javascript
// src/Utilities/useFeatureFlag.js
export default (flag) => {
  const { flagsReady } = useFlagsStatus();
  const isFlagEnabled = useFlag(flag);
  return flagsReady ? isFlagEnabled : false;
};
```

**Usage in App.js**:
```javascript
const { flagsReady } = useFlagsStatus();
const isKesselEnabled = useFeatureFlag('tasks.kessel_enabled');

if (!flagsReady) {
  return null;  // Wait for flags to load
}

return isKesselEnabled ? (
  <AccessCheck.Provider>  // Kessel
    <Routes />
  </AccessCheck.Provider>
) : (
  <RBACProvider>  // RBAC v1
    <Routes />
  </RBACProvider>
);
```

**Critical**: Must wait for `flagsReady` before rendering providers to avoid race condition where RBAC v1 is briefly called before switching to Kessel.

### Other Flags

Tasks may use additional feature flags for UI features. Check component code for specific flag names.

---

## Critical Patterns

### 1. Permission Hook Pattern

**Always call both hooks** (React Rules of Hooks):

```javascript
const isKesselEnabled = useFeatureFlag('tasks.kessel_enabled');

// Both hooks ALWAYS called
const rbacResult = useRbacV1Permissions('tasks', requiredPermissions);
const kesselResult = useKesselPermissions(kesselRelations);

// Feature flag determines which result to use
const { hasAccess, isLoading } = isKesselEnabled ? kesselResult : rbacResult;
```

**Why**: React hooks cannot be conditional. Both must be called on every render.

### 2. Feature Flag Loading Guard

**Problem**: `useFeatureFlag` returns `false` while Unleash loads flags.

**Solution**: Always check `flagsReady` before using flag value:

```javascript
const { flagsReady } = useFlagsStatus();
const isKesselEnabled = useFeatureFlag('tasks.kessel_enabled');

if (!flagsReady) {
  return null;  // or <Spinner />
}

// Now safe to use isKesselEnabled
```

**Without this guard**: App briefly renders RBAC v1 provider, makes API call, then switches to Kessel.

### 3. Zero State Handling

**Routes.js** checks if user has any systems connected:

```javascript
const [hasSystems, setHasSystems] = useState(true);

useEffect(() => {
  axios.get(`/api/inventory/v1/hosts?page=1&per_page=1`)
    .then(({ data }) => {
      setHasSystems(data.total > 0);
    });
}, [hasSystems]);

return !hasSystems ? (
  <AsyncComponent
    appName="dashboard"
    module="./AppZeroState"
    scope="dashboard"
    app="Tasks"
  />
) : (
  <Routes>...</Routes>
);
```

**Purpose**: Show onboarding screen if inventory is empty instead of empty task list.

---

## Testing

### Test Commands

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- WithPermission.tests.js

# Run lint
npm run lint

# Run both lint and tests
npm run verify
```

### Testing Patterns

**1. Permission Mocking**:
```javascript
jest.mock('../../Utilities/usePermissionCheck', () => ({
  useRbacV1Permissions: jest.fn(),
  useKesselPermissions: jest.fn(),
}));

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

**2. Feature Flag Mocking**:
```javascript
jest.mock('../../Utilities/useFeatureFlag');

useFeatureFlag.mockReturnValue(false);  // RBAC v1
useFeatureFlag.mockReturnValue(true);   // Kessel
```

**3. Unleash Mocking**:
```javascript
jest.mock('@unleash/proxy-client-react');

useFlagsStatus.mockReturnValue({ flagsReady: true });
```

See **[Testing Guide](docs/testing.md)** for comprehensive patterns.

---

## Development Workflow

### Local Setup

```bash
# Install dependencies
npm install

# Patch /etc/hosts (one-time setup)
npm run patch:hosts

# Start dev server with proxy
npm run start:proxy

# Or start without proxy
npm run start:dev
```

**Dev Server**: `http://localhost:8003`  
**Proxied URL**: `https://stage.foo.redhat.com:1337/insights/tasks`

### Environment Variables

Tasks uses frontend-components-config (fec) for environment configuration. No manual env variables needed.

### Build

```bash
# Production build
npm run build

# Build output
dist/
```

---

## API Integration

Tasks integrates with multiple Red Hat Insights APIs:

| API | Purpose | Example Endpoint |
|-----|---------|------------------|
| **Inventory API** | System information | `/api/inventory/v1/hosts` |
| **Tasks API** | Task catalog and execution | `/api/tasks/v1/...` |
| **RBAC API** | Permissions (v1) | `/api/rbac/v1/access/?application=tasks` |
| **Kessel API** | Permissions (Kessel) | Kessel workspace endpoints |

**Note**: API calls use platform interceptors for authentication and error handling.

---

## Common Issues

### 1. RBAC v1 Calls with Kessel Enabled

**Symptom**: Network tab shows `/api/rbac/v1/access/?application=tasks` even when Kessel flag is enabled.

**Cause**: Missing `flagsReady` check in App.js or RBACProvider rendered in Kessel branch.

**Fix**: See [Kessel Migration Guide](docs/kessel-migration.md#race-condition-fix)

### 2. Permission Check Failures

**Symptom**: NotAuthorized screen when user should have access.

**Debug**:
1. Check network tab for permission API responses
2. Verify feature flag state in Unleash
3. Check hook return values: `{ hasAccess, isLoading }`
4. Ensure both RBAC v1 and Kessel hooks are called

### 3. Tests Failing After Hook Changes

**Symptom**: Tests fail with "Cannot read property 'hasAccess' of undefined"

**Fix**: Update mocks to use new hook names:
```javascript
// Old
jest.mock('@redhat-cloud-services/frontend-components-utilities/RBACHook');

// New
jest.mock('../../Utilities/usePermissionCheck');
```

---

## Project Configuration

### Key Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, insights config |
| `fec.config.js` | Frontend components config (build, proxy) |
| `.eslintrc` | ESLint rules |
| `jest.config.js` | Jest test configuration |
| `tsconfig.json` | TypeScript config (if used) |

### Module Federation

Tasks is loaded as a federated module by the Red Hat Insights platform (chrome). See `insights` field in `package.json`:

```json
{
  "insights": {
    "appname": "tasks"
  }
}
```

---

## Contributing

### Code Style

- **ESLint**: Enforced via `npm run lint`
- **Prettier**: Configured in ESLint
- **React Hooks**: Follow Rules of Hooks (hooks always called, not conditional)

### Before Commit

```bash
# Run verification
npm run verify

# Includes:
# - npm run lint
# - npm test
```

### Testing Requirements

- New features require tests
- Maintain or improve coverage (aim for >80%)
- Test both RBAC v1 and Kessel modes for permission changes
- Include Cypress tests for critical flows (if Cypress is set up)

---

## Additional Resources

- **[Kessel Migration Guide](docs/kessel-migration.md)** - Complete Kessel implementation details
- **[Testing Guide](docs/testing.md)** - Comprehensive testing patterns
- **[Insights Platform Docs](https://github.com/RedHatInsights/insights-frontend-starter-app)** - Platform conventions

---

**Last Updated**: 2026-04-29  
**Maintainer**: Red Hat Insights Team

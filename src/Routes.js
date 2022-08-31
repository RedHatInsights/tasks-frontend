import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';
import WithPermission from './PresentationalComponents/WithPermission/WithPermission';

const PermissionRouter = (route) => {
  const {
    component: Component,
    isExact,
    path,
    props = {},
    requiredPermissions,
  } = route;

  const routeProps = {
    isExact,
    path,
  };

  const componentProps = {
    ...props,
    route: { ...route },
  };

  return (
    <Route {...routeProps}>
      <WithPermission requiredPermissions={requiredPermissions}>
        <Component {...componentProps} />
      </WithPermission>
    </Route>
  );
};

PermissionRouter.propTypes = {
  component: PropTypes.node,
  isExact: PropTypes.bool,
  path: PropTypes.string,
  props: PropTypes.object,
};

const TasksPage = lazy(() =>
  import(
    /* webpackChunkName: "TasksPage" */ './SmartComponents/TasksPage/TasksPage'
  )
);

const CompletedTaskDetails = lazy(() =>
  import(
    /* webpackChunkName: "CompletedTaskDetails" */ './SmartComponents/CompletedTaskDetails/CompletedTaskDetails'
  )
);

const tasksRoutes = [
  {
    path: '/executed/:id',
    isExact: true,
    requiredPermissions: ['tasks:*:*'],
    component: CompletedTaskDetails,
  },
  {
    path: '/available',
    isExact: true,
    requiredPermissions: ['tasks:*:*'],
    component: TasksPage,
    props: { tab: 0 },
  },
  {
    path: '/executed',
    isExact: true,
    requiredPermissions: ['tasks:*:*'],
    component: TasksPage,
    props: { tab: 1 },
  },
  {
    path: '/',
    isExact: true,
    requiredPermissions: ['tasks:*:*'],
    component: TasksPage,
    props: { tab: 0 },
  },
];

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = () => {
  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      <Switch>
        {tasksRoutes.map(PermissionRouter)}
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Suspense>
  );
};

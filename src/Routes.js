import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';

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

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <Switch>
      <Route exact path="/" render={() => <TasksPage tab={0} />} />
      {/*<Redirect exact from="/" to={'/available'} />*/}
      <Route exact path="/available" render={() => <TasksPage tab={0} />} />
      <Route exact path="/executed" render={() => <TasksPage tab={1} />} />
      <Route
        exact
        path="/executed/:id"
        //render={() => <CompletedTaskDetails />}
        component={CompletedTaskDetails}
      />
      {/* Finally, catch all unmatched routes */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </Suspense>
);

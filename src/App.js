import React, { Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from './modules/actions';
import { Routes } from './Routes';
import './App.scss';

import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import pckg from '../package.json';

const App = (props) => {
  const history = useHistory();
  const chrome = useChrome();
  const dispatch = useDispatch();

  useEffect(() => {
    let unregister;
    if (chrome) {
      const registry = getRegistry();
      registry.register({ notifications: notificationsReducer });
      const { identifyApp, on: onChromeEvent } = chrome.init();

      // You can use directly the name of your app
      identifyApp(pckg.insights.appname);
      unregister = onChromeEvent('APP_NAVIGATION', (event) =>
        history.push(`/${event.navId}`)
      );

      onChromeEvent('GLOBAL_FILTER_UPDATE', ({ data }) => {
        const [workloads, SID, tags] =
          chrome?.mapGlobalFilter?.(data, false, true) || [];
        dispatch(actions.setGlobalFilterTags(tags));
        dispatch(actions.setGlobalFilterWorkloads(workloads));
        dispatch(actions.setGlobalFilterSIDs(SID));
      });
    }
    return () => {
      unregister();
    };
  }, [chrome]);

  return (
    <Fragment>
      <NotificationsPortal />
      <Routes childProps={props} />
    </Fragment>
  );
};

export default App;

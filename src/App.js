import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from './modules/actions';
import Routes from './Routes';
import './App.scss';

import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import pckg from '../package.json';

const App = () => {
  const chrome = useChrome();
  const dispatch = useDispatch();

  useEffect(() => {
    if (chrome) {
      const { identifyApp, on: onChromeEvent } = chrome;

      // You can use directly the name of your app
      identifyApp(pckg.insights.appname);

      onChromeEvent('GLOBAL_FILTER_UPDATE', ({ data }) => {
        const [workloads, SID, tags] =
          chrome?.mapGlobalFilter?.(data, false, true) || [];
        dispatch(actions.setGlobalFilterTags(tags));
        dispatch(actions.setGlobalFilterWorkloads(workloads));
        dispatch(actions.setGlobalFilterSIDs(SID));
      });
    }
  }, [chrome]);

  return <Routes />;
};

export default App;

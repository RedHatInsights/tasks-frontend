import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from './modules/actions';
import Routes from './Routes';
import './App.scss';

import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { RBACProvider } from '@redhat-cloud-services/frontend-components/RBACProvider';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';
import { KESSEL_API_BASE_URL } from './constants';
import useFeatureFlag from './Utilities/useFeatureFlag';
import pckg from '../package.json';

const App = () => {
  const chrome = useChrome();
  const dispatch = useDispatch();
  const isKesselEnabled = useFeatureFlag('tasks.kessel_enabled');

  useEffect(() => {
    if (chrome) {
      const { identifyApp, on: onChromeEvent } = chrome;

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

  return isKesselEnabled ? (
    <AccessCheck.Provider
      baseUrl={window.location.origin}
      apiPath={KESSEL_API_BASE_URL}
    >
      <RBACProvider appName="tasks">
        <Routes />
      </RBACProvider>
    </AccessCheck.Provider>
  ) : (
    <RBACProvider appName="tasks">
      <Routes />
    </RBACProvider>
  );
};

export default App;

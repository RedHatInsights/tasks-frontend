import React from 'react';
import { Provider } from 'react-redux';
import { init, RegistryContext } from './store';
import App from './App';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';

const Tasks = () => {
  const registry = init();

  return (
    <RegistryContext.Provider value={{ getRegistry: () => registry }}>
      <Provider store={registry.getStore()}>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </Provider>
    </RegistryContext.Provider>
  );
};

export default Tasks;

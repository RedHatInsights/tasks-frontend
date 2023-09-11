import React from 'react';
import { Provider } from 'react-redux';
import { init, RegistryContext } from './store';
import App from './App';
import logger from 'redux-logger';

const TasksDev = () => {
  const registry = init(logger);

  return (
    <RegistryContext.Provider value={{ getRegistry: () => registry }}>
      <Provider store={registry.getStore()}>
        <App />
      </Provider>
    </RegistryContext.Provider>
  );
};

export default TasksDev;

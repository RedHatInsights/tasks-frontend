import React from 'react';
import { Provider } from 'react-redux';
import { init, RegistryContext } from './store';
import App from './App';

const Tasks = () => {
  const registry = init();

  return (
    <RegistryContext.Provider value={{ getRegistry: () => registry }}>
      <Provider store={registry.getStore()}>
        <App />
      </Provider>
    </RegistryContext.Provider>
  );
};

export default Tasks;

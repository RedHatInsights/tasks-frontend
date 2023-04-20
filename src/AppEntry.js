import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init, RegistryContext } from './store';
import App from './App';

const Tasks = () => {
  const registry = init();

  return (
    <RegistryContext.Provider value={{ getRegistry: () => registry }}>
      <Provider store={registry.getStore()}>
        <Router>
          <App />
        </Router>
      </Provider>
    </RegistryContext.Provider>
  );
};

export default Tasks;

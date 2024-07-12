const { resolve } = require('path');
const packageJson = require('./package.json');

module.exports = {
  appUrl: '/insights/tasks',
  useProxy: process.env.PROXY === 'true',
  proxyVerbose: true,
  hotReload: process.env.HOT === 'true',
  ...(process.env.port ? { port: parseInt(process.env.port) } : {}),
  moduleFederation: {
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: packageJson.dependencies['react-router-dom'],
          requiredVersion: '>=6.0.0 <7.0.0',
        },
      },
    ],
    exposes: {
      './RootApp': resolve(__dirname, './src/AppEntry'),
    },
  },
};

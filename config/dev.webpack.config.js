const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  useProxy: true,
  useChromeTemplate: true,
  routesPath: process.env.CONFIG_PATH,
  appUrl: process.env.BETA
    ? ['/beta/insights/preview', '/preview/insights/tasks']
    : ['/insights/tasks'],
  env: process.env.CHROME_ENV
    ? process.env.CHROME_ENV
    : process.env.BETA
    ? 'stage-beta'
    : 'stage-stable', // pick chrome env ['stage-beta', 'stage-stable', 'prod-beta', 'prod-stable'],
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      exposes: {
        './RootApp': resolve(__dirname, '../src/DevEntry'),
      },
      exclude: ['react-redux'],
      shared: [
        {
          'react-redux': {
            requiredVersion: '*',
            singleton: true,
          },
        },
        {
          'react-router-dom': {
            requiredVersion: '*',
            singleton: true,
          },
        },
      ],
    }
  )
);

module.exports = {
  ...webpackConfig,
  plugins,
};

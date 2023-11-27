const { resolve } = require('path');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  https: false,
  debug: true,
  ...(process.env.BETA === 'true' && { deployment: 'beta/apps' }),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
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

module.exports = (env) => {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    ...webpackConfig,
    plugins,
  };
};

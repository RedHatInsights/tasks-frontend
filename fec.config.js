const { resolve } = require('path');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const packageJson = require('./package.json');

module.exports = {
  appUrl: '/insights/tasks',
  publicPath: 'auto',
  debug: true,
  useProxy: process.env.PROXY === 'true',
  proxyVerbose: true,
  hotReload: process.env.HOT === 'true',
  ...(process.env.port ? { port: parseInt(process.env.port) } : {}),
  devtool: 'hidden-source-map',
  plugins: [
    // Put the Sentry Webpack plugin after all other plugins
    ...(process.env.ENABLE_SENTRY
      ? [
          sentryWebpackPlugin({
            ...(process.env.SENTRY_AUTH_TOKEN && {
              authToken: process.env.SENTRY_AUTH_TOKEN,
            }),
            org: 'red-hat-it',
            project: 'tasks-rhel',
            moduleMetadata: ({ release }) => ({
              dsn: `https://f8eb44de949e487e853185c09340f3cf@o490301.ingest.us.sentry.io/4505397435367424`,
              org: 'red-hat-it',
              project: 'tasks-rhel',
              release,
            }),
          }),
        ]
      : []),
  ],
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
  frontendCRDPath: resolve(__dirname, './deploy/frontend.yml'),
};

module.exports = {
  presets: [
    // Polyfills
    '@babel/env',
    // Allow JSX syntax
    '@babel/react',
  ],
  plugins: [
    // Put _extends helpers in their own file
    '@babel/plugin-transform-runtime',
    // Support for {...props} via Object.assign({}, props)
    '@babel/plugin-proposal-object-rest-spread',
  ],
};

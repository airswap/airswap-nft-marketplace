// Allows configuration of create-react-app build process.
// ref: https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md
/* eslint-disable  */

const fs = require('fs');
const path = require('path');
const cracoEnvPlugin = require('craco-plugin-env');

module.exports = {
  eslint: {
    enable: true,
    mode: 'file',
    configure: (eslintConfig) => {
      eslintConfig.entry = './.eslintrc.js';
      return eslintConfig;
    },
  },
  style: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('postcss-import'),
      ],
    },
    modules: {
      localIdentName: '[path][name]__[local]--[hash:base64:5]'
    }
  },
  plugins: [
    {
      plugin: cracoEnvPlugin,
      options: {
        variables: {
          BUILD_VERSION: fs.existsSync('.git') ? require('child_process')
            .execSync('git rev-parse HEAD', { cwd: __dirname })
            .toString().trim() : 'DEV',
          BUILD_DATE: fs.existsSync('.git') ? require('child_process')
            .execSync('git show -s --format=%ci', { cwd: __dirname })
            .toString().trim() : new Date().toLocaleDateString(),
        },
      },
    },
  ],
  typescript: {
    enableTypeChecking: true,
  },
  webpack: {
    configure: webpackConfig => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      webpackConfig.resolve.fallback = {
        url: require.resolve("url"),
        assert: require.resolve("assert"),
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http"),
        util: require.resolve("util"),
        https: require.resolve("https-browserify"),
        events: require.resolve("events"),
      };
      webpackConfig.resolve.modules = [path.resolve(__dirname, '/node_modules')];
      webpackConfig.resolve.extensions = ['.ts', '.tsx'];
      return webpackConfig;
    },
  },
};

const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./webpack-base-config.js');

module.exports = baseConfig.map(config => merge.smartStrategy({
  entry: 'prepend',
  plugins: 'prepend',
})(config, {
  entry: [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
  ],
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          plugins: ['react-hot-loader/babel'],
        },
      }],
    }],
  },
}));

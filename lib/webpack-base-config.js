const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './src/client/index.js',
  ],
  output: {
    filename: '[hash]-index.js',
    path: path.resolve('./build/client'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/client/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
              ['latest', { es2015: { modules: false } }],
            'react',
            'stage-3',
          ],
          compact: true,
        },
      }],
    }, {
      test: /\.(png|gif|jpg|svg)$/,
      use: [{
        loader: 'file-loader',
        options: { name: '[hash]-[name].[ext]' },
      }],
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

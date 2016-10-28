const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function generateWebpackConfig(options) {
  return {
    entry: [
      'webpack-hot-middleware/client',
      path.join(options.dirSourceClient, 'index.js'),
    ],
    output: {
      filename: '[hash]-index.js',
      path: path.resolve(process.cwd(), options.dirBuildClient),
      publicPath: '/',
    },
    devtool: 'inline-source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.join(options.dirSourceClient, 'index.html'),
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ],
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-3'],
          compact: true,
        },
      }, {
        test: /\.(png|svg|gif)$/,
        loader: 'file-loader',
        query: { name: '[hash]-[name].[ext]' },
      }, {
        test: /\.css$/,
        loader: 'style!css',
      }],
    },
  };
}

module.exports = generateWebpackConfig;

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function generateWebpackConfig(options = {}) {
  return {
    entry: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      path.resolve(process.cwd(), options.dirSourceClient, 'index.js'),
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
      new webpack.HotModuleReplacementPlugin(),
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
            plugins: ['react-hot-loader/babel'],
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
}

module.exports = generateWebpackConfig;

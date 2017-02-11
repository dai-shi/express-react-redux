const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function generateWebpackConfig(options = {}) {
  const indexHtml = options.fileIndexHtml || 'index.html';
  const indexJs = options.fileIndexJs || 'index.js';
  return {
    entry: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      path.resolve(process.cwd(), options.dirSourceClient, indexJs),
    ],
    output: {
      filename: `[hash]-${indexJs}`,
      path: path.resolve(process.cwd(), options.dirBuildClient),
      publicPath: '/',
    },
    devtool: 'inline-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        filename: indexHtml,
        template: path.join(options.dirSourceClient, indexHtml),
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

const productionConfig = {
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        screw_ie8: true,
      },
      comments: false,
    }),
  ],
};

module.exports = generateWebpackConfig;
module.exports.productionConfig = productionConfig;

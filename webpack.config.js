const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require('webpack');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

const commonConfig = merge([
  {
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: '[name].[chunkhash].js',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Webpack demo',
      }),
      new webpack.NamedModulesPlugin(),
    ],
  },
  parts.lintJavaScript({
    include: PATHS.app,
  }),
  parts.loadJavaScript({
    include: PATHS.app,
  }),
]);

const productionConfig = merge([
  parts.extractCSS({
    use: 'css-loader',
  }),
  {
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 100000, // in bytes
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: isVendor,
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
      }),
    ],
    recordsPath: path.join(__dirname, 'records.json'),
  },
  //parts.minifyJavaScript(),
  parts.setFreeVariable(
    'process.env.NODE_ENV',
    'production'
  ),
]);

function isVendor({ resource }) {
  return resource &&
    resource.indexOf('node_modules') >= 0 &&
    resource.match(/.js$/);
}

const developmentConfig = merge([
  parts.devServer({
    // Customize host/port here if needed
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
]);

module.exports = (env) => {
  if (env === 'production') {
    return merge(commonConfig, productionConfig);
  }

  return merge(commonConfig, developmentConfig);
};

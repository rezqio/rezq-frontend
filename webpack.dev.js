const merge = require('webpack-merge');
const webpack = require('webpack');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    'react-hot-loader/babel',
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    historyApiFallback: {
      disableDotRule: true,
    },
  },
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BACKEND_URI: JSON.stringify(process.env.BACKEND_URI),
        FRONTEND_URI: JSON.stringify(process.env.FRONTEND_URI),
        FACEBOOK_APP_ID: JSON.stringify('1148286348660854'),
      },
    }),
    // new BundleAnalyzerPlugin(),
  ],
});

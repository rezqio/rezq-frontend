const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BACKEND_URI: JSON.stringify('https://api.rezq.io'),
        FRONTEND_URI: JSON.stringify('https://rezq.io'),
        FACEBOOK_APP_ID: JSON.stringify('305048256724659'),
      },
    }),
  ],
});

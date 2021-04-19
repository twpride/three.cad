const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const webpack = require('webpack')

module.exports = merge(common, {

  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
      // 'process.env.NODE_ENV': 'production'
    }),
    new webpack.IgnorePlugin(/redux-logger/)
  ]
});
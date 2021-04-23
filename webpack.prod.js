const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const webpack = require('webpack')
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {

  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
      // 'process.env.NODE_ENV': 'production'
    }),
    new webpack.IgnorePlugin(/redux-logger/)
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  }
});
const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const webpack = require('webpack')
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {

  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.IgnorePlugin(/redux-logger/),
    // new CopyPlugin({
    //   patterns: [
    //     { from: "static", to: "" },
    //   ],
    // }),    
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
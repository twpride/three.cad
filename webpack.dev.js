const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const path = require('path');
const fs = require('fs');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    https: {
      key: fs.readFileSync('./https/localhost-key.pem'),
      cert: fs.readFileSync('./https/localhost.pem'),
      ca: fs.readFileSync('./https/rootCA.pem'),
    },
  },

})
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
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
      ca: fs.readFileSync('/home/howard/.local/share/mkcert/rootCA.pem'),
    },
  },

})
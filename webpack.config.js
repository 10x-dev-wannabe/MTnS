const path = require('path');

module.exports = {
  mode: 'development',
  entry: './charts/src/index.js',
  output: {
    path: path.resolve(__dirname, 'charts/app/'),
    filename: 'site.bundle.js'
  }
}

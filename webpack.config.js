import path from 'path';

let config = {
  mode: 'development',
  entry: './charts/src/index.js',
  output: {
    path: path.resolve(import.meta.dirname, 'charts/app/'),
    filename: 'site.bundle.js'
  }
}
export default config

const path = require('path')
const env = require('yargs').argv.env
const webpack = require('webpack')

const LIBRARY_NAME = 'highway'

let baseOutputFile = LIBRARY_NAME + '.js'

let basePlugins = [
]

if (env === 'build') {
  baseOutputFile = LIBRARY_NAME + '.min.js'
  basePlugins.push(new webpack.optimize.UglifyJsPlugin())
}

const baseConfig = {
  entry: path.join(__dirname, '/src/index.js'),
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  }
}

let nodeConfig = {}
Object.assign(nodeConfig, baseConfig, {
  target: 'node',
  output: {
    path: path.join(__dirname, '/lib'),
    filename: 'node-' + baseOutputFile,
    library: LIBRARY_NAME,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [
    new webpack.ProvidePlugin({
      TextDecoder: ['text-encoding', 'TextDecoder'],
      TextEncoder: ['text-encoding', 'TextEncoder'],
      WebSocket: ['websocket', 'w3cwebsocket']
    })
  ].concat(basePlugins)
})

let browserConfig = {}
Object.assign(browserConfig, baseConfig, {
  target: 'web',
  output: {
    path: path.join(__dirname, '/lib'),
    filename: 'browser-' + baseOutputFile,
    library: LIBRARY_NAME,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins: [].concat(basePlugins)
})

module.exports = [ nodeConfig, browserConfig ]

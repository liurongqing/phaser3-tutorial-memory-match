const path = require('path')
const webpack = require('webpack')
const { resolve } = path

const config = {
  entry: './src/main.ts',
  output: {
    path: resolve('./docs'),
    filename: 'game.js'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'babel-loader',
      exclude: /node_modules/,
    }]
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /phaser/,
      contextRegExp: /phaser/
    })
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '~': resolve('./src')
    }
  }
}

module.exports = config

const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  // target: 'web',
  entry: {
    app: './src/main.ts'
  },
  watch: true,
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    // pathinfo: false,
    publicPath: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
        options: {
          experimentalWatchApi: true,
          transpileOnly: true // disable type checker - we will use it in fork plugin
        }
      }
    ]
  },
  // devServer: {
  //   contentBase: path.resolve(__dirname, 'dist'),
  //   publicPath: path.resolve(__dirname, 'dist')
  // },
  devtool: 'inline-source-map', // original I had, but *slowest*
  // devtool: 'eval', // fastest, but no line tracking for debugging
  // devtool: 'cheap-module-eval-source-map', // more on webpack website under "devtool"

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    // new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'index.html'),
        to: path.resolve(__dirname, 'dist')
      },
      {
        from: path.resolve(__dirname, 'assets', '**', '*'),
        to: path.resolve(__dirname, 'dist')
      }
    ]),
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true)
    }),
    new WebpackShellPlugin({
      onBuildEnd: ['npm run run:dev']
    })
  ],
  // externals: [nodeExternals()],
  mode: 'development'
};

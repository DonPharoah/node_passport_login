const path = require('path');
const webpack = require('webpack');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: {
    app: './src/main.ts'
  },
  watch: true,
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    pathinfo: false
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 8080,
    inline: true
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
        // include: path.resolve(__dirname, 'node_modules', 'ts-loader')
      }
    ]
  },
  // devtool: 'inline-source-map', // original I had, but *slowest*
  // devtool: 'eval', // fastest, but no line tracking for debugging
  devtool: 'cheap-module-eval-source-map', // more on webpack website under "devtool"

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
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
      WEBGL_RENDERER: true, // I did this to make webpack work, but I'm not really sure it should always be true
      CANVAS_RENDERER: true // I did this to make webpack work, but I'm not really sure it should always be true
    })
  ],
  mode: 'development'
};

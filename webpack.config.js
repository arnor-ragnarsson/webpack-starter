const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BuildManifestPlugin = require('./build/plugins/BuildManifestPlugin');

const inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
  entry: {
    app: [
      './src/main.js',
      './src/main.scss'
    ],

    hlaupum: [
      './src/main.js',
      './src/main.scss'
    ],
  },

  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: '[name].[chunkhash].js'
  },

  module: {
    rules: [

      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      },

      {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]'
            }
          },

          'img-loader'
        ]

      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false
    }),

    new ExtractTextPlugin('[name].css'),

    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'index.html')), // breyta 'app/*.html' fyrir það sem er rétt
      minimize: inProduction
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: inProduction
    }),

    new BuildManifestPlugin(),
  ]

};

if(inProduction) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );
}

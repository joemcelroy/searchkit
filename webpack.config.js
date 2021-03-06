var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var copyrightBanner = require("fs").readFileSync("./COPYRIGHT", "utf-8");

module.exports = {
  entry: [
    './src/index.ts'
  ],
  output: {
    path: path.join(__dirname, 'release'),
    filename: 'bundle.js',
    library:["Searchkit"],
    libraryTarget:"umd",
    publicPath: '',
    css: 'styles.css'
  },
  resolve: {
    extensions:[".js", ".ts", ".tsx","", ".webpack.js", ".web.js"]
  },
  plugins: [
    new webpack.BannerPlugin(copyrightBanner, {entryOnly:true}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin("styles.css", {allChunks:true}),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['require', 'export', '$super']
      },
      compress: {
        warnings: false,
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    })
  ],
  externals: {
    "react": "React",
    "react-dom":"ReactDOM"
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loaders: ['ts'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(require.resolve("style-loader"),require.resolve("css-loader")+"!"+require.resolve("sass-loader")),
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: [
            'file-loader?name=[path][name].[ext]'
        ],
        include: path.join(__dirname, 'src')
      }
    ]
  }
};

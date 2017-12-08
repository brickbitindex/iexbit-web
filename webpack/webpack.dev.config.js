var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var routers = require('./routers.dev.json').routers;
var index = '/' + require('./routers.dev.json').index;

var entry = {};
routers.forEach((r) => {
  entry[r.name] = r.entry;
});
var plugins = routers.map(r => new HtmlWebpackPlugin({
  template: r.template,
  filename: r.filename,
  chunks: [r.name],
  inject: 'body'
}));
var rewrites = routers.map(r => ({
  from: new RegExp('\\/' + r.name),
  to: '/' + r.filename,
}));

var config = {
  context: path.join(__dirname, '..', '/src'),
  entry,
  output: {
    path: path.join(__dirname, '..', '/build'),
    filename: '[name].bundle.js',
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')), // judge if dev environment.
      __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')) // judge if secret environment.
    }),
    new ExtractTextPlugin("[name].css"),
  ].concat(plugins),
  module: {
    perLoaders: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'eslint'
      },
      {
        test: /.reactx$/,
        loader: 'eslint',
        exclude: /node_modules/
      },
      ,
      {
        test: /.vue$/,
        loader: 'eslint',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel"
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}')
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}!sass'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url?limit=10000!img?progressive=true'
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)$/,
        loader: 'url?limit=10000'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
    ],
    noParse: []
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
    alias: {}
  },
  devtool: 'eval-source-map',
  devServer: {
    inline: true,
    // host: '192.168.0.132',
    // historyApiFallback: {
    //   index,
    //   rewrites,
    // },
    // proxy: {
    //   '/*.json': {
    //     target: 'https://',
    //     // secure: false,
    //     changeOrigin: true,
    //   },
    // }
  },
  externals: {
    jquery: "jQuery",
  },
};

module.exports = config;
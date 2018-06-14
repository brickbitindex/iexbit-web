var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var WebpackShellPlugin = require('webpack-shell-plugin');

var routers = require('./routers.deploy.json').routers;

var entry = {
  vendors: [],
  // vendors: ['react', 'react-dom']
};
routers.forEach((r) => {
  entry[r.name] = r.entry;
});
var plugins = routers.map(r => new HtmlWebpackPlugin({
  template: r.template,
  filename: r.filename,
  chunks: [r.name, 'vendors'],
  // favicon: './assets/images/favicon.ico',
  inject: 'body',
  // hash: true
}));

var config = {
  context: path.join(__dirname, '..', '/src'),
  entry,
  output: {
    path: path.join(__dirname, '..', '/dist/assets'),
    filename: '[name].[chunkhash:8].js',
    publicPath: 'https://assets.bitrabbit.com/market/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: process.env.NODE_ENV !== 'production', // judge if dev environment.
      __ENV__: JSON.stringify('prod'),
    }),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 20000 }),
    new webpack.optimize.OccurenceOrderPlugin(false),
    new webpack.optimize.AggressiveMergingPlugin({
      minSizeReduce: 1.5,
      moveToParents: true
    }),
    // new CommonsChunkPlugin('vendors', 'vendors.[chunkhash:8].js', Infinity),
    new ExtractTextPlugin("[name].[chunkhash:8].css"),
    new webpack.optimize.DedupePlugin(),
    new WebpackShellPlugin({
      onBuildExit: [
        'echo',
        'echo ==============',
        'echo      WORK',
        'echo ==============',
        'echo',
        'node webpack/deploy.js',
      ]
    })
  ].concat(plugins),
  module: {
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
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}!sass')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}!less')
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
      {
        test: /\.html$/,
        loader: "html?minimize=false&minifyJS=false&attrs[]=img:src"
      },
    ]
  },
  resolve: {
    // 設定後只需要寫 require('file') 而不用寫成 require('file.jsx')
    extensions: ['', '.js', '.json', '.jsx'],
  },
  externals: {
    lodash: "_",
    jquery: "jQuery",
    react: "React",
    'react-dom': "ReactDOM"
  },
};

module.exports = config;
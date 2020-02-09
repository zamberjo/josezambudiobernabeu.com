const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const plugins = [
  new MiniCssExtractPlugin({
    filename: 'css/[name].css',
    chunkFilename: 'css/[id].css',
  }),
  new HtmlWebpackPlugin({
    title: 'Jose Zambudio Bernabeu',
    filename: 'index.html',
    template: 'src/index.html',
  }),
  new HtmlWebpackPlugin({
    title: 'Jose Zambudio Bernabeu',
    filename: '404.html',
    template: 'src/404.html',
  }),
];

if ( process.env.NODE_ENV === 'production' ) {
  plugins.push(
    new CleanWebpackPlugin(['dist'], {root: __dirname}),
    new OptimizeCSSAssetsPlugin({}),
  );
}

module.exports = (env) => {
  return {
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    entry: ["@babel/polyfill", path.resolve(__dirname, 'src/index.js')],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "js/[name].js",
    },
    mode: process.env.NODE_ENV,
    module: {
      rules: [{
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                url: false
              }
            },
            'postcss-loader',
          ]
        },
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            }
          },
        },
      ]
    },
    plugins: plugins,
    devServer: {
      host: '0.0.0.0',
      port: 9000,
    },
  };
}

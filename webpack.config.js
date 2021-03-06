const webpack = require('webpack');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    main: './dapp/wallet.jsx'
  },
  output: {
    path: __dirname + '/build',
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
                require('postcss-nested'),
                require('postcss-scrollbar'),
                require('cssnano')
              ]
            }
          }
        ]
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        include: __dirname + '/dapp',
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: {
          loader: 'url-loader',
          options: { limit: 8000 }
        }
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            limit: 50000,
            outputPath: __dirname + '/dist'
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      lib: __dirname + '/lib',
      ui: __dirname + '/dapp/ui',
      views: __dirname + '/dapp/views',
      assets: __dirname + '/dapp/assets',
    },
    plugins: [
      new DirectoryNamedWebpackPlugin({
        exclude: /node_modules/,
        include: [
          __dirname + '/dapp/',
          __dirname + '/lib/'
        ]
      }),
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'PopLocker',
      favicon: __dirname + '/dapp/assets/favicon.png'
    }),
    new webpack.DefinePlugin({
      config: {
        contracts: {
          registrar: JSON.stringify(require(__dirname + '/config/registrar.contract.json')),
          smartLocker: JSON.stringify(require(__dirname + '/config/smartlocker.contract.json'))
        },
        constants: JSON.stringify(require(__dirname + '/config/constants.json'))
      }
    })
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }
  return config;
};

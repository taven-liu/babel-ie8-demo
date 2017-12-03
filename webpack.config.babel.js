import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import Es3ifyPlugin from 'es3ify-webpack-plugin'

import Entries from './config/entries'

const entries = new Entries()
const isProduction = process.env.NODE_ENV === 'production'
const outputDir = path.resolve(__dirname, 'publish')

const postCssLoaders = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
      modules: false,
      importLoaders: 1,
      localIdentName: '[name]__[local]__[hash:base64:5]'
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      sourceComments: true,
      plugins: [
        require('postcss-import')({
          root: path.join(__dirname, './'),
          path: [ path.join(__dirname, './src/common/css') ]
        }),
        require('postcss-apply')(),
        require('postcss-cssnext')(),
        require('postcss-at-rules-variables')(),
        require('postcss-mixins')(),
        require('postcss-each')(),
        require('postcss-reporter')({
          clearMessages: true
        })
      ]
    }
  }
]

var config = {
  entry: entries.getEntries(),
  output: {
    path: outputDir,
    publicPath: isProduction ? 'http://static.xxx.com/' : '../../',
    chunkFilename: 'chunks/' + (isProduction ? '[name].[chunkhash:8].js' : '[name].bundle.js'),
    filename: isProduction ? '[name].[chunkhash:8].js' : '[name].bundle.js'
  },
  resolve: {
    alias: {
      common: path.resolve(__dirname, 'src/common/js'),
      components: path.resolve(__dirname, 'src/components')
    },
    extensions: ['.js', '.css']
  },
  module: {
    loaders: [
      {
        test: /\.(png|jpe?g|gif|ico)(\?\S*)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: isProduction ? '[name].[hash:8].[ext]' : '[name].[ext]',
              /* name (file) {
                const modulesDirname = path.resolve(__dirname, 'src')
                const imgdir = file.substring(modulesDirname.length)
                const extname = path.extname(imgdir)
                const name = imgdir.substr(0, imgdir.length - extname.length)
                return `${name.replace(/(modules.{1}|(page.{1})|(img.{1}))/g, '')}.[hash:8]${extname}`
              }, */
              outputPath: 'img/',
              publicPath: isProduction ? 'http://assets.xxx.com/' : '../../'
            }
          }
        ]
      },
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, './src')
        ],
        use: isProduction
          ? ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: postCssLoaders
          })
          : [ 'style-loader',
            ...postCssLoaders
          ]
      }
    ]
  },
  plugins: [
    new Es3ifyPlugin(),
    ...Entries.getCommonsChunk(isProduction),
    ...entries.getHtmlTpls()
  ]
}

if (isProduction) {
  config.plugins.unshift(new CleanWebpackPlugin(outputDir))
  config.plugins.push(...[
    new ExtractTextPlugin({ filename: isProduction ? '[name].bundle.css' : '[name].[hash].css', allChunks: true }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        screw_ie8: false
      },
      sourceMap: true,
      compress: {
        properties: false,
        warnings: false,
        dead_code: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: isProduction,
        collapse_vars: true,
        reduce_vars: true
      },
      output: {
        beautify: false,
        quote_keys: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
} else {
  config.devtool = 'source-map'
}

export default config

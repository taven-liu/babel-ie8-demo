import glob from 'glob'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default class Entries {
  static getCommonsChunk (isProduction) {
    return [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: isProduction ? 'static/vendor.[chunkhash:8].js' : 'static/vendor.bundle.js',
        minChunks: Infinity
      })
      //  TODO support multi-entries
    ]
  }

  constructor () {
    this.prefix = 'static'
    this.entriesPath = './src/modules/*/page/*/index.js'
    this.htmlTplsPath = './src/modules/*/page/*/index.html'
    this.chunks = []
    this.commonChunk = {
      'vendor': [
        'babel-polyfill',
        'jquery'
      ]
    }
  }

  getEntries () {
    var entries = {}
    var moduleName
    var submoduleName
    var entryName
    glob.sync(this.entriesPath).forEach((filePath) => {
      var arr = filePath.split('/')
      moduleName = arr[3]
      submoduleName = arr[5]
      entryName = `${this.prefix}/${moduleName}/${submoduleName}`
      entries[entryName] = filePath
      this.chunks.push(entryName)
      // TODO save page entries to support multi-entries
    })
    Object.assign(entries, this.commonChunk)
    return entries
  }

  getHtmlTpls () {
    var htmlTpls = []
    var moduleName
    var submoduleName
    glob.sync(this.htmlTplsPath).forEach((filePath) => {
      var arr = filePath.split('/')
      moduleName = arr[3]
      submoduleName = arr[5]
      htmlTpls.push(
        new HtmlWebpackPlugin({
          filename: `templates/${moduleName}/${submoduleName}.html`,
          template: filePath,
          chunks: [`${this.prefix}/${moduleName}/${submoduleName}`, 'vendor'],
          inject: false
        })
      )
    })
    return htmlTpls
  }
}

const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzip = true
const productionGzipExtensions = ['js', 'css']
module.exports = {
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  filenameHashing: true,
  productionSourceMap: process.env.NODE_ENV !== 'production',
  outputDir: 'dist',
  devServer: {
    port: 5080,
    open: true,
    hot: true,
    proxy: {
      '/rss': {
        target: process.env.VUE_APP_WEB_URL,
        changeOrigin: true,
      },
      '/management-nft': {
        target: process.env.VUE_APP_API,
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
    config.plugins.delete('preload')
    config.plugins.delete('named-chunks')

    if (process.env.NODE_ENV !== 'development') {
      productionGzip &&
      new CompressionWebpackPlugin({
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 8192,
        minRatio: 0.8,
      })
    }
    if (process.env.NODE_ENV !== 'development') {
      config.optimization.splitChunks({
        chunks: 'all',
        minChunks: 1,
        cacheGroups: {
          common: {
            name: 'chunk-common',
            priority: 1,
            minChunks: 2,
            maxInitialRequests: 5,
          },
          vendors: {
            name: 'chunk-vendors',
            priority: 2,
            test: /[\\/]node_modules[\\/]/,
          },
          core: {
            name: 'chunk-core',
            priority: 10,
            test: /[\\/]node_modules[\\/]_?core-js(.*)/,
          },
        },
      })
    }
    config.resolve.alias
      .set('@', path.join(__dirname, './src'))
      .set('vue-i18', 'vue-i18n/dist/vue-i18n.cjs.js')

    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true
        args[0].terserOptions.compress.drop_debugger = true
        args[0].terserOptions.compress.pure_funcs = ['console.log']
        args[0].terserOptions.output = {
          comments: false,
        }
        return args
      })
    })
  },
};

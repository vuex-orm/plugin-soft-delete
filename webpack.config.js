var projectRoot = process.cwd()

// Overriding default base webpack config
var config = {
  entry: {
    index: './index.js'
  },
  resolve: {
    // Aliases - Used for pointing to reusable parts of your app
    alias: {
      'src': projectRoot + '/src',
      'images': projectRoot + '/src/assets/images',
      'scss': projectRoot + '/src/assets/scss'
    }
  }
}

if (process.env.ENVIRONMENT === 'production') {
  config.entry.index = './index.js'
  config.output = {
    library: '@vuex-orm/plugin-soft-delete',
    libraryTarget: 'umd'
  }
}

module.exports = config

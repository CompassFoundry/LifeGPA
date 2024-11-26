const path = require('path')

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'src/Components'),
    '@paths': path.resolve(__dirname, 'src/Components/Paths'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@utils': path.resolve(__dirname, 'src/utils'),
  }
  return config
}

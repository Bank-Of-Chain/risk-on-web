const path = require('path')

// === Plugins === //
const { override, addLessLoader, adjustStyleLoaders, addWebpackAlias } = require('customize-cra')

const resolve = dir => path.join(__dirname, '.', dir)

module.exports = override(
  addWebpackAlias({
    '@': resolve('src')
  }),
  addLessLoader({
    lessOptions: {
      test: /\.less$/,
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#13c2c2' }
    }
  }),
  // ↓加了这么个配置
  adjustStyleLoaders(({ use: [, , postcss] }) => {
    const postcssOptions = postcss.options
    postcss.options = { postcssOptions }
  })
)

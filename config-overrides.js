const path = require('path')

// === Utils === //
const { addLessLoader, fixBabelImports, override, addWebpackAlias, adjustStyleLoaders } = require('customize-cra')

// === Plugins === //

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, './src')
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true // change importing css to less
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' }
  }),
  adjustStyleLoaders(({ use: [, , postcss] }) => {
    const postcssOptions = postcss.options
    postcss.options = { postcssOptions }
  })
)

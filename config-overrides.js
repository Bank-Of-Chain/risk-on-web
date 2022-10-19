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
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#A68EFD' }
    }
  }),
  adjustStyleLoaders(({ use: [, , postcss] }) => {
    const postcssOptions = postcss.options
    postcss.options = { postcssOptions }
  })
)

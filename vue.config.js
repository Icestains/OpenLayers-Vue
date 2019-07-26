const webpack = require("webpack");

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/OpenLayers-Vue//'
    : '/',
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ]
  }
}
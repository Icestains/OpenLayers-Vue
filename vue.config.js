const webpack = require("webpack");

module.exports = {
    // 打包是否加入map参与调试
    css: {
        sourceMap: false,
    },
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production'
        ? '/OpenLayers-Vue/'
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
const webpack = require("webpack");

module.exports = {
    // 打包是否加入map参与调试
    css: {
        sourceMap: false,
    },
    // outputDir: 'C:\\geobos_studio\\workspace\\OpenlayersVue',
    productionSourceMap: false,
    // publicPath: './',
    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : './',
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
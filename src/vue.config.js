module.exports = {
    publicPath: '/bcm-web-app/',
    devServer: {
        proxy: "http://localhost:1510/",
        compress: true,
        disableHostCheck: true,
    }
}
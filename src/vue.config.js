module.exports = {
    publicPath: '/bcm-web-app/',
    devServer: {
        proxy: "https://coffee-management-api.herokuapp.com"
    }
}
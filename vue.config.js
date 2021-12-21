const bootstrapSassAbstractsImports = require('vue-cli-plugin-bootstrap-vue/sassAbstractsImports.js')
module.exports = {
    css: {
        loaderOptions: {
            sass: {
                additionalData: bootstrapSassAbstractsImports.join('\n')
            },
            scss: {
                additionalData: [...bootstrapSassAbstractsImports, ''].join(';\n')
            }
        }
    },
    // ...other vue-cli plugin options...
    pwa: {
        name: 'Sardis Wallet',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
    }
}
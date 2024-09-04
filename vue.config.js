const { VueLoaderPlugin } = require('vue-loader');
module.exports = {
  //路径前缀
  publicPath: "/",
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.resolve.alias.set('vue$','vue/dist/vue.esm.js');
  },
  //开发模式反向代理配置，生产模式请使用Nginx部署并配置反向代理
  devServer: {
    port: 1888,
    proxy: {
      '/api': {
        //本地服务接口地址
        //target: 'http://localhost',
        //远程演示服务地址,可用于直接启动项目
        target: 'https://edc.starwrap.net/api',
        ws: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
};

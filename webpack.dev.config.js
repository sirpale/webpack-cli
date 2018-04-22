/**
 * @fileOverview 开发配置
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/3/30 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/3/30.
 */

let path = require('path'),
    fs = require('fs'),
    DOMAIN = 'http://192.168.0.24',
    PORT = 3002,
    CONFIG = require('./config'),
    webpack = require('webpack');


console.log('------开始编译-------');

let DEV = path.resolve(__dirname,'dev');

let plugins = CONFIG.plugins.concat([
    // 热替换
    new webpack.HotModuleReplacementPlugin()
]);

let config = {
    entry : CONFIG.getEntry(),
    output : {
        path : './dev',
        publicPath : DOMAIN+':' +PORT+'/',
        filename : 'js/[name].js'
    },
    module : {
        loaders : CONFIG.loader
        // postLoaders : [
        //     {
        //         test : /\.js$/,
        //         loaders : ['es3ify-loader']
        //     }
        // ]
    },
    plugins : plugins,
    // 后缀名和别名
    resolve : CONFIG.resolve,
    context: DEV,
    // webpack-dev-server
    devServer : {
        host : '0.0.0.0',
        port : PORT,
        contentBase : DEV,
        hot : true,
        inline : true,
        disableHostCheck: true,
        outputPath: DEV
    }
};

// 生成html
config  = CONFIG.getHtml(config);

// 生成雪碧图
config = CONFIG.getSprite(config,DEV);

// 复制库文件
config = CONFIG.getLib(config,DEV);


module.exports = config;


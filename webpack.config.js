/**
 * @fileOverview 生产配置
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/3/27 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/3/27.
 */
// require('es5-shim');
// require('es5-shim/es5-sham');
// require('console-polyfill');
const CONFIG = require('./config');

let path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    Es3ifyPlugin = require('es3ify-webpack-plugin');




let plugins = CONFIG.plugins.concat([

    // css压缩
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
            // discardComments: {
            //     removeAll: true
            // }
            discardComments : false
        },
        canPrint: true
    }),
    new Es3ifyPlugin()
    // js压缩
    // new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //         warnings: false
    //     },
    //     mangle : {
    //         // false true
    //         except : ['$super','$','exports','require','for']
    //     },
    //     beautify : true,
    //     comments : true
    //
    // })

]);


// process.traceDeprecation = true;
console.log('------开始编译------');
// console.log('================process======================');
// console.log(process.cwd());
// console.log('=============================================');
let DIST = path.resolve(__dirname,'dist');

let config = {
    // devtool: 'eval',
    entry: CONFIG.getEntry(DIST),
    debug : true,
    output: {
        path : DIST,
        publicPath: '../',
        filename: 'js/[name].js',
        chunkFilename: '[chunkhash].js'
    },
    module: {
        loaders: CONFIG.loader,
        // rules: [
        //     {
        //         test: /.js[x]$/,
        //         // post-loader处理
        //         enforce: 'post',
        //         loader: 'es3ify-loader'
        //     }
        // ],
        postLoaders : [
            {
                test : /\.js$/,
                loaders : ['es3ify-loader']
            }
        ]
    },
    plugins: plugins,
    resolve: CONFIG.resolve
};

// 生成html
config = CONFIG.getHtml(config,DIST);
// 生成雪碧图
config = CONFIG.getSprite(config,DIST);
// 复制库文件
config = CONFIG.getLib(config,DIST);


module.exports = config;
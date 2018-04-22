/**
 * @fileOverview 通用配置
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/3/29 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/3/29.
 */

let path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    chalk = require('chalk'),
    ProgressBarPlugin = require('progress-bar-webpack-plugin'),
    HtmlPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    SpritesmithPlugin = require('webpack-spritesmith'),
    Es3ifyPlugin = require('es3ify-webpack-plugin'),
    // transferWebpackPlugin = require('transfer-webpack-plugin');
    CopyPlugin = require('copy-webpack-plugin');


const SRC = path.resolve(__dirname, 'src');
const DEV = path.resolve(__dirname, 'dev');
const DIST = path.resolve(__dirname, 'dist');

module.exports = {
    src: SRC,
    getEntry(outPath) {
        let _this = this,
            jsPath = path.resolve(SRC, 'js'),
            dirs = fs.readdirSync(jsPath),
            matchs = [],
            files = {};

        console.log('js路径：'+jsPath);
        console.log('输出路径：' + outPath);

        dirs.forEach(item => {
            let dir = fs.statSync(jsPath + '/' + item);
            // if (dir.isDirectory() && item == 'core') {
            //     let itemDir = fs.readdirSync(jsPath + '/' + item);
            //     itemDir.forEach(items => {
            //         matchs = items.match(/(.+)\.js[x]?$/);
            //         if (matchs) files[matchs[1]] = path.resolve(SRC, 'js/' + item, items);
            //     });
            // } else {
            //     matchs = item.match(/(.+)\.js[x]?$/);
            //     if (matchs) files[matchs[1]] = path.resolve(SRC, 'js', item);
            // }
            if(dir.isDirectory() && item == 'lib') {
                let itemDir = fs.readdirSync(jsPath + '/' + item);

                itemDir.forEach(items => {
                    // console.log(items);
                    //
                    // _this.plugins.push(new copyPlugin([
                    //     {
                    //         from: items,
                    //         to: outPath + '/js/lib/' + items
                    //     }
                    // ], {
                    //     ignore: [],
                    //     copyUnmodified: true,
                    //     debug: "debug"
                    // }));

                    // items.forEach(itemss => {
                    //     let dir1 = fs.statSync(jsPath + '/' + itemDir + '/' + items);
                    //     if(dir1.isDirectory()) {
                    //         console.log(dir1);
                    //     }
                    // })

                    // var dir1 = fs.statSync(items);
                    // if(dir1.isDirectory()) {
                    //     console.log(dir1);
                    // }
                });
            }

            matchs = item.match(/(.+)\.js[x]?$/);
            if (matchs) files[matchs[1]] = path.resolve(SRC, jsPath, item);

        });
        console.log(files);
        return files;
    },
    // 库文件及html静态文件
    getLib (config,outPath) {

        let jsPath = path.resolve(SRC, 'js');

        config.plugins.push(new CopyPlugin([
            {
                from: jsPath + '/lib',
                to: outPath + '/js/lib'
            },
            {
                from: SRC + '/data',
                to: outPath + '/data'
            }
        ], {
            ignore: [],
            copyUnmodified: true,
            debug: "warning" // warning info debug
        }));


        return config;
    },
    // html遍历
    getHtml(config,outPath) {
        for (let chunkName in config.entry) {
            let es = fs.existsSync(SRC + '/app/' + chunkName + '.tpl.html');

            console.log('找到文件：'+chunkName);
            let conf = {
                title: chunkName,
                filename: outPath ? outPath +'/app/'+chunkName + '.html' : 'app/' + chunkName + '.html',
                template:  SRC + '/app/' + chunkName + '.tpl.html',
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: false
                },
                chunks: [chunkName],
                hash: false
            };
            // 判断文件是否存在
            console.log(es + '=============');
            if (es) config.plugins.push(new HtmlPlugin(conf));
        }

        return config;
    },
    // 雪碧图
    getSprite(config,outPath) {

        console.log("雪碧图输出："+outPath);

        let imgPath = outPath ? outPath +'/images/sprite.png': 'images/sprite.png',
            cssPath = outPath ? outPath + '/css/sprite.css' : 'css/sprite.css';

        config.plugins.push(
            new SpritesmithPlugin({
                src: {
                    cwd : SRC+'/images/ico',
                    glob : '*.png'
                },
                target: {
                    image : imgPath,
                    css : cssPath
                },
                apiOptions : {
                    cssImageRef : '../images/sprite.png'
                }
            })
        );

        return config;

    },
    // 公用模块
    commonArr: ['control', 'core'],
    // 编译所需模块
    loader: [
        // html
        {
            test: /\.html$/,
            include: SRC,
            loader: 'html-withimg-loader?min=false'
        },
        // js
        // {
        //     test : /\.js$/,
        //     exclude : /node_modules/,
        //     loader : 'es3ify-loader'
        // },
        {
            test: /\.js[x]?$/,
            loader: 'babel-loader',
            // exclude : /node_modules/,
            include: SRC,
            query: {
                presets: ['es2015','stage-0'],
                plugins : [
                    "transform-es3-property-literals",
                    "transform-es3-member-expression-literals"
                ]
            }
        },
        // css
        {
            test: /\.scss$/,
            include: SRC,
            // loader: ExtractTextPlugin.extract({
            //     fallback: 'style-loader',
            //     use: 'css-loader?!sass-loader!postcss-loader'
            // })
            loader : ExtractTextPlugin.extract('style-loader','css-loader!sass-loader')
        },

        // fonts
        {
            test: /\.(eot|woff|svg|ttf|woff2|appcache)(\?|$)/,
            include: SRC,
            loader: 'file-loader?name=fonts/[name].[ext]'
        },
        // images
        {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader?limit=1&name=images/[name].[ext]'
        }
    ],
    // postLoaders: [
    //     {
    //         test: /\.js$/,
    //         loaders: ['es3ify-loader'],
    //     },
    // ],
    // 别名
    resolve: {
        extensions: ['','.js', '.jsx', '.css', '.scss', '.less', '.sass']
        // alias: {
        //     jquery: SRC + '/js/lib/jquery.min.js',
        //     core: SRC + '/js/core',
        //     components: SRC + '/js/components',
        //     lib: SRC + '/js/lib'
        // }
    },
    // 插件
    plugins : [
        // new webpack.LoaderOptionsPlugin({
        //     options : {
        //         postcss : () => {
        //             return [
        //                 require('autoprefixer')({
        //                     browsers: [
        //                         'last 10 Chrome versions',
        //                         'last 5 Firefox versions',
        //                         'Safari >= 6',
        //                         'ie > 8'
        //                     ]
        //                 })]
        //         }
        //         // postLoaders : {
        //         //     test: /\.js$/,
        //         //     enforce: 'post',
        //         //     loader: 'es3ify-loader'
        //         // }
        //     }
        // }),
        // 进度条
        new ProgressBarPlugin({
            format : 'build [:bar]' +'(:msg)'+ chalk.green.bold(':percent') + ' (:elapsed seconds)',    //:bar :current :total :elapsed :percent :msg
            // width : 100,
            complete : '***',
            // incomplete : '',
            // renderThrottle : 16,
            clear : false,
            callback : function () {
                console.log('------编译完成！------');
            }
            // stream : 'stderr',
            // summary : true,
            // summaryContent : false,
            // customSummary : function () {
            //
            // }
        }),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery'
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename : 'js/common.js'
            // chunks : ['core','control','tools']
        }),
        new ExtractTextPlugin('css/style.css'),
        new Es3ifyPlugin()
        // new transferWebpackPlugin([
        //     { from: 'js/lib/layui',to : 'dev'}
        // ], path.join(__dirname, 'src'))


    ]
};
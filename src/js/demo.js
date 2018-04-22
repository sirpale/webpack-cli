/**
 * @fileOverview demo
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/12 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/6/12.
 */


import './core/core';
import './core/control';


$(function () {


    layui.use('laytpl', function () {
        var laytpl = layui.laytpl;

        // //使用方式跟独立组件完全一样
        // laytpl('{{ d.name }}是一位程序猿').render({
        //     name: '你'
        // }, function(string){
        //     console.log(string); //贤心是一位公猿
        // });


        var data = {
            "title": "Layui常用模块",
            "list": [
                {
                    "modname": "弹层",
                    "alias": "layer",
                    "site": "layer.layui.com"
                },
                {
                    "modname": "表单",
                    "alias": "form"
                }
            ]
        };
        var getTpl = $('#demo').html();
        laytpl(getTpl).render(data, function (html) {

            // console.log(data);
            $('#view').html(html);
        });
    });



    // $pagesA.Page({
    //     total: 123,
    //     pageSize: 10,
    //     callBack: function ($pageSize, $pageNum) {
    //         console.log($pageSize + '--' + $pageNum);
    //     }
    // });

    // $pages.each(function () {
    //
    //     var $that = $(this),
    //         $target = $('.' + $that.attr('data-target')),
    //         $json = $target.attr('data-json');
    //         // $pagesData = TOOLS.toJson($json);
    //
    //
    //     console.log($that.Page());
    //
    //     $that.Page({
    //         total: 123,
    //         pageSize: 10,
    //         callBack: function ($pageNum, $pageSize) {
    //             // $that.doAjax({
    //             //     url: $pagesData.act,
    //             //     data: {
    //             //         pageNum: $pageNum,
    //             //         pageSize: $pageSize
    //             //     },
    //             //     success: function ($data) {
    //             //         TOOLS.toTpl($target, $that.attr('data-target'), $data);
    //             //         // $target.html('').html($.tmpl($('script[data-target="' + $that.attr('data-target') + '"]').html(), $data.data));
    //             //     },
    //             //     complete: function () {
    //             //         TOOLS.gameImg();
    //             //         if ($('img.lazy').length > 0) $('img.lazy').lazyload();
    //             //         // var $img = $('img.animate');
    //             //         // $img.each(function () {
    //             //         var $that = $(this);
    //             //
    //             //         // $that.hover(function () {
    //             //         //     $that.addClass('animated pulse');
    //             //         // }, function () {
    //             //         //     $that.removeClass('animated pulse');
    //             //         // });
    //             //
    //             //         // });
    //             //     }
    //             // });
    //         }
    //     });
    //
    // });


    // $.sjui.doAjax('document',{
    //     url : 'http://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_key=%E7%BD%91%E7%BB%9C&bk_length=600',
    //     success : function ($data) {
    //         console.log($data);
    //     }
    // });


    // $(document).doAjax({
    //     type : 'GET',
    //     url : '../../data/test.json',
    //     success : function (data) {
    //         console.log(data);
    //     }
    // });

    // $(document).doAjax({
    //     url : '../../data/test.json',
    //     success : function ($data) {
    //         console.log(22222);
    //         console.log($data);
    //     }
    // });

    // $.ajax({
    //     url : '../../data/test.json',
    //     type : 'GET',
    //     dataType : 'json',
    //     success : function ($data) {
    //         console.log($data);
    //     }
    // })


    layui.use('element', function () {
        var $ = layui.jquery,
            element = layui.element(); //Tab的切换功能，切换事件监听等，需要依赖element模块

        //触发事件
        // var active = {
        //     tabAdd: function(){
        //         //新增一个Tab项
        //         element.tabAdd('demo', {
        //             title: '新选项'+ (Math.random()*1000|0) //用于演示
        //             ,content: '内容'+ (Math.random()*1000|0)
        //             ,id: new Date().getTime() //实际使用一般是规定好的id，这里以时间戳模拟下
        //         })
        //     }
        //     ,tabDelete: function(othis){
        //         //删除指定Tab项
        //         element.tabDelete('demo', '44'); //删除：“商品管理”
        //
        //
        //         othis.addClass('layui-btn-disabled');
        //     }
        //     ,tabChange: function(){
        //         //切换到指定Tab项
        //         element.tabChange('demo', '22'); //切换到：用户管理
        //     }
        // };
        //
        // $('.site-demo-active').on('click', function(){
        //     var othis = $(this), type = othis.data('type');
        //     active[type] ? active[type].call(this, othis) : '';
        // });

        //Hash地址的定位
        // var layid = location.hash.replace(/^\?link=/, '');
        // element.tabChange('link', layid);

        element.on('nav(demo)', function (elem) {
            var $that = $(this);
            // console.log($that.attr('data-index'));
            $('.content-' + $that.attr('data-index')).removeClass('layui-hide').siblings('.content-box').addClass('layui-hide');
            // location.search = 'mod=spacecp&ac='+ $(this).attr('data-ac');
        });


        // element.on('tab(link)',function(elem){
        //     console.log(elem);
        // });

    });
});
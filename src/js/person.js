/**
 * @fileOverview person 个人主页
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/5 DEAN. All Rights Reserved.
 * Created by sirpale on 2017/6/5.
 */


define(['./core/control'],function(){

    'use strict';

    layui.use('element', function(){
        var $ = layui.jquery
            ,element = layui.element(); //Tab的切换功能，切换事件监听等，需要依赖element模块

        //触发事件
        var active = {
            tabChange: function(){
                //切换到指定Tab项
                element.tabChange('demo', '22'); //切换到：用户管理
            }
        };
        $('.site-demo-active').on('click', function(){
            var othis = $(this), type = othis.data('type');
            active[type] ? active[type].call(this, othis) : '';
        });


    });

    // layui.use(['laypage', 'layer'], function(){
    //     var laypage = layui.laypage
    //         ,layer = layui.layer;
    //
    //     laypage({
    //         cont: 'demo1'
    //         ,pages: 100 //总页数
    //         ,groups: 5 //连续显示分页数
    //     });
    //
    //     //测试数据
    //     var data = [
    //         {"title":"2017年6月5日签到记录贴","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴2","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴3","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴4","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴5","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴6","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴7","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴8","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴9","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴10","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴11","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴12","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴13","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴14","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴15","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"},
    //         {"title":"2017年6月5日签到记录贴16","type":"贴图灌水","repeatNum":"109","repeatDownNum":"142","author":"xialei187941114","time":"2017-6-5 23:50"}
    //     ];
    //
    //     var nums = 5; //每页出现的数据量
    //
    //     //模拟渲染
    //     var render = function(data, curr){
    //         var arr = []
    //             ,thisData = data.concat().splice(curr*nums-nums, nums);
    //         layui.each(thisData, function(index, item){
    //             arr.push(
    //                 '<tr>' +
    //                 '<td>' +
    //                 '<a href="javascript:void(0);">'+
    //                 ''+ item["title"] +
    //                 '</a>'+
    //                 '</td>'+
    //                 '<td class="c-gray"><a href="javascript:void(0);">'+ item["type"] +'</a></td>'+
    //                 '<td class="two-num">'+
    //                 '<span class="c-369"><a href="javascript:void(0);">'+ item["repeatNum"] +'</a></span>'+
    //                 '<span class="c-gray"><a href="javascript:void(0);">'+ item["repeatDownNum"] +'</a></span>'+
    //                 '</td>'+
    //                 '<td class="two-num">'+
    //                 '<span class="c-369"><a href="javascript:void(0);">'+ item["author"] +'</a></span>'+
    //                 '<span class="c-gray"><a href="javascript:void(0);">'+ item["time"] +'</a></span>'+
    //                 '</td>'+
    //                 '</tr>'
    //
    //             );
    //         });
    //         return arr.join('');
    //     };
    //     //调用分页
    //     laypage({
    //         cont: 'demo8'
    //         ,pages: Math.ceil(data.length/nums) //得到总页数
    //         ,jump: function(obj){
    //             document.getElementById('biuuu_city_list').innerHTML = render(data, obj.curr);
    //         }
    //     });
    //
    // });

    //点击发帖
    layui.use('layer', function(){ //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句

        //触发事件
        var active = {
            offset: function(othis){
                var type = othis.data('type')
                    ,text = othis.text();
                layer.open({
                    type: 1
                    ,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                    ,id: 'LAY_demo'+type //防止重复弹出
                    ,title:"论坛导航"
                    ,content: $(".send-posting-box")
                    ,area: ['660px', '473px']
                    ,btnAlign: 'c' //按钮居中
                    ,shade: .3 //不显示遮罩
                    ,yes: function(){
                        layer.closeAll();
                    }
                });
            }
        };

        $('.site-demo-button .layui-btn').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });

    });
    //发帖弹窗
    layui.use('element', function(){
        var $ = layui.jquery
            ,element = layui.element(); //Tab的切换功能，切换事件监听等，需要依赖element模块

        $('.site-demo-active').on('click', function(){
            var othis = $(this), type = othis.data('type');
            active[type] ? active[type].call(this, othis) : '';
        });
        //监听导航点击
        element.on('nav(demo)', function(elem){
            var $that = $(this);
            // alert($that.attr("data-index"))
            $(".middle .set-content" + $that.attr("data-index")).removeClass("layui-hide").siblings().addClass("layui-hide");
            $(".right .content-box").addClass("layui-hide");
        });
        element.on('nav(demo1)', function(elem){
            var $that = $(this);
            // alert($that.attr("data-index"))
            $(".right .set-content" + $that.attr("data-index")).removeClass("layui-hide").siblings().addClass("layui-hide");
        });
        element.on('nav(demo2)', function(elem){
            var $that = $(this);
//            alert($that.attr("data-name"))
            if($that.attr("data-name")){
                $(".right").find("." + $that.attr("data-name")).removeClass("layui-hide").siblings().addClass("layui-hide");
            }else{
                $(".right .content-box").addClass("layui-hide");
            }
        });
    });



});


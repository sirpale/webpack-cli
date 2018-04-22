/**
 * @fileOverview 主控制
 * @author Sirpale
 * @version 1.0.0
 * @copyright Copyrigth  2017-02-17 DEAN. All Rights Reserved
 */

'use strict';

define([
    './core',
    '../components/common/wdiget',
    '../components/tool'
],function($core, $wdiget, $tool){
    var $control = {
        init : function () {
            this.gb();
        },
        gb : function () {
            var $this = this;

            // 检测登录
            $tool.init();

            // 二级导航功能
            this.nav();

            // 模板数据
            this.getTplData();

            // 分页
            this.getPageData();

            // 验证码
            this.yzmImg();

            // 搜索
            this.simpleSearch();

			//自定义下拉框
			this.selectDefine();

			//个人设置自动选择显示
            this.myChoice();

            //个人中心未认证显示隐藏
            this.activeEmail();

        },
        nav : function () {
            // 二级导航功能
            layui.use('element', function(){
                var element = layui.element(); //导航的hover效果、二级菜单等功能，需要依赖element模块

                // //监听导航点击
                // element.on('nav(demo)', function(elem){
                //     //console.log(elem)
                //     layer.msg(elem.text());
                // });
            });
        },

        //自定义下拉框
		selectDefine : function(){

			$(".selectDefine p").click(function(e) {
				$(this).next().show();
			}).mouseout(function() {
				var that=this;
				var timer = setTimeout(function() {
					$(that).next().hide();
				}, 200);
				$(this).next().mouseover(function() {
					clearTimeout(timer);
					$(this).show();
				}).mouseout(function() {
					$(this).hide();
				});
			});

			$(".selectDefine").on("click","dl dd",function(){
				$(this).parent().prev().attr("data-value",$(this).data("value"));
				$(this).parent().prev().html($(this).html());
				$(this).parent().hide();
			});

		},


        // 模板数据获取
        getTplData : function ($obj,$d) {
            var $this = this;
            layui.use('laytpl', function(){
                var laytpl = layui.laytpl,
                    $dataTpl = $('.data-tpl');

                if($obj) {
                    laytpl($obj.html()).render($d, function(html){
                        // console.log(html)
                        $('.'+$obj.data('target')).html('').html(html);
                    });
                } else {
                    $dataTpl.each(function(){
                        var $that = $(this),
                            $url = $that.data('url'),
                            $target = $that.data('target'),
                            $tpl = $that.html();

                        $that.doAjax({
                            url : $url,
                            success : function ($data) {
                                laytpl($tpl).render($data, function(html){
                                    // console.log(html)
                                    $('.'+$target).html('').html(html);
                                });
                            },
                            complete : function () {
                                // $this.nav();
                            }
                        });
                    });
                }

            });
        },
        // 分页
        getPageData : function () {
            var $this = this;
            // 分页-异步获取
            var $pagesA = $('.pages-a');

            $pagesA.each(function () {
                var $that = $(this),
                    $targetClass = $that.data('target'),
                    $target = $('.'+$targetClass),
                    $json = $target.data('json');

                // console.log($json);

                $that.Page({
                    total : $json.total,
                    pageSize : $json.pageSize,
                    callBack : function ($pageNum,$pageSize) {

                        $that.doAjax({
                            url: $json.act,
                            data: {
                                pageNum: $pageNum,
                                pageSize: $pageSize
                            },
                            success: function ($data) {
                                $this.getTplData($('.' + $targetClass + '-tpl'),$data);

                                // TOOLS.toTpl($target, $that.attr('data-target'), $data);
                                // $target.html('').html($.tmpl($('script[data-target="' + $that.attr('data-target') + '"]').html(), $data.data));
                            },
                            complete: function () {
                                // TOOLS.gameImg();
                                // if ($('img.lazy').length > 0) $('img.lazy').lazyload();
                                // var $img = $('img.animate');
                                // $img.each(function () {
                                var $that = $(this);

                                // $that.hover(function () {
                                //     $that.addClass('animated pulse');
                                // }, function () {
                                //     $that.removeClass('animated pulse');
                                // });

                                // });
                            }
                        });
                    }
                });

            });

            // 分页-静态获取
            var $pagesStatic = $('.page-static');
            $pagesStatic.each(function(){
                var $that = $(this),
                    $json = $that.data('json'),
                    $nextPage = $('.page-static-next');

                // console.log($json);


                $that.PageStatic({
                    total : $json.total,
                    pageSize : $json.pageSize,
                    pageNum : $json.pageNum,
                    url : $json.url,
                    num : $json.num,
                    callBack : function () {

                        if($nextPage.length > 0) {
                            $nextPage.attr('href',$that.find('.nxt').attr('href'));
                        }


                    }
                })
            });
        },
        // 验证码刷新
        yzmImg : function () {
            var $yzmImg = $('img.yzm-img');

            $yzmImg.each(function(){
                var $that = $(this),
                    $src = $(this).attr("src");

                $that.on('click',function(){
                    $that.attr('src',$src + '&v=' + parseInt(Math.random()*10000));
                });
            });
        },

        //搜索
        simpleSearch : function ()　{

            var $searchInput=$(".search").find("input");
            var $searchBtn=$(".search").find(".btn");
			var $Href=$searchBtn.attr('href');

            function task(){
                var $searchBtn=$(".search").find(".btn"),
                    $searchInput=$(".search").find("input"),
                    $href = $searchBtn.attr('href'),
                    $Rhref=$searchBtn.attr('data-href'),
                    $searchKey=$searchInput.val().trim();

                if(!$searchKey){
                    $searchBtn.attr("href",$Href);

                    $(document).keydown(function (e) {
                        var e = e||window.event;
                        if(e.keyCode==13){
                            window.location.href=$Href;
                        }
                    });

                }else{
                    $searchBtn.attr("href",$Rhref+"?key="+$searchKey);
                    $(document).keydown(function (e) {
                        var e = e||window.event;
                        if(e.keyCode==13){
                            window.location.href=$Rhref+"?key="+$searchKey;
                        }
                    });
                }
            }

            $searchInput.keyup(function(){
                task();
            })


        },
        //个人设置自动选择显示
        myChoice: function () {
            //个人中心
            var $choiceMod = getUrlParam("choiceMod"),
                $liNav = $(".layui-nav-tree li"),
                $navLiObj = $(".set-right > div");
            if ($choiceMod == "head") {
                $liNav.eq(0).addClass("layui-this").siblings().removeClass("layui-this");
                $navLiObj.eq(0).removeClass("layui-hide").siblings().addClass("layui-hide");
            }else if($choiceMod == "myInfo"){
                $liNav.eq(1).addClass("layui-this").siblings().removeClass("layui-this");
                $navLiObj.eq(1).removeClass("layui-hide").siblings().addClass("layui-hide");
            }else if($choiceMod == "group"){
                $liNav.eq(2).addClass("layui-this").siblings().removeClass("layui-this");
                $navLiObj.eq(2).removeClass("layui-hide").siblings().addClass("layui-hide");
            }else if($choiceMod == "mySafe"){
                $liNav.eq(3).addClass("layui-this").siblings().removeClass("layui-this");
                $navLiObj.eq(3).removeClass("layui-hide").siblings().addClass("layui-hide");
            }
            function getUrlParam(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }
        },
        activeEmail : function (){

        }


    };
    $control.init();

    return $control;

});








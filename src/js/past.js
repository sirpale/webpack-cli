/**
 * @fileOverview 发帖
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/3/29 DEAN. All Rights Reserved.
 * Created by Sirpale on 2017/3/29.
 */


define(['./core/control'],function(){
	
	layui.use(['layer'], function() {
		var $ = layui.jquery,
			layer = layui.layer;
	});
	
	//实例化ueditor编辑器
	var ue = UE.getEditor('editor',{zIndex:900});
	
	var $past={
		init:function(){
			//主题字数限制
			this.limit();
			
			//版块动态加载
			this.section();
			
			//发表帖子
			this.past();
			
			//编辑初始化
			this.editInit();
			
			//验证码切换
			this.yzmQH();
		},
		
		//验证码刷新
		yzmRe : function(obj){
			var $that = obj.find("img"),
				$v="",
				$src = obj.find("img").data("src");
				$v=$src.indexOf("?")==-1?'?v=':'&v=';
				$that.attr('src', $src + $v + parseInt(Math.random() * 10000));
		},
		
		//验证码点击切换
		yzmQH:function(){
			var that=this;
			$(".yzm").find("span").click(function(){
				that.yzmRe($(this));
			});
		},
		
		//主题字数限制
		limit: function(){
			$("input[name=title]").keyup(function() {
				limit($(this));
			});

			function limit(obj){
				var str = obj.val();
				var count = str.length;
				var length = 80 - count;
				if(length >= 0) {
					obj.parent().next().find("label").html("还可以输入<b>" + length + "</b>个字符");
				} else {
					length = 0 - length;
					obj.parent().next().find("label").html("您已经超出<b style='color: red;'>" + length + "</b>个字符");
				}
			}
		},
		
		//版块动态加载
		section:function(){
            $(".section1").on("click","dd",function () {
                var that = this;
                $(that).doAjax({
                    url: $(that).data('url'),
                    data: {section1: $(that).attr("data-value")},
                    success: function ($data) {
                        var addHtml = "";
                        for (var i = 0; i < $data.list.length; i++) {
                            addHtml += '<dd data-value="' + $data.list[i].id + '"  data-url="' + $data.list[i].url + '" >' + $data.list[i].name + '</dd>'
                        }
						
                        $(".section2").find("dl").html(addHtml);
                        $(".section2").removeClass("notclick");
                        $(".section2").find("p").html("请选择");
                        $(".section3").find("p").html("请选择");
                        $(".section3").addClass("notclick");
                        $(".section3").find("dl").html("");
                        $(".theme").find("p").html("请选择主题");
                        $(".theme").addClass("notclick");
                        $(".theme").find("dl").html("");
                    }

                });
            });
            
            $(".section2").on("click","dd",function () {
                var that = this;
                $(that).doAjax({
                    url: $(that).data('url'),
                    data: {section2: $(that).attr("data-value")},
                    success: function ($data) {
                        var addHtml = "";
                        for (var i = 0; i < $data.list.length; i++) {
                            addHtml += '<dd data-value="' + $data.list[i].id + '"  data-url="' + $data.list[i].url +'" >' + $data.list[i].name + '</dd>'
                        }

                        $(".section3").find("dl").html(addHtml);
                        $(".section3").removeClass("notclick");
                        $(".section3").find("p").html("请选择");
                        
                        var addHtml1 = "";
                        for (var i = 0; i < $data.theme.length; i++) {
                            addHtml1 += '<dd data-value="' + $data.theme[i].id + '" >' + $data.theme[i].name + '</dd>'
                        }

                        $(".theme").find("dl").html(addHtml1);
                        $(".theme").removeClass("notclick");
                        $(".theme").find("p").html("请选择主题");
                    }

                });
            });
            
            
            $(".section3").on("click","dd",function () {
                var that = this;
                $(that).doAjax({
                    url: $(that).data('url'),
                    data: {section3: $(that).attr("data-value")},
                    success: function ($data) {
                        var addHtml1 = "";
                        for (var i = 0; i < $data.theme.length; i++) {
                            addHtml1 += '<dd data-value="' + $data.theme[i].id + '" >' + $data.theme[i].name + '</dd>'
                        }

                        $(".theme").find("dl").html(addHtml1);
                        $(".theme").removeClass("notclick");
                        $(".theme").find("p").html("请选择主题");
                    }

                });
            });
            
            
            
		},
		
		//发表帖子
		past: function(){
			var obj=this;
			$("#sub").click(function(){
				var $that=$(this);
				var $section1=$(".section1").find("p").attr('data-value');
				var $section2=$(".section2").find("p").attr('data-value');
				var $section3=$(".section3").find("p").attr('data-value');
				var $theme=$(".theme").find("p").attr('data-value');
				var $title=$("input[name='title']").val();
				var $value = ue.getContent();
				var $length= ue.getContentLength(true);
				var $yzm=$(".yzm").find("input").val();
				var $yzmKey=$(".yzm").find("input").attr("data-key");
				
				
				if(!$section1&&!$section2){
					layer.msg("请先选择帖子版块", { icon: 5, shift: 6 });
					return false;
				}
				
//				if(!$theme){
//					layer.msg("请先选择帖子主题", { icon: 5, shift: 6 });
//					return false;
//				}
				var count = $title.length;
				if(count <= 0) {
					$("input[name='title']")[0].focus();
					layer.msg("您尚未输入帖子标题", { icon: 5, shift: 6 });
					return false;
				}
				if(count > 80 || count < 10) {
					$("input[name='title']")[0].focus();
					layer.msg("您发送的标题少于10个字符", { icon: 5, shift: 6 });
					return false;
				}

				if($length==0) {
					layer.msg("您尚未输入发送内容", { icon: 5, shift: 6 });
					return false;
				} 
				
				if($value.indexOf("<img")==-1){
					if($length>0&&$length<10){
						layer.msg("您发送的内容少于10个字符", { icon: 5, shift: 6 });
						return false;
					}
				}
				
				if(!$yzm){
					layer.msg("请输入验证码", { icon: 5, shift: 6 });
					return false;
				}
				
				$that.doAjax({
					url: $that.data('url'),
					data: {
						'pid' : $that.data("pid"),
						"section1" : $section1,
						"section2" : $section2,
						"section3" : $section3,
						"theme" : $theme,
						"title" :$title,
						"value" :$value,
						"yzm": $yzm,
						"yzmKey": $yzmKey
					},
					success: function ($data) {

						if($data.status == 'success') {
							layer.msg($data.msg,{ icon: 1 },function(){
								window.location.href=$data.url;
							});
							
						} else {
							layer.msg($data.msg,{ icon: 5, shift: 6 });
							$(".yzm").find("input").val("");
							obj.yzmRe($(".yzm").find("span"));
						}	
					}
				});

			});
		},
		
		//编辑初始化
		editInit : function(){
			//采用正则表达式获取地址栏参数
			function GetQueryString(name){
			     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
			     var r = window.location.search.substr(1).match(reg);
			     if(r!=null)return unescape(r[2]); return null;
			}
			var $href=location.href;
			if($href.indexOf("pid")!=-1){
				var $form=$(".pasting-box .layui-form");
				$form.doAjax({
					url:$form.attr("data-url"),
					data: {"pid":GetQueryString("pid")},
					success:function($data){
						if($data.status=="success"){
							if($data.section1Value){
								$(".section1").addClass("notclick");
								$(".section1").find("p").attr('data-value',$data.section1Value);
								$(".section1").find("p").html($data.section1Name);
								$(".section1").find("dl").html("");
							}
							if($data.section2Value){
								$(".section2").find("p").attr('data-value',$data.section2Value);
								$(".section2").find("p").html($data.section2Name);
							}
							if($data.section3Value){
								$(".section3").find("p").attr('data-value',$data.section3Value);
								$(".section3").find("p").html($data.section3Name);
							}
							if($data.themeValue){
								$(".theme").find("p").attr('data-value',$data.themeValue);
								$(".theme").find("p").html($data.themeName);
							}
							
							$("input[name='title']").val($data.title);
							var length = 80 - $data.title.length;
							$("input[name='title']").parent().next().find("label").html("还可以输入<b>" + length + "</b>个字符");
							
							ue.ready(function() {//编辑器初始化完成再赋值  
					            ue.setContent($data.editorValue);  //赋值给UEditor  
					        });
					        
					        $("#sub").attr("data-pid",$data.mid);
						}else{
							layui.use('layer', function(){
				                var layer = layui.layer;
								layer.msg($data.msg);
				           });
						} 
					}
				});
			}

		}
			
	}
	
	$past.init();
	

});
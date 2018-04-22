/**
 * @fileOverview person 消息中心
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/5 DEAN. All Rights Reserved.
 * Created by Sirpale on 2017/6/5.
 */

define(['./core/control'],function(){
	'use strict';
	layui.use(['layer', 'layedit', 'element','laytpl'], function () {
		var layedit = layui.layedit,
			element = layui.element(),    //导航的hover效果、二级菜单等功能，需要依赖element模块
			layer = layui.layer,
			laytpl= layui.laytpl;
		//监听导航点击
		element.on('nav(demo)', function (elem) {
			var $that = $(this);
			// alert($that.attr("data-index"))
			$(".set-content" + $that.attr("data-index")).removeClass("layui-hide").siblings().addClass("layui-hide");
		});


		//验证码刷新
		function yzmRe(obj){
			var $that = obj.find("img"),
				$v="",
				$src = obj.find("img").data("src");
				$v=$src.indexOf("?")==-1?'?v=':'&v=';
				$that.attr('src', $src + $v + parseInt(Math.random() * 10000));
		}
		
		//验证码点击切换
		$(".yzm").find("span").click(function(){
			yzmRe($(this));
		});
		
		var $replyMsgEditor=$(".reply-msg-editor"),
			$replyUname=$(".reply-msg-editor").find(".uname"),
			$replyUtime=$(".reply-msg-editor").find(".utime"),
			$replyMsg=$(".reply-msg-editor").find(".msg");
		
		//个人消息
		$('.set-content1').on("click", ".notice-person li .notice-status div", function () {
			var that = this;
			var uname=$(that).parent().prev().find("a").html();
			var uid=$(that).parent().prev().find("a").data("uid");
			var utime=$(that).parent().next().attr("data-utime");
			var rtime=$(that).parent().next().attr("data-rtime");
			var replyStatus=$(that).attr("data-replyStatus");
			var ue={};
			
			if(replyStatus==0){
				var index = layer.open({
					type: 1,
					title: '消息回复',
					area: ['700px', '540px'],
					id: "123", //防止重复弹出
					shade: 0.1,
					btn: ["回复", "取消"],
					content: $replyMsgEditor,
					yes: function (index, layero) {
						var $value = ue.getContent();
						var $length= ue.getContentLength(true);
						var $yzm=$(".yzm").find("input").val();
						var $yzmKey=$(".yzm").find("input").attr("data-key");

						if($length==0) {
							layer.msg("您尚未输入发送内容", { icon: 5, shift: 6 });
							return false;
						} 
						
						if($value.indexOf("<img")==-1){
							if($length>0&&$length<10){
								layer.msg("您发送内容的内容少于10个字节", { icon: 5, shift: 6 });
								return false;
							}
						}

						if(!$yzm){
							layer.msg("请输入验证码", { icon: 5, shift: 6 });
							return false;
						}
						
						$(that).doAjax({
							url: $(that).data('url'),
							data: {
								uid:uid,
								mid: $(that).data("mid"),
								editorVal: $value,
								yzm: $yzm,
								yzmKey: $yzmKey,
								replyStatus:"1"
							},
							success: function($data) {
								if($data.status=='success'){
									var $page=$(".notice-person").next().find('.pages').find(".current").html();
									$(that).doAjax({
										url:$(that).attr("list-url"),
										data:{
											page:$page
										},
										success:function($data){
											layer.close(index);
											laytpl($(".notice-person-tpl").html()).render($data, function(result){
			                                    $(".notice-person").html('').html(result);
			                                });
										}
									});
								}else{
									layer.msg($data.msg,{ icon: 5, shift: 6 });
									$(".yzm").find("input").val("");
									yzmRe($(".yzm").find("span"));
								}
							}
						});

					},
					btn2: function () {
						layer.closeAll();
					},
					success: function () {
						$replyUname.html(uname);
						$replyUtime.html(utime);
						$replyMsg.html($(that).html());
						$(".yzm").find("input").val("");
						
						//实例化ueditor编辑器
						ue = UE.getEditor('editor', {
							toolbars: [
								['fontfamily', 'fontsize', '|',
									'bold', 'italic', 'underline', 'fontborder', 'strikethrough', '|',
									'forecolor', 'backcolor','simpleupload', 'emotion','link', 'unlink','|',
									'insertorderedlist', 'insertunorderedlist', '|',
									'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'
								]
							]
						});
						
						if($(that).attr('data-checkStatus')!="1"){
							$(that).doAjax({
								url:$(that).attr("check-url"),
								data:{
									mid:$(that).data("mid")
								},
								success:function($data){
									if($data.status=='success'){
										var $page=$(".notice-person").next().find('.pages').find(".current").html();
										$(that).doAjax({
											url:$(that).attr("list-url"),
											data:{
												page:$page
											},
											success:function($data){
												laytpl($(".notice-person-tpl").html()).render($data, function(result){
				                                    $(".notice-person").html('').html(result);
				                                });
											}
										});
									}else{
										layer.msg($data.msg);
									}
								}
							});
						}
						
						
						
						
	
					}
				});
			}else{
				var index = layer.open({
					type: 1
					,
					title: '消息回复'
					,
					area: ['700px', '400px']
					,
					id: "123" //防止重复弹出
					,
					shade: 0.1
					,
					btn: ["确认"]
					,
					content: '<div style="padding:0 20px;"><label><span style="color: #1E9FFF;">'+uname+'</span> 在 '+utime+' 对您说：</label>'+
					'<p style="text-indent:2em; word-break:break-all;line-height:25px;">' + $(that).html()
					+ '</p><hr /><label>您在 '+rtime+' 回复 <span style="color: #1E9FFF;">'+uname+'</span>：<p style="text-indent:2em; word-break:break-all;line-height:25px;">'+ $(that).attr("data-rcontent")
					+'</p></label></div>'
					,
					yes: function (index) {
						layer.closeAll();
					}

				})
			}



		});

		//消息单个删除
		$('.set-content1').on("click", ".notice-person li .shield-per-delete a", function () {
			var that = this;
			var index = layer.confirm("确认删除该消息吗？", function (index) {
				var arryMid=[];
				arryMid.push($(that).data('mid'));
				$(that).doAjax({
					url: $(that).data('url'),
					data: {
						mid: arryMid
					},
					success: function ($data) {
						$(that).parent().parent().remove();
						if($data.status == 'success') {
							layer.msg($data.msg);
						} else {
							layer.msg($data.msg);
						}
					}
				});
			});
		});

		//消息批量删除
		$('.set-content1').on("click", ".select-notice-bottom .delete-all-btn", function () {
			var flag=false;
			$('.set-content1 ul li').find(".notice-middle").find("input").each(function(){
				if($(this).prop('checked')){
					flag=true;
				}
			});

			if(flag){
				var that = this;
				var index = layer.confirm("确认删除选中的消息吗？", function (index) {
					var arryMid=[];
					$(that).parent().parent().prev().find('li').each(function () {
						if ($(this).find(".notice-middle").find("input").prop('checked')) {
							arryMid.push($(this).data('mid'));
						}
					});

					$(that).doAjax({
						url: $(that).data('url'),
						data: {
							mid: arryMid,
						},
						success: function ($data) {
							if($data.status == 'success') {
								$(that).parent().parent().prev().find('li').each(function () {
									if ($(this).find(".notice-middle").find("input").prop('checked')) {
										$(this).remove();
									}
								});
								layer.close(index);
								layer.msg($data.msg);
							} else {
								layer.msg($data.msg);
							}

						}
					});

				});
			}else{
				layer.msg("请先选择需要删除的消息");
			}
		});


		//全选
		$('.set-content1').on("click", "#delete_all", function () {
			var flag = $(this).prop('checked');
			$(this).parent().parent().parent().prev().find('li').find(".notice-middle").find("input").prop('checked', flag);
		});



		//系统消息
		$('.set-content2').on("click", ".notice-system li .notice-status .check", function () {
			var that = this;
			var index = layer.open({
				type: 1
				, title: '消息查看'
				, area: ['700px', '500px']
				, id: "123" //防止重复弹出
				, shade: 0.3
				, btn: ["确定"]
				, content: '<div style="padding:0 20px;"><p style="height:30px;"></p>' + $(that).prev().html() + '</div>'
				, yes: function (index) {
					layer.close(index);
				}
				, success: function () {
					if($(that).prev().attr('data-checkStatus')!="1"){
						$(that).doAjax({
							url:$(that).attr("check-url"),
							data:{
								mid:$(that).data("mid")
							},
							success:function($data){
								if($data.status=='success'){
									var $page=$(".notice-system").next().find('.pages').find(".current").html();

									$(that).doAjax({
										url:$(that).attr("list-url"),
										data:{
											page:$page
										},
										success:function($data){
											laytpl($(".notice-system-tpl").html()).render($data, function(result){
			                                    $(".notice-system").html('').html(result);
			                                });
										}
									});
								}else{
									layer.msg($data.msg);
								}
							}
						});
					}
				}
			});
		});
		
		
		//系统消息单个删除
		$('.set-content2').on("click", ".notice-system li .shield-per-delete a", function () {
			var that = this;
			var index = layer.confirm("确认删除该消息吗？", function (index) {
				var arryMid=[];
				arryMid.push($(that).data('mid'));
				$(that).doAjax({
					url: $(that).data('url'),
					data: {
						mid: arryMid
					},
					success: function ($data) {
						$(that).parent().parent().remove();
						if($data.status == 'success') {
							layer.msg($data.msg);
						} else {
							layer.msg($data.msg);
						}
					}
				});
			});
		});
		


		//翻页是否显示
		if($(".notice-list").data("json").total<=0){
			$(".select-notice-bottom").hide();
		}else{
			$(".select-notice-bottom").show();
		}
		
	});
});


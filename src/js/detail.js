/**
 * @fileOverview detail 帖子详情
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/3/29 DEAN. All Rights Reserved.
 * Created by Sirpale on 2017/3/29.
 */



define([
    './core/control',
    './core/tools',
    './components/openwin'

],function($control, $tools, $openwin){
	'use strict';


	var $detail = {
		init: function() {

			// 发消息
			this.sendMsg();
			
			// 发帖子
			this.sendPast();

			// 编辑
			this.editPast();

			// 回复
			this.replyPast();
			
			// 举报
			this.reportPast();
			
			//框框效果
			this.textareaFocus();
			
			
			//回帖权限
			this.groupPast();
			
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
		
		
		//初始化编辑器
		initEdit : function($content){
			//实例化ueditor编辑器
			var ue1 = UE.getEditor('editor1', {
				toolbars: [
					['fontfamily', 'fontsize', '|',
						'bold', 'italic', 'underline', 'fontborder', 'strikethrough', '|',
						'forecolor', 'backcolor','simpleupload', 'emotion','link', 'unlink','|',
						'insertorderedlist', 'insertunorderedlist', '|',
						'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'
					]
				]
			});
			
			if($content){
				ue1.ready(function() {//编辑器初始化完成再赋值  
	            	ue1.setContent($content);  //赋值给UEditor  
	        	});
			}
			
			return ue1;
		},
		
		// 发消息
		sendMsg: function() {
			var obj=this;
			var ue1={};
			var $sendMsgEditor = $(".reply-editor");
			
			layui.use(['layer', 'layedit'], function() {
				var layedit = layui.layedit,
					layer = layui.layer;

				var $sendMsg = $('.send-msg');

				$sendMsg.each(function() {

					var $that = $(this),
						$name = $that.data('name');

					$that.on('click', function() {
						var that=this;
						layer.open({
							type: 1,
							title: '正在给 <b>' + $name + '</b> 发消息中...',
							area: ['740px', '500px'],
							shade: 0.1,
							id: "123",
							content: $sendMsgEditor,
							btn: ['发送', "取消"],
							yes: function(index, layero) {
								var $value = ue1.getContent();
								var $length= ue1.getContentLength(true);
								var $yzm=$(".reply-editor").find(".yzm").find("input").val();
								var $yzmKey=$(".reply-editor").find(".yzm").find("input").attr("data-key");

								if($length==0) {
									layer.msg("您尚未输入发送内容", { icon: 5, shift: 6 });
									return false;
								}
								if($value.indexOf("<img")==-1){
				                	if($length > 0 && $length < 10) {
										layer.msg("你发送的内容少于10个字符", { icon: 5, shift: 6 });
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
										mid: $(that).data("mid"),
										uid: $(that).data("uid"),
										editorVal: $value,
										yzm: $yzm,
										yzmKey : $yzmKey
									},
									success: function($data) {
										if($data.status == 'success') {
											layer.close(index);
											layer.msg($data.msg);
										} else {
											layer.msg($data.msg);
											$(".reply-editor").find(".yzm").find("input").val("");
											obj.yzmRe($(".reply-editor").find(".yzm").find("span"));
										}
									}
								});
							},
							btn2: function() {
								layer.closeAll();
								ue1.destroy();
							},
							cancel:function(){
								ue1.destroy();
							},
							success: function() {
								ue1 = UE.getEditor('editor1', {
									toolbars: [
										['fontfamily', 'fontsize', '|',
											'bold', 'italic', 'underline', 'fontborder', 'strikethrough', '|',
											'forecolor', 'backcolor','simpleupload', 'emotion','link', 'unlink','|',
											'insertorderedlist', 'insertunorderedlist', '|',
											'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'
										]
									]
								});
								ue1.ready(function() {//编辑器初始化完成再赋值  
					            	ue1.setContent("");  //赋值给UEditor  
					        	});
								$(".reply-editor").find(".reply-content").hide();
								$(".reply-editor").find(".reply-title").hide();
								$(".reply-editor").find(".yzm").find("input").val("");
							}
						});
					});

				});

			});
		},
		
		// 帖子编辑
		editPast: function() {
			var obj=this;
			var ue1={};
			var $edit = $('.info-seven .edit');
			var $replyEditor = $(".reply-editor");
			var $title = $(".reply-editor").find(".title");
			
			$edit.each(function() {
				$(this).click(function() {
					var that = this;
					var index = layer.open({
						type: 1,
						title: '编辑帖子',
						area: ['740px', '560px'],
						id: "123", //防止重复弹出
						shade: 0.1,
						btn: ["保存", "取消"],
						content: $replyEditor,
						yes: function(index, layero) {
							var $value = ue1.getContent();
							var $length= ue1.getContentLength(true);
							var $yzm=$(".reply-editor").find(".yzm").find("input").val();
							var $yzmKey=$(".reply-editor").find(".yzm").find("input").attr("data-key");
							if($length==0) {
								layer.msg("帖子不能为空", { icon: 5, shift: 6 });
								return false;
							}
							if($value.indexOf("<img")==-1){
			                	if($length > 0 && $length < 10) {
									layer.msg("你发送的内容少于10个字符", { icon: 5, shift: 6 });
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
										mid: $(that).data("mid"),
										editorVal: $value,
										yzm: $yzm,
										yzmKey: $yzmKey
									},
									success: function($data) {
										if($data.status == 'success') {
											layer.close(index);											
											layer.msg($data.msg,function(){
												location.reload();
											});
										} else {
											layer.msg($data.msg);
											$(".reply-editor").find(".yzm").find("input").val("");
											obj.yzmRe($(".reply-editor").find(".yzm").find("span"));
										}
									}
								});
							
						},
						btn2: function() {
							layer.closeAll();
							ue1.destroy();
						},
						cancel:function(){
							ue1.destroy();
						},
						success: function() {
							ue1 = UE.getEditor('editor1', {
								toolbars: [
									['fontfamily', 'fontsize', '|',
										'bold', 'italic', 'underline', 'fontborder', 'strikethrough', '|',
										'forecolor', 'backcolor','simpleupload', 'emotion','link', 'unlink','|',
										'insertorderedlist', 'insertunorderedlist', '|',
										'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'
									]
								]
							});
							
							ue1.ready(function() {//编辑器初始化完成再赋值  
				            	ue1.setContent($(that).data("content"));  //赋值给UEditor  
				        	});
							
							$title.html($(that).data('title'));
							$(".reply-editor").find(".reply-title").show();
							$(".reply-editor").find(".reply-content").hide();
							$(".reply-editor").find(".yzm").find("input").val("");
						}
					});
				});
			});
			
		},

		//帖子回复
		replyPast: function() {
			var ue1={};
			var obj=this;
			var $reply = $('.info-seven .ico-bg-1');
			var $replyEditor = $(".reply-editor");
			var $title = $(".reply-editor").find(".title");
			
			$reply.each(function() {
				$(this).click(function() {
					var that = this;
					var $uname= $(this).data('name');
					var $utime= $(this).data('time');
					var $ucontent = $(this).data('content');
					var index = layer.open({
						type: 1,
						title: '参与回复',
						area: ['740px', '580px'],
						id: "123", //防止重复弹出
						shade: 0.1,
						btn: ["回复", "取消"],
						content: $replyEditor,
						yes: function(index, layero) {
							var $value = ue1.getContent();
							var $length= ue1.getContentLength(true);
							var $yzm=$(".reply-editor").find(".yzm").find("input").val();
							var $yzmKey=$(".reply-editor").find(".yzm").find("input").attr("data-key");
							if($length==0) {
								layer.msg("您尚未输入发送内容", { icon: 5, shift: 6 });
								return false;
							}
							if($value.indexOf("<img")==-1){
			                	if($length > 0 && $length < 10) {
									layer.msg("你发送的内容少于10个字符", { icon: 5, shift: 6 });
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
									mid: $(that).data("mid"),
									editorVal: $value,
									yzm: $yzm,
									yzmKey: $yzmKey
								},
								success: function($data) {
									if($data.status == 'success') {
										layer.close(index);											
										layer.msg($data.msg,function(){
											location.reload();
										});
									} else {
										layer.msg($data.msg);
										$(".reply-editor").find(".yzm").find("input").val("");
										obj.yzmRe($(".reply-editor").find(".yzm").find("span"));
									}
								}
							});
						},
						btn2: function() {
							layer.closeAll();
							ue1.destroy();
						},
						cancel:function(){
							ue1.destroy();
						},
						success: function() {
							$title.html($(that).data('title'));
							$(".reply-editor").find(".reply-title").show();
							$(".reply-editor").find(".reply-content").show();
							$(".reply-editor").find(".uname").html($uname);
							$(".reply-editor").find(".utime").html($utime);
							$(".reply-editor").find(".ucontent").html($ucontent);
							ue1 = UE.getEditor('editor1', {
								toolbars: [
									['fontfamily', 'fontsize', '|',
										'bold', 'italic', 'underline', 'fontborder', 'strikethrough', '|',
										'forecolor', 'backcolor','simpleupload', 'emotion','link', 'unlink','|',
										'insertorderedlist', 'insertunorderedlist', '|',
										'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'
									]
								]
							});
							ue1.ready(function() {//编辑器初始化完成再赋值  
				            	ue1.setContent("");  //赋值给UEditor  
				        	});
							$(".reply-editor").find(".yzm").find("input").val("");
						}
					});
				});
			});
		},
		
		
		//帖子举报
		reportPast: function() {
		
			var $report = $('.info-seven .f-tar').find("a");
			var $replyEditor = $(".report-editor");
			var $reportContent= $replyEditor.find("textarea[name=report-content]");
			$report.each(function() {
				$(this).click(function() {
					var that = this;
					
					var index = layer.open({
						type: 1,
						title: "举报",
						area: ['440px'],
						id: "123", //防止重复弹出
						shade: 0.1,
						btn: ["确定", "取消"],
						content: $replyEditor,
						yes: function(index, layero) {
							var $value= $reportContent.val();
							var reType = "";
							$(".report-editor ul li label input").each(function() {
								if($(this).prop("checked")) {
									reType = $(this).val();
								}
							});
							if(!reType){
								layer.msg("请选择举报理由");
								return false;
							}
							
							if(reType=="5"&&(!$value||$value=="请填写其他原因")){
								layer.msg("请填写其他举报原因");
								return false;
							}
							
							if(!$value||$value=="请填写其他原因"){
								$value="";
							}
							
							$(that).doAjax({
								url: $(that).data('url'),
								data: {
									mid: $(that).data("mid"),
									reType: reType,
									editorVal: $value
								},
								success: function($data) {
									if($data.status == 'success') {
										layer.close(index);
										layer.msg($data.msg);
									} else {
										layer.msg($data.msg);
									}
								}
							});
						},
						btn2: function() {
							layer.closeAll();
						},
						success: function() {
							$reportContent.val("");
							$(".report-editor ul li label input").prop("checked",false);
						}
					});
				});
			});
		},
		
		// 发帖子
		sendPast: function() {
			//实例化ueditor编辑器
			var ue = UE.getEditor('editor', {zIndex:900});
			var obj=this;
			//发表帖子
			$('.layui-btn-small').click(function() {
				var that=this;
				var $value = ue.getContent();
				var $length= ue.getContentLength(true);
				var $yzm=$(that).prev().find("input").val();
				var $yzmKey=$(that).prev().find("input").attr("data-key");
				
				if($length==0) {
					layer.msg("您尚未输入发送内容", { icon: 5, shift: 6 });
					return false;
				}
				if($value.indexOf("<img")==-1){
                	if($length > 0 && $length < 10) {
						layer.msg("你发送的内容少于10个字符", { icon: 5, shift: 6 });
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
						mid:$(that).data("mid"),
						editorVal: $value,
						yzm: $yzm,
						yzmKey: $yzmKey
					},
					success: function($data) {
						if($data.status == 'success') {
							layer.msg($data.msg,function(){
								location.reload();
							});
						} else {
							layer.msg($data.msg);
							$(that).prev().find("input").val("");
							obj.yzmRe($(that).prev().find("span"));
						}
					}
				})

			});
		},
		
		//框框效果
		textareaFocus : function(){
			$(".report-editor").find("textarea[name=report-content]").focus(function() {
				$(this).css("color", "#000");
				if($(this).val() == "请填写其他原因") {
					$(this).val("");
					$(".report-editor").find("textarea[name=report-content]").blur(function() {
						if(!$(this).val()) {
							$(this).val("请填写其他原因");
							$(this).css("color", "#ccc");
						} else {
							$(".report-editor").find("textarea[name=report-content]").val($(this).val());
						}
					});
				}
			});
		},

		//回帖权限
		groupPast: function() {
			$(document).ajaxStop(function() {
				var $logFlag = $('.login-flag').val(),
                    $bindingFlag = $('.third-binding-flag').val(),
					$logUid = $('.login-uid').val(),
					$reply=$("#reply"),
					$aBtn=$("a.layui-btn-normal"),
					$aOpt=$("ul.detail-user-opt"),
					$ifSeven=$("div.info-seven"),
					$edit= $("div.info-seven").find(".ico-bg-7");   
					
					
				if($logFlag == "1") {

                    if($bindingFlag == "1") { //绑定
                        $aBtn.each(function() {
                            var $href = $(this).data("href");
                            $(this).attr("href", $href);
                        });

                        $aOpt.each(function() {
                            $(this).removeClass("hide");
                        });

                        $ifSeven.each(function() {
                            $(this).removeClass("hide");
                        });

                        $edit.each(function(){
                            $(this).hide();
                            if($(this).data("uid")==$logUid){
                                $(this).show();
                            }
                        });

                        $reply.find(".pt").hide();
                        $reply.find(".pe").show();
                        $reply.find(".pls img").show();
                        $reply.find(".for-binding").hide();
                    }else{	//未绑定
                        $aBtn.each(function() {
                            var $href = $(this).attr("binding-href");
                            $(this).attr("href", $href);
                        });

                        $aOpt.each(function() {
                            $(this).addClass("hide");
                        });

                        $ifSeven.each(function() {
                            $(this).addClass("hide");
                        });

                        $reply.find(".pe").hide();
                        $reply.find(".pt").hide();
                        $reply.find(".pls img").hide();
                        $reply.find(".for-binding").show();
                    }


				} else {
					$aBtn.each(function() {
						var $href = $(this).attr("login-href");
						$(this).attr("href", $href);
					});

					$aOpt.each(function() {
						$(this).addClass("hide");
					});

					$ifSeven.each(function() {
						$(this).addClass("hide");
					});

					$reply.find(".pe").hide();
					$reply.find(".pt").show();
					$reply.find(".pls img").hide();
                    $reply.find(".for-binding").hide();
				}

			});
		}
		

	};

	$detail.init();
    //第三方登录
    $openwin.init($(".third-to-login"));
    // //第三方登录
    // $(".third-to-login a.detail-third-login").on('click',function(){
    //     var $url = $(this).data("url");
    //     window.open(
    //         $url,
    //         'newwindow'
    //         'height=800, width=660, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no'
    //     );
    // });
});

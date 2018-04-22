/**
 * @fileOverview person
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/5 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/6/5.
 */

define([
	'./core/control',
    './core/tools',
    './components/openwin'

],function($control, $tools, $openwin){

	'use strict';

	var userToLogin = {
		init : function(){
			this.login();
		},
		login : function(){
			var $userLoginUrl = $(".yx-login-form"),
				$userLoginBtn = $(".user-login-sub-btn2"),
				$userName = $(".yx-check-username"),
				$userNameVal = $(".yx-check-username").val(),
				$userPwd = $(".yx-check-password"),
				$userPwdVal = $(".yx-check-password").val(),
				$yzmVal = $(".yx-check-yzm").val(),
				$errorTips = $(".login-error-tips"),
				$useFlag = false,
				$usePwd = false;


            //第三方登录
            $openwin.init($(".third-to-login"));


			$userName.blur(function(){
				$userNameVal = $(".yx-check-username").val();
				if($userNameVal == ""){
					$errorTips.find("span").html("请输入用户名和密码！").css("color","red");
					$errorTips.find("img").show();
				}else{
					$errorTips.find("span").html("");
					$errorTips.find("img").hide();
					$useFlag = true;
				}


			});

			$userPwd.blur(function(){
                $userPwd = $(".yx-check-password").val();
				if($userPwd == ""){
					$errorTips.find("span").html("请输入用户名和密码！").css("color","red");
					$errorTips.find("img").show();
				}else{
					$errorTips.find("span").html("");
					$errorTips.find("img").hide();
					$usePwd = true;
				}

			});
            // 验证码刷新
            var $yzmImg = $('.yx-login-form .yzm-img'),
                $src = $yzmImg.attr('src');

			$userLoginBtn.on('click',function(){
				var $that = $(this),
					$yzmVal = $(".yx-check-yzm").val(),
               		$yzmKey = $(".yzm-login-key").data("key");


				if($useFlag == true && $usePwd == true){
					if($yzmVal == ""){
						$errorTips.find("span").html("请输入验证码！").css("color","red");
						$errorTips.find("img").show();
                        $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));
					}else{
						$errorTips.find("span").html("");
						$errorTips.find("img").hide();
						$that.doAjax({
							url : $userLoginUrl.data("url"),
							data : {
								username : $userNameVal,
								pwd : $userPwd,
								yzm : $yzmVal,
								yzmKey : $yzmKey,
                                IP : returnCitySN['cip']
							},
							success : function($data){
								if($data.status == "success"){
									layui.use('layer',function(){
										var layer = layui.layer;
										layer.alert($data.msg);
										$(".layui-layer-btn0").on("click",function(){
											window.location.href = FRONT_APP_BASE;
										});
									});
								}else{
									layui.use('layer',function(){
										//var layer = layui.layer;
                                        $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));

										$errorTips.find("span").html($data.msg).css("color","red");
										$errorTips.find("img").show();
									});
								}
							}
						});
					}					
				}else{
					$errorTips.find("span").html("请输入用户名和密码！").css("color","red");
					$errorTips.find("img").show();
				}
			});
		}

	};

	userToLogin.init();

});

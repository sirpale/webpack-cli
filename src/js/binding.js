/**
 * @fileOverview person
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/5 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/6/5.
 */
import './core/control';

$(function(){

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
				$userEmail = $(".yx-check-email"),
				$userEmailVal = $(".yx-check-email").val(),
				$yzm = $(".yx-binding-yzm"),
				$errorTips = $(".binding-error-tips"),
				$userNameFlag = false,
				$userPwdFlag = false,
				$userEmailFlag = false;
			
			
			
			$userName.blur(function(){
				var patrn=/^([\u4E00-\u9FA5]|[a-zA-Z]|([a-zA-Z0-9]|[_])){4,20}$/;
				$userNameVal = $(".yx-check-username").val();			
				
				$userNameVal = $userNameVal.replace(/\s/ig,'');
				if($userNameVal == "" || !patrn.exec($userNameVal)){
                    $userName.parent().parent().find(".layui-word-aux span").html("用户名由4~20数字、字母或特殊符号组成！").css("color","red");
                    $userName.parent().parent().find(".layui-word-aux img").show();
				}else{
                    $userName.parent().parent().find(".layui-word-aux span").html("用户名格式正确！").css("color","green");
                    $userName.parent().parent().find(".layui-word-aux img").hide();
					$userNameFlag = true;
				}
				
				
			});	
				
			$userPwd.blur(function(){
				var patrn=/^(\w){6,20}$/;
				$userPwdVal = $(".yx-check-password").val();
				
				if($userPwdVal == "" || !patrn.exec($userPwdVal)){
                    $userPwd.parent().parent().find(".layui-word-aux span").html("密码由6~20数字、字母或特殊符号组成！").css("color","red");
                    $userPwd.parent().parent().find(".layui-word-aux img").show();
				}else{
                    $userPwd.parent().parent().find(".layui-word-aux span").html("密码可用！").css("color","green");
                    $userPwd.parent().parent().find(".layui-word-aux img").hide();
					$userPwdFlag = true;
				}
				
				
			});
            // 验证码刷新
            var $yzmImg = $('.yzm-binding-key'),
                $src = $yzmImg.attr('src'),
                $reYzm = $(".yx-binding-yzm");
			$userEmail.blur(function(){
				var $that = $(this),
					patrn  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})$/,
					$str = $that.val();
					if($str == "" || !patrn.exec($str)){
                        $userEmail.parent().parent().find(".layui-word-aux span").html("邮箱格式不正确！").css("color","red");
                        $userEmail.parent().parent().find(".layui-word-aux img").show();
						$userEmailFlag = false;
					}else{
                        $userEmail.parent().parent().find(".layui-word-aux span").html("邮箱格式正确！").css("color","green");
                        $userEmail.parent().parent().find(".layui-word-aux img").hide();
						$userEmailVal = $str
						$userEmailFlag = true;
						$userEmailVal = $str;
					
					}
			});
			
			$userLoginBtn.on('click',function(){				
				var $that = $(this),
                	$yzmKey = $(".yzm-binding-key").data("key"),
                    $yzmVal = $(".yx-binding-yzm").val();
				if($userNameFlag == true && $userPwdFlag == true && $userEmailFlag == true){
					$that.doAjax({
						url : $userLoginUrl.data("url"),
						data : {
							userName : $userNameVal,
							usePwd : $userNameVal,
							email : $userEmailVal,
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
										window.location.href=FRONT_APP_BASE;
									});
								});
							}else{
								layui.use('layer',function(){
									var layer = layui.layer;
                                    $errorTips.find("span").html($data.msg).css("color","red");
                                    $errorTips.find("img").show();
                                    $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));
                                    $reYzm.val("");
                                    $reYzm.focus();
                                });
							}
						}
					});
				}else{
					if($userNameFlag == false){
                        $userName.parent().parent().find(".layui-word-aux span").html("用户名由4~20数字、字母或特殊符号组成！").css("color","red");
                        $userName.parent().parent().find(".layui-word-aux img").show();
					}
					if($userPwdFlag == false){
                        $userPwd.parent().parent().find(".layui-word-aux span").html("密码由6~20数字、字母或特殊符号组成！").css("color","red");
                        $userPwd.parent().parent().find(".layui-word-aux img").show();
					}
					if($userEmailFlag == false){
                        $userEmail.parent().parent().find(".layui-word-aux span").html("邮箱格式不正确！").css("color","red");
                        $userEmail.parent().parent().find(".layui-word-aux img").show();
					}
					
				}
			});
		}

		
	};
	
	userToLogin.init();

});
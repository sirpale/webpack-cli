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

	 var $pasStr="", //密码
		$rePasStr="", //重复密码
		$userRegForm = $(".yx-reg-form"),
		$userName = $(".yx-check-username"),
		$userNameVal = $(".yx-check-username").val(),
		$userPwd = $(".yx-check-password"),
		$userPwdVal = $(".yx-check-password").val(),
		$userRePwd = $(".yx-check-repassword"),
		$email = $(".yx-check-emial"),
		$emailVal = $(".yx-check-emial").val(),
		$yzm = $(".yx-check-yzm"),
		$yzmVal = $(".yx-check-yzm").val(),
		$allFlag = false,
		$userFlag = false,
		$pwdFlag = false,
		$rePwdFlag = false,
		$yzmFlag = false,
		$emailFlag = false;


    //第三方登录
    $openwin.init($(".third-to-login"));
    //验证
    var $yxCheck = {
        init: function () {
            this.checkUsername();
            this.checkPassword();
            this.checkEmail();
        },
        // 用户名验证
        checkUsername: function ($str) {
            var patrn=/^([\u4E00-\u9FA5]|[a-zA-Z]|([a-zA-Z0-9]|[_])){4,20}$/;
            if (!patrn.exec($str)) return false
            return true
        },


        //密码验证
        checkPassword: function ($str) {
            var patrn=/^(\w){6,20}$/;
            if (!patrn.exec($str)) return false
            $pasStr  = $str;
            return true
        },

        //邮箱验证
        checkEmail: function ($str) {
            var patrn  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})$/;
            if (!patrn.exec($str)) return false;
            return true
        },



        //错误提示
        okTips :function($obj){
            $obj.parent().parent().find(".yx-error-tips").find("img").hide().css("color","#737272");
        },
        errorTips :function($obj){
            $obj.parent().parent().find(".yx-error-tips").find("img").show().css("color","red");
        },
    };
    $yxCheck.init();
    
	

	$userName.blur(function(){
        var $str = $(this).val();
        var $that = $(this);    
		$str = $str.replace(/\s/ig,'');
		if($yxCheck.checkUsername($str)){
			$that.doAjax({
				url :　$that.data("url"),
				data : {
					userName : $str
				},
				success : function($data){
					if($data.status == "success"){
						$yxCheck.okTips($that);
						$that.parent().parent().find(".yx-error-tips span").html($data.msg).css("color","green");
						$that.parent().parent().find(".yx-error-tips").find("img").hide();
						$userFlag = true;
						$userNameVal = $str;
					}else{
						$that.parent().parent().find(".yx-error-tips span").html($data.msg).css("color","red");
						$yxCheck.errorTips($that);
					}
				}
			});		
			
		}else{
			$that.parent().parent().find(".yx-error-tips span").html("4~20数字、字母或下划线组成！").css("color","red");
			$yxCheck.errorTips($that);
		}
    });
    //密码
	$userPwd.blur(function(){
        var $str  = $(this).val();
        var $that = $(this);
		if($rePasStr != ""){
			if($rePasStr == $str){
				$userRePwd.parent().parent().find(".yx-error-tips span").html("重复密码正确！").css("color","green");
				$userRePwd.parent().parent().find(".yx-error-tips").find("img").hide()
				$rePwdFlag = true;
			}else{
				$userRePwd.parent().parent().find(".yx-error-tips span").html("两次输入的密码不正确！").css("color","red");
				$userRePwd.parent().parent().find(".yx-error-tips").find("img").show().css("color","red");				
				$rePwdFlag = false;
			}
		}	
        if($yxCheck.checkPassword($str)){			
			$that.parent().parent().find(".yx-error-tips span").html("密码可使用！").css("color","green");
            $yxCheck.okTips($that);
			$pwdFlag = true;
        }else{
			$that.parent().parent().find(".yx-error-tips span").html("6~20数字、字母或特殊符号组成！").css("color","red");
			$that.parent().parent().find(".yx-error-tips").find("img").show().css("color","red");
            $yxCheck.errorTips($that);			
			$pwdFlag = false;
        }
		$pasStr = $str;
		$userPwdVal = $str
    });
    //确认密码
	$userRePwd.blur(function(){
        var $that = $(this);
        var $str = $(this).val();
        if($pasStr != $str || $str == ""){
            $yxCheck.errorTips($that);
			$that.parent().parent().find(".yx-error-tips span").html("两次输入的密码不一致！").css("color","red");
			$that.parent().parent().find(".yx-error-tips").find("img").show().css("color","red");
			$rePwdFlag = false;
        }else{
			$that.parent().parent().find(".yx-error-tips span").html("重复密码正确！").css("color","green");		
			
            $yxCheck.okTips($that);
			$rePwdFlag = true;
        }
		$rePasStr = $str;
    });
    //邮箱验证
    $email.blur(function(){
        var $that = $(this);
        var $str = $(this).val();
        if($yxCheck.checkEmail($str)){
			$that.parent().parent().find(".yx-error-tips span").html("邮箱可以使用！").css("color","green");
            $yxCheck.okTips($that);
			$emailFlag = true;
			$emailVal = $str;
        }else{
            $yxCheck.errorTips($that);
			$that.parent().parent().find(".yx-error-tips span").html("请输入正确的邮箱！").css("color","red");
			$that.parent().parent().find(".yx-error-tips img").show();
			$emailFlag = false;
        }
    });
	//验证码
	$yzm.blur(function(){
        var $str = $(this).val();
		if($str == ""){
			$yzmFlag = false;
		}else{
			$yzmFlag = true;
			$yzm.parent().parent().find(".yx-error-tips span").html("&nbsp;");
			$yzm.parent().parent().find(".yx-error-tips img").hide();
		}
		$yzmVal = $str;
	});
    // 验证码刷新
    var $yzmImg = $('.yx-reg-form .yzm-img'),
        $src = $yzmImg.attr('src');

	$(".reg-sub-btn").click(function(){
		var $yzmKey = $(".yzm-reg-key").data("key");


		if($userFlag == false){
			$userName.parent().parent().find(".yx-error-tips span").html("4~20数字、字母或下划线组成！").css("color","red");
			$userName.parent().parent().find(".yx-error-tips img").show();
		}
		if($pwdFlag == false){
			$userPwd.parent().parent().find(".yx-error-tips span").html("6~20数字、字母或特殊符号组成！").css("color","red");
			$userPwd.parent().parent().find(".yx-error-tips img").show();
		}
		if($rePwdFlag == false){
			$userRePwd.parent().parent().find(".yx-error-tips span").html("两次输入的密码不一致！").css("color","red");
			$userRePwd.parent().parent().find(".yx-error-tips img").show();
		}
		if($emailFlag == false){
			$email.parent().parent().find(".yx-error-tips span").html("请输入正确的邮箱！").css("color","red");
			$email.parent().parent().find(".yx-error-tips img").show();
		}
		if($yzmFlag == false){
			$yzm.parent().parent().find(".yx-error-tips span").html("请输入正确的验证码！").css("color","red");
			$yzm.parent().parent().find(".yx-error-tips img").show();
            $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));

		}
		//点击提交
		if($userFlag == true && $pwdFlag == true && $rePwdFlag == true && $emailFlag == true & $yzmFlag == true){
			$allFlag = true;
		}else{
			$allFlag = false;
		}
		//layer.alert($allFlag +"---" +$userFlag + "-----"+$pwdFlag +"------" +$rePwdFlag + "------" +$emailFlag);
		if($allFlag == true){	
			
			$(".reg-sub-btn").doAjax({
				url : $userRegForm.data("url"),
				data : {
					userName : $userNameVal,
					userPwd : $userPwdVal,
					userRePwd : $rePasStr,
					email : $emailVal,
					yzm : $yzmVal,
                    yzmKey : $yzmKey,
					IP : returnCitySN['cip']
				},
				success : function($data){
					if($data.status == "success"){
						layui.use("layer",function(){
							var layer = layui.layer;
							layer.alert($data.msg);
							$(".layui-layer-btn0").on("click",function(){
								 window.location.href = FRONT_APP_BASE;
							});
						});
					}else{
						layui.use("layer",function(){
                            $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));
							var layer = layui.layer;
							layer.alert($data.msg)
						});
					}
				}
			});
			
		}else{
			return false;
		}
		
	});

});

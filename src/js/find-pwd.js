/**
 * @fileOverview demo
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/12 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/6/12.
 */

import './core/control';


$(function () {
	var $findName = "";
    var $findPwd = {
        init: function () {
            this.findStepOne();
            this.findStepTwo();
        },

    //第一步
        findStepOne: function () {
            var $safeOneSubBtn = $('.my-find-step-one'),
                $checkUsername = $(".check-find-username"),
                $userNameVal = $checkUsername.val(),
                $errTips = $(".find-pwd-form .find-pwd-tips"),
                $yzmVal = $(".stepone-yzm").val();


			// 验证码刷新
            var $yzmImg = $('.find-pwd-form .step1 .yzm-img'),
                $src = $yzmImg.attr('src');

		//	$userNameFlag = true; 
            $safeOneSubBtn.on('click', function () {

                var $email = $('.check-find-email'),
					$userNameVal = $checkUsername.val(),
					$yzmVal = $(".stepone-yzm").val(),
					$yzmKey = $(".yzm-find-key").data("key");
				if($userNameVal == ""){
					 $errTips.find("span").html("请输入账号！").css("color","#FF5722");
					 $errTips.find("img").show();
				}else if($yzmVal == ""){
					 $errTips.find("span").html("请输入验证码！").css("color","#FF5722");
					 $errTips.find("img").show();
				}else{
					$safeOneSubBtn.doAjax({
						url : $safeOneSubBtn.data("url"),
						data : {
							userName : $userNameVal,
							yzm : $yzmVal,
                            yzmKey : $yzmKey
						},
						success : function($data){
							if($data.status == "success"){
								if($data.info.email != ""){
                                    $email.val($data.info.email)
									$(".step1").hide();
									$(".step2").show();
									$errTips.find("span").html("&nbsp;");
									$errTips.find("img").hide();
                                    $findName = $userNameVal;
								}else{
									$(".step1").hide();
									$(".step4").show();
								}								
							}else{
                                $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));
								$errTips.find("span").html($data.msg).css("color","#FF5722");
								$errTips.find("img").show();
							}
						}
					});
				}           

            });
        },

        //第二步
        findStepTwo: function () {
            var $safeTwoSubBtn = $(".find-pwd-send-btn"),
            	$email = $('.check-find-email');
			

			//点击发送邮件
			$safeTwoSubBtn.click(function(){
				var $that=this,
					$that1 = $(this),
					$emailVal = $email.val(),
					$grayTop = $(".my-send-email .gray-top");	
					$that1.addClass("send-again");				
					$grayTop.show();
					time($that,$that1,$grayTop);
					$that1.doAjax({
						url : $safeTwoSubBtn.data("url"),
						data :{
							username : $findName,
							email : $emailVal
						},
						success : function($data){
							if($data.status == "success"){								
								layui.use("layer",function(){
									var layer = layui.layer;
									layer.alert($data.msg);
									
								});
								//前往验证
								$(".change-show-pwd").attr("href" , $data.info.url)
								//window.location.href = "reset-pwd.html"
							}else{								
								layui.use("layer",function(){
									var layer = layui.layer;
									layer.alert($data.msg)
								});
							}
						}
					});
			});
			var wait=60;
			function time($that) {
					if (wait == 0) {
						$that.removeAttribute("disabled");            
						$(".my-send-email .send-again").html("发送验证邮件");
						$safeTwoSubBtn.removeClass("send-again");	
						$(".my-send-email .gray-top").hide();
						wait = 60;
					} else {
						$that.setAttribute("disabled", true);
						
						$(".my-send-email .send-again").html("重新发送(" + wait + ")");
						wait--;
						setTimeout(function() {
							time($that)
						},
						1000)
					}
				}
        },
		
		
		
    };
    $findPwd.init();


});
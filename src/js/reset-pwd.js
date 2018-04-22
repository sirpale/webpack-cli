/**
 * @fileOverview demo
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/12 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/6/12.
 */

import './core/control';


$(function () {

    var $resetPwd = {
        init: function () {
            this.changePwd();
        },
        
       
        //点击修改密码
        changePwd: function () {
            var $sureChaneP = $(".sure-change-pwd"),        //确认保存
                $NewsPwd = $('.find-new-password'),         //新密码节点
                $reNewsPwd = $('.find-new-re-password'),    //确认密码节点
				$yzm = $("find-pwd-yzm"),
                $NewsPwdVal = "",                           //新密码值
                $reNesPwdVal = "",                          //确认密码值
                $pwd = $('.change-find-paw'),               //新密码后提示
                $rePwd = $('.change-find-repaw'),           //确认密码后提示
                $pwdFlag = false,                          //提交flag
                $rePwdFlag = false,                        //密码flag
                $allFlag = false,                         //确认密码flag
                $yzmFlag = false;

            // 验证码刷新
            var $yzmImg = $('.find-pwd-form .step5 .yzm-img'),
                $src = $yzmImg.attr('src');

            //新密码输入之后失去焦点
            $NewsPwd.blur(function () {
                var $that = $(this),
                    $str = $that.val(),
                    patrn = /^(\w){6,20}$/;
                if (!$str == "") {        //新密码不为空
                    if (!patrn.exec($str)) {
                        $pwd.css("color", "red").find("img").show()
                    } else {
                        $pwd.css("color", "#737272").find("span").html("密码可用！").css("color","green");
                        $pwd.find("img").hide();
                        $NewsPwdVal = $str;
                        if ($NewsPwdVal != $reNesPwdVal) {    //如果新密码和确认密码不一致
                            $rePwd.css("color", 'red').find('span').html('密码不一致！').css("color","red");
                            $rePwd.find("img").show();
                            $rePwdFlag = false;
                        } else {          //如果新密码和确认密码一致
                            $rePwd.css("color", 'red').find('span').html('');
                            $rePwd.find("img").hide();
                            $reNesPwdVal = $str;
                            $rePwdFlag = true;
                        }
                        $pwdFlag = true;
                    }
                } else {  //新密码不空
                    $pwd.css("color", "red").find("img").show()
                }
				$NewsPwdVal = $str;
            });
            //确认密码输入之后失去焦点
            $reNewsPwd.blur(function () {
                var $that = $(this),
                    $str = $that.val();
                if ($NewsPwdVal == "") {      //如果新密码不为空
                    if ($str != "") {
                        $rePwd.css("color", 'red').find('span').html('密码不一致！').css("color","red");
                        $rePwd.find("img").show();
                        $reNesPwdVal = $str;
                        $rePwdFlag = false;
                    } else {
                        $rePwd.css("color", 'red').find('span').html('');
                        $rePwd.find("img").hide();
                        $reNesPwdVal = "";
                        $rePwdFlag = true;
                    }
                } else {  //如果新密码不为空
                    if ($NewsPwdVal != $str) {        //新密码不为空   确认密码和新密码不一致
                        $rePwd.css("color", 'red').find('span').html('密码不一致！').css("color","red");
                        $rePwd.find("img").show();
                        $reNesPwdVal = $str;
                        $rePwdFlag = false;
                    } else {                      //新密码不为空   确认密码和新密码一致
                        $rePwd.css("color", 'red').find('span').html('重复密码正确！').css("color","green");
                        $rePwd.find("img").hide();
                        $reNesPwdVal = $str;
                        $rePwdFlag = true;
                    }
                }
				$reNesPwdVal = $str;
            });

			
			
            //点击保存
            $sureChaneP.on('click', function () {
				var $yzm = $(".step5 .find-pwd-yzm").val(),
                    $yzmKey = $(".yzm-reset-key").data("key"),
                    $sign  = getUrlParam("sign");
				if($NewsPwdVal != ""){
					if($yzm == ""){
						$yzmFlag = false;
						$(".step5 .find-pwd-tips span").html("请输入验证码！").css("color","rgb(255, 87, 34)");
						$(".step5 .find-pwd-tips img").show();
					}else{
						$(".step5 .find-pwd-tips span").html("&nbsp;")
						$(".step5 .find-pwd-tips img").hide();
						$yzmFlag =true;
					}
				}
                if ($pwdFlag == false) {
                    $pwd.css("color", "red").find("img").show()
                }
                if ($rePwdFlag == false) {
                    $rePwd.css("color", 'red').find('span').html('密码不一致！');
                    $rePwd.find("img").show();
                }				
                if ($pwdFlag == true && $rePwdFlag == true && $yzmFlag == true) {
                    $allFlag = true;
                } else {
                    $allFlag = false;
                }

                //新密码和确认密码无误提交
                if ($allFlag == true) {
					$sureChaneP.doAjax({
						url : $sureChaneP.data("url"),
						data : {
							pwd : $NewsPwdVal,
							repwd : $reNesPwdVal,
							yzm : $yzm,
                            yzmkey :$yzmKey,
                            sign : $sign
						},
						success : function($data){
							if($data.status == "success"){
								layui.use("layer",function(){
									var layer = layui.layer;
									layer.alert($data.msg);	
									$(".layui-layer-btn0").on("click",function(){
										window.location.href = FRONT_APP_BASE;
									});
									//
									
								});
							}else{
								layui.use("layer",function(){
                                    $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));
									var layer = layui.layer;
y								});
							}
						}
					});
                }

            })
            function getUrlParam(sign) {
                var reg = new RegExp("(^|&)" + sign + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
            }
        },
    };
    $resetPwd.init();


});
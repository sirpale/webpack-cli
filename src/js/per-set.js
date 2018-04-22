/**
 * @fileOverview person 个人设置
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/5 DEAN. All Rights Reserved.
 * Created by sirpale on 2017/6/5.
 */


define(['./core/control'],function(){

    'use strict';

    //头部个人资料下拉列表展开收缩
    // $(".menu-f").hover(function(){
    //     $(this).find(".menu-s").show();
    // },function(){
    //     $(this).find(".menu-s").hide();
    // });

    var sx = 0, sy = 0, sw = 0, sh = 0;

    var $personSet = {
        init : function () {
            this.modifyAva();
            this.myInfo();
            this.mySafe();
            this.myChange();
        },
        // 修改头像
        modifyAva : function () {
            var $this = this,
                $form = $('form.img-fm'),
                $file = $('#file'),
                $subImg = $('.sub-img'),
                $target = $('#target');


            $subImg.on('click',function(){
                var $options = {
                    url : $form.attr('action'),
                    dataType : 'json',
                    target : '',
                    beforeSubmit : function (formData,jqForm, options) {

                    },
                    success : function ($data, status) {

                        if($data.status == "success"){
                            $target.attr('src',$data.img);
                            $this.autoResizeImage(0, 250, $target);
                        }

                    }
                };


                $form.ajaxForm($options);
            });

            $file.on('change', function () {
                var $that = $(this);
                // $this.setImagePreview();

                $subImg.trigger('click');
            });
        },
        // 预览
        setImagePreview : function () {
            var $this = this,
                $pic = document.getElementById('target'),
                $file = document.getElementById('file'),
                $ext = $file.value.substring($file.value.lastIndexOf('.') + 1).toLowerCase();

            // gif在IE浏览器暂时无法显示
            if ($ext != 'png' && $ext != 'jpg' && $ext != 'jpeg') return;

            var $isIE = navigator.userAgent.match(/MSIE/) !== null,
                $isIE6 = navigator.userAgent.match(/MSIE 6.0/) !== null;

            if ($isIE) {
                $file.select();
                var $realLocalPath = document.selection.createRange().text;

                // IE6浏览器设置img的src为本地路径可以直接显示图片
                if ($isIE6) {
                    $pic.src = $realLocalPath;
                } else {
                    // 非IE6由于安全问题直接设置无法显示
                    $pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + $realLocalPath + "\")";
                    // 设置img的src为base64编码的透明图片，取消显示浏览器默认图片
                    $pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
                }

                $this.autoResizeImage(0, 250, $pic);
            } else {
                this.html5Reader($file);
            }

        },
        html5Reader: function ($file) {
            var $this = this,
                $reader = new FileReader(),
                $target = $('#target');

            $file = $file.files[0];

            $reader.readAsDataURL($file);
            $reader.onload = function (e) {
                var $pic = document.getElementById('target');
                $pic.src = this.result;
                $this.autoResizeImage(0, 250, $pic);
            };

        },
        autoResizeImage: function ($maxWidth, $maxHeight, $objImg) {

            var $this = this,
                $imgContainer = $('.img-container'),
                $newImg = $imgContainer.find('.new-img'),
                api,
                $target = $('#target'),
                $img = new Image();

            $img.src = $target.attr('src');

            $img.onload = function () {

                var $hRatio,
                    $wRatio,
                    $ratio = 1,
                    $w = $objImg.width,
                    $h = $objImg.height;

                $wRatio = $maxWidth / $w;
                $hRatio = $maxHeight / $h;

                if ($maxWidth === 0 && $maxHeight === 0) {
                    $ratio = 1;
                } else if ($maxWidth === 0) {
                    if ($hRatio < 1) $ratio = $hRatio;
                } else if ($maxHeight === 0) {
                    if ($wRatio < 1) $ratio = $wRatio;
                } else if ($wRatio < 1 || $hRatio < 1) {
                    $ratio = ($wRatio <= $hRatio ? $wRatio : $hRatio);
                }


                if ($ratio < 1) {
                    $w = Math.ceil($w * $ratio);
                    $h = Math.ceil($h * $ratio);
                }

                $target.attr('data-width', $w);
                $target.attr('data-height', $h);

                if ($newImg.length > 0) $newImg.remove();

                var $imgHtm = '<img src="' + $target.attr('src') + '" width="' + $target.attr('data-width') + '" height="' + $target.attr('data-height') + '" class="new-img" />';

                $imgContainer.html('').append($imgHtm)
                    .find('.new-img').Jcrop({
                    aspectRatio: 1,
                    bgOpacity: 0.5,
                    bgColor: '#4f4f17',
                    addClass: 'jcrop-light',
                    onSelect: $this.updateCoords
                }, function () {
                    api = this;
                    api.setSelect([0, 0, 20 + 100, 65 + 100]);
                    api.setOptions({bgFade: true});
                    api.ui.selection.addClass('jcrop-selection');
                });


                $('.sub-upload-btn').off('click').on('click', function () {
                    var $that = $(this);


                    $that.doAjax({
                        url: $that.data('url'),
                        data: {
                            sx: sx,
                            sy: sy,
                            sw: sw,
                            sh: sh,
                            w: $target.attr('data-width'),
                            h: $target.attr('data-height'),
                            picname: $target.attr('src')
                        },
                        success: function ($json) {

                            var $msg;

                            if ($json.status == 'success') {
                                $('.my-ava').attr('src', $json.img);
                                $msg = '<p class="green f-tac"><i class="layui-icon">&#xe618;</i>' + $json.msg + '</p>';
                            } else {
                                $msg = '<p class="red f-tac"><i class="layui-icon">&#x1006;</i>' + $json.msg + '</p>';
                            }


                            layui.use('layer', function(){
                                var layer = layui.layer;

                                layer.alert($msg);
                            });


                        }
                    });
                });
            };

            $img = null;

        },
        //初始化坐标
        updateCoords: function (e) {
            sx = e.x; //起始x坐标
            sy = e.y; //起始y坐标
            sw = e.w; //裁剪宽度
            sh = e.h; //裁剪高度
        },
        getBrowser: function () {
            // 判断浏览器
            var $sys = {},
                $ua = navigator.userAgent.toLowerCase(),
                $s;

            ($s = $ua.match(/msie([\d.]+)/)) ? $sys.ie = $s[1] :
                ($s = $ua.match(/firefox\/([\d.]+)/)) ? $sys.firefox = $s[1] :
                    ($s = $ua.match(/chrome\/([\d.]+)/)) ? $sys.chrome = $s[1] :
                        ($s = $ua.match(/opera.([\d.]+)/)) ? $sys.opera = $s[1] :
                            ($s = $ua.match(/version\/([\d.]+).*safari/)) ? $sys.safari = $s[1] : 0;
        },
        // 个人资料
        myInfo : function () {

            var $dataSubBtn = $('.my-data-sub-btn'),	//
                $dataUrl = $('.zl'),
                $userReadName = $(".user-read-name"),
                $userReallyName = $(".user-really-name"),
                $signature =  $("#user-signature"),
                $signatureVal =  $signature.val(),
                $olderBit = $(".older-bit"),
                $userSex = $(".user-sex-box input"),
				$length = 25;
            //读取个人资料相关数据
            $dataUrl.doAjax({
                url : $dataUrl.data('url'),
                success : function ($data) {
                    $signature.val($data.signature);
                    $userReadName.val($data.userName);
                    $userReallyName.val($data.reallyName);
					$length = $data.signature.length;
                    $olderBit.html((25-$length));
					$signature =  $("#signature").html();

					if($data.sex == "男"){
                        $userSex.eq(0).attr("checked","checked");
                    }else{
                        $userSex.eq(1).attr("checked","checked")
                    }

                }
            });
           layui.use('layedit', function(){

			});

            $("#user-signature").on("keyup",function(){
                $signatureVal = $(this).val();
                if($signatureVal.length < 25){
                    $olderBit.html((25-$signatureVal.length));
                }else{
                    $signatureVal = $signatureVal.substr(0,25);
                    $olderBit.html((25-$signatureVal.length));
                    $(this).val($signatureVal);
                }
            });

			  $dataSubBtn.on("click",function(){
				 var $that = $(this);
					 $userReadName = $(".user-read-name").val();
					 $userReallyName = $(".user-really-name").val();
					 $userSex = $(".zl input[name=sex]:checked").val();
                     $signatureVal =  $("#user-signature").val();
                      if($signatureVal.length < 25){
                          $olderBit.html((25-$signatureVal.length));
                      }else{
                          $signatureVal = $signatureVal.substr(0,25);
                          $olderBit.html((25-$signatureVal.length));
                          $(this).val($signatureVal);
                      }
				 $that.doAjax({
					 url : $that.data("url"),
					 data : {
						 userName : $userReadName,
						 userReallyName : $userReallyName,
						 userSex : $userSex,
						 signature : $signatureVal
					 },
					 success : function($data){
						 if($data.status == "success"){
							 layui.use("layer",function(){
								 var layer = layui.layer;
								 layer.alert($data.msg);
                                 $(".layui-layer-btn0").on("click",function(){
                                     window.location.href = $data.url;
                                 });
							 })
						 }else{
                             var layer = layui.layer;
                             layer.alert($data.msg)
                         }
					 }
				 });
			  });
        },
        // 密码安全
        mySafe : function () {
            var $mySafeUrl = $('.sf'),    				//获取数据json
				$safeSubBtn = $('.my-safe-sub-btn'),    //点击按钮
				$safeSubAjax = $safeSubBtn,   			//提交数据json
                $oldPaw = $('.old-passw'),             //旧密码obj
                $newPaw = $('.new-passw'),             //新密码obj
                $reNewPaw = $('.re-new-passw'),        //重复密码obj
                $usEmail = $('.user-email'),           //邮箱obj
                $yzm = $('.safe-yzm'),
                $oldPawVal = $oldPaw.val(),
                $usEmailVal = $usEmail.val(),
                $newPawVal = $newPaw.val(),
                $reNewPawVal = $reNewPaw.val(),
				$yzmVal =$yzm.val(),
                $emHtml="",
                $oldEmailVal = "",
                $normalShow = $(".normal-show"),
                $thirdLoginShow = $(".third-login-show"),
                $yzmKey = $(".yzm-perset-key"),
                $yzmKeyVal = "",
                $noChange = false,
                $allFlag = false,                      //全部验证flag
                $oldFlag = true,
                $newFlag = true,
                $reFlag = true,
                $emFlag = true;

            //第三方登录时候绑定了




            //旧密码失去焦点
            $oldPaw.blur(function(){
                var $that = $(this),
                    $str = $oldPaw.val(),
                    patrn=/^(\w){6,20}$/;
                if($str != ""){		//是否输入数据
                    if (!patrn.exec($str)){//输入的数据是否正确
                        $that.parent().find('p').css("color",'red').html("密码由6~20数字、字母或特殊符号组成！");
                        $oldFlag = false;
                        $noChange = false;
                    }else{ //输入的数据正确
						$that.parent().find('p').css("color",'green').html("密码格式正确！");
						if( $oldPawVal == "" && $usEmailVal == "" && $reNewPawVal == "" && $usEmailVal == ""){
							$that.parent().find('p').css("color",'red').html("密码由6~20数字、字母或特殊符号组成！");
							$oldFlag = false;
							$noChange = false;
						}else{
							$oldFlag = true;
							$noChange = true;
						}
                    }
                }else{
					if($reNewPaw == "" || $newPawVal == ""){
						$that.parent().find('p').css("color",'#737272').html("密码由6~20数字、字母或特殊符号组成！");
						$oldFlag = true;
					}
				}
				//alert($oldFlag)
                $oldPawVal = $str;

            });
            //新密码失去焦点
            $newPaw.blur(function(){
                var $that = $(this),
                    $str =$that.val(),
                    patrn=/^(\w){6,20}$/;
                if($oldPawVal == $str && $str != ""){ //判断输入的新密码和及密码是否一样
                    $that.parent().find('p').css("color",'red').html('新密码和旧密码不能一样！');
                    $newFlag = false;
                }else{
                    if($str != ""){
                        if($oldPawVal == ""){   //判断有没有输入旧密码
                            $oldPaw.parent().find('p').css("color", 'red').html('请输入旧密码！');
                            $oldFlag = false;						}
                        if(!patrn.exec($str)){ //如果输入的密码格式不正确提示
                            $that.parent().find('p').css("color",'red').html('密码由6~20数字、字母或特殊符号组成！');
                            $newFlag = false;
                        }else{		//输入的密码格式正确
                           $that.parent().find('p').css("color",'green').html('密码可使用！');
                           $newPawVal = $str;
                            if($reNewPawVal == ""){//新密码和确认密码不一致
								$reNewPaw.parent().find('p').css("color",'#737272').html('如不需要更改密码，此处请留空！');
                                $newPawVal = $str;
                                $newFlag = true;
								$reFlag = false;
								$noChange = true;
                            }else if($reNewPawVal == $str){  //新密码和确认密码一致
                                $reNewPaw.parent().find('p').css("color",'green').html('密码可使用！');
                                $newPawVal = $str;
                                $newFlag = true;
								$noChange = true;
                            }else if($reNewPawVal != $str){ //没有输入提示留空
                               $reNewPaw.parent().find('p').css("color",'red').html('两次输入的密码不一致！');
                                $newFlag = false;
                                $reFlag = false;
                            }

                        }
                    }else if($reNewPawVal != ""){  //没有输入数据提示留空
						$reNewPaw.parent().find('p').css("color",'red').html('两次输入的密码不一致！');
						  $newFlag = false;
                    }else{
						$newPaw.parent().find('p').css("color",'#737272').html('如不需要更改密码，此处请留空！');
						$reNewPaw.parent().find('p').css("color",'#737272').html('如不需要更改密码，此处请留空！');
						$newFlag = true;
					}
                }
				//alert($newFlag)
                $newPawVal = $str;

            });
            //重复密码失去焦点
            $reNewPaw.blur(function(){
                var $that = $(this),
                    $str = $that.val(),
                    $newPaw = $('.new-passw').val(),
                    patrn=/^(\w){5,20}$/;
                if($oldPawVal == $str && $str != ""){
                    if($newPawVal != $str && $str != ""){
                        $that.parent().find('p').css("color",'red').html('两次输入的密码不一致！');
                        $reFlag = false;
                    }else{
                        $that.parent().find('p').css("color",'red').html('新密码和旧密码不能一样！');
                    }
                }else{
                    if($str != ""){
                        if($oldPawVal == ""){   ////输入之前判断有没有输入旧密码
                            $oldPaw.parent().find('p').css("color", 'red').html('请输入旧密码！');
                            $oldFlag = false;
                        }
                        if(!patrn.exec($str)){
                            $that.parent().find('p').css("color",'red').html('密码由6~20数字、字母或特殊符号组成！');
                            $reFlag = false;
                        }else{
                            if($newPawVal != $str){
								$that.parent().find('p').css("color",'red').html('两次输入的密码不一致！');
								$reFlag = false;
                            }else{
                                $that.parent().find('p').css("color",'green').html('密码可使用！');
                                $reNewPawVal = $str;
                                if($newPawVal != $reNewPawVal){
                                    $newFlag = false;
                                }else{
                                    $newFlag = true;
                                }
                                $reFlag = true;
                            }
                        }
                    }else if($newPawVal != ""){
                        $that.parent().find('p').css("color",'red').html('两次输入的密码不一致！');
						$reFlag = false;
                    }else{
						$that.parent().find('p').css("color",'#737272').html('如不需要更改密码，此处请留空！');
						$reFlag = true;
					}
                }
                $reNewPawVal = $str;

            });
            //
            //有邮箱就写入邮箱
            $usEmail.doAjax({
                url : $mySafeUrl.data('url'),
                success : function ($data) {
                    if($data.email != '') {
                        $usEmail.val($data.email);
                        if($data.flag == "0"){ //邮箱没有激活状态
                            $emHtml = "<i class='email-ico-img'></i>" +
                                " <span class='xi1'>新邮箱(" +  $data.email + ") 邮箱是找回密码的唯一途径，请你务必激活！<br>" +
                                "点击保存修改系统会自动发送一封验证激活邮件，请查收邮件，进行验证激活。<br>" +
                                " 如果没有收到验证邮件，您可以更换一个邮箱，或者重新获取邮件！"+
                                "</span>";

                            $usEmail.parent().find('p').css('color', '#737272').html($emHtml);
                        }
                    }else{
						  $emHtml = "您还没有激活邮箱，邮箱是找回密码的唯一途径，请你务必填写激活！";

                            $usEmail.parent().find('p').css('color', '#737272').html($emHtml);
					}
                    if($data.is_site_user == '0' && $data.flag == '0') {
                        $normalShow.hide();
                        $thirdLoginShow.show();
                    }else{
                        $normalShow.show();
                        $thirdLoginShow.hide();
                    }
                    $oldEmailVal = $usEmailVal = $data.email;

                }
            });

            // 验证码刷新
            var $yzmImg = $('.sf .yzm-img'),
                $src = $yzmImg.attr('src');

            //邮箱失去焦点
            $usEmail.blur(function(){
                var $that = $(this),
                    $str = $that.val(),
                    patrn  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})$/;
                if($str != ""){
                    if($oldPawVal == ""){   //输入之前判断有没有输入旧密码
                        $oldPaw.parent().find('p').css("color", 'red').html('请输入旧密码！');
                        $oldFlag = false;
                    }
                    if(!patrn.exec($str) && $str != ""){
                        $that.parent().find('p').css("color",'red').html('邮箱格式不正确！！！！');
                        $emFlag = false;
                    }else{
                        var emHtml = "<i class='email-ico-img'></i>" +
                                " <span class='xi1'>新邮箱(" +   $str + ") 邮箱是找回密码的唯一途径，请你务必激活！<br>" +
                                "点击保存修改系统会自动发送一封验证激活邮件，请查收邮件，进行验证激活。<br>" +
                                " 如果没有收到验证邮件，您可以更换一个邮箱，或者重新获取邮件！"+
                                "</span>";

                        $that.parent().find('p').css('color', '#737272').html(emHtml);
                        $emFlag = true;
                        $noChange = true;
                    }
                }else{
					$str = $oldEmailVal;
                }
				//alert($noChange )
                $usEmailVal =  $str;
            });
            //点击保存按钮
            $safeSubBtn.on('click',function(){
				$yzmVal = $('.safe-yzm').val();
                $yzmKeyVal = $yzmKey.attr("data-key");
                //旧密码 flag          新密码  flag            重复密码 flag   邮箱 flag  都为true才可提交
                if($oldFlag == true && $newFlag == true && $reFlag ==true && $emFlag == true){
                    $allFlag = true;
                }else{
                    $allFlag = false;
                }
				//alert($noChange)
                //可以提交
                if($allFlag == true){
                    if($noChange == false){
                        layui.use('layer',function(){
                            var layer = layui.layer;
                            layer.alert("没有做任何修改！" );
                        });
                    }else{
						if($yzmVal == ""){
							layui.use('layer',function(){
								var layer = layui.layer;
								layer.alert("请输入验证码！" );
							});
						}else{
							//数据交互
							$safeSubBtn.doAjax({
								url : $(".my-safe-sub-btn ").data('url'),
								data : {
									oldPwd : $oldPawVal,
									newPwd : $newPawVal,
									yzm : $yzmVal,
									email : $usEmailVal,
                                    yzmKey : $yzmKeyVal
								},
								success : function ($data) {
									if($data.status == 'success') {
										layui.use('layer',function(){
											var layer = layui.layer;
											layer.alert($data.message);
											$(".layui-layer-btn0").on("click",function(){
												window.location.href = $data.data;
											});
										});
									}else{
                                        var layer = layui.layer;
                                        layer.alert($data.message);
                                        $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));
                                    }
								}
							});
						}
					}
                }else{
                    if ($oldFlag == false) {
                        $oldPaw.parent().find('p').css("color", 'red').html('密码由6~20数字、字母或特殊符号组成！');
                    }else if($reFlag == false){
                       $reNewPaw.parent().find('p').css("color",'red').html('两次输入的密码不一致！');
                   }else if($emFlag == false){
                        $usEmail.parent().find('p').css("color",'red').html('请填写正确的邮箱！');
                   }
               }
            });
        }, //mySafe结束
		myChange : function(){
			var $choiceMod = getUrlParam("chioceMod"),
				$liNav = $(".set-left ul li");

			if($choiceMod == "set"){	//默认头像
				$liNav.eq("0").addClass("layui-this").siblings().removeClass("layui-this")
				$(".set-content1").removeClass("layui-hide").siblings().addClass("layui-hide");
			}else if($choiceMod == "per"){	//个人资料
				$liNav.eq("1").addClass("layui-this").siblings().removeClass("layui-this")
				$(".set-content2").removeClass("layui-hide").siblings().addClass("layui-hide");
			}else if($choiceMod == "group"){//用户组
				$liNav.eq("2").addClass("layui-this").siblings().removeClass("layui-this")
				$(".set-content3").removeClass("layui-hide").siblings().addClass("layui-hide");
			}else if($choiceMod == "safe"){//密码安全
				$liNav.eq("3").addClass("layui-this").siblings().removeClass("layui-this")
				$(".set-content4").removeClass("layui-hide").siblings().addClass("layui-hide");
			}

			function getUrlParam(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if(r != null) return unescape(r[2]);
				return null;
			}
		}

    };


    $personSet.init();
});
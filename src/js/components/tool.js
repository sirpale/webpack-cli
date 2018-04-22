/**
 *
 * Created by Administrator on 2017/06/15.
 */

define([
    '../core/control',
    '../core/tools',
    '../components/openwin'
],function($control, $tools, $openwin){

    TOOLS = {
        init: function () {
            // 检测登录
            this.checkLogin();
            // 点击退出登录
            this.loginQuit();
        },

        // 检测登录
        checkLogin : function () {

            var $this = this,
                $sLogReg = $('.s-log-reg'),
                $loginFlag= $('.login-flag'),
                $thirdBindingFlag = $('.third-binding-flag'),
                $loginUid= $('.login-uid'),
                $forBingding = $(".for-bingding"),
                $forLogin = $("#reply .third-to-login"),
                $loginAndRegFlag = $(".login-regiser-flag");


            $(document).doAjax({
                url : $sLogReg.data('url'),
                success : function ($data) {

                    if($data.status == 'success') {
                        layui.use('laytpl',function(){
                            var laytpl = layui.laytpl,
                                $loginInfo = $('.login-info');

                            laytpl($loginInfo.html()).render($data,function(html){
                                $('.'+$loginInfo.data('target')).html('').html(html);
                            });

                        });

                        $loginUid.val($data.info.uid);
                        $loginFlag.val(1);
                        $loginAndRegFlag.val(1);
                        if($loginAndRegFlag.val() == "1" && $loginFlag.val()=="1"){
                            window.location.href = FRONT_APP_BASE;
                        } else {
                            layer.closeAll();
                        }
                        // 绑定账号
                        if($data.info.regType && $data.info.regType !== '') {

                            $thirdBindingFlag.val(0);

                            if(!$.cookie('bind_flag')) {
                                window.location.href = BIND_URL;
                                $.cookie('bind_flag','1', {path:'/'});
                            }


                        } else {

                            $thirdBindingFlag.val(1);

                            // setTimeout(function(){
                            //     layer.closeAll();
                            // },3000);
                        }

                    } else {
                        // 如果没有登录则弹窗
                        $this.loginDialog();
                        $loginFlag.val(0);
                    }

                }
            });

            // console.log( $.cookie("bind_flag"))
        },

        //退出登录
        loginQuit: function() {
            var $this = this,
                $sLogReg = $('.s-log-reg');
            $('.s-log-reg').on("click",".user-detail .quit",function(){
                var $that = $(this);
                $that.doAjax({
                    url :  $that.data("url"),
                    success : function($data){
                        if($data.status == "success"){
                            layui.use(['layer','laytpl'],function(){
                                var layer=layui.layer,
                                    laytpl = layui.laytpl,
                                    $loginInfo = $('.login-before');
                                layer.msg("您已安全退出，您将以游客的身份浏览网页");

                                laytpl($loginInfo.html()).render({},function(html){
                                    $sLogReg.html('').html(html);
                                });
                            });
                            setTimeout(function(){
                                window.location.href = FRONT_APP_BASE;
                            },1000);

                            $.removeCookie('bind_flag',{ path: '/' });
                        }else{return false}
                    }
                });
            });
            this.loginDialog();
        },


        // 登录弹窗
        loginDialog: function () {


            var $this = this,
                $topLogin = $('.top-right-login'),
                $loginContainer = $('.login-alert-container');

            $('.s-log-reg,.detail-to-login').on("click",".top-right-login",function(){
                var $that = $(this),
                    $type = $that.data('type');
                layui.use('layer', function () {
                    var layer1 = layui.layer;

                    layer1.open({
                        title : $that.attr('title'),
                        type : 1,
                        content : $loginContainer.html(),
                        offset : $type,
                        id : 'dialog-' + $type,
                        area : ['500px','500px'],
                        btnAlign : 'c',
                        shade : 0.1,
                        success : function (layero, index) {
                            // 登录验证
                            $this.loginValida(layero,layer1,index);
                            // 第三方登录
                            $openwin.init($(".third-to-login"));

                        }
                    });

                });
            });

        },
        // 登录验证
        loginValida: function (layero,layer,idx) {


            // 用户名
            var $this = this,
                $layero = $(layero),
                $username = $layero.find('input[name="username"]'),
                $pwd = $layero.find('input[name="pwd"]'),
                $yzm = $layero.find('input[name="yzm"]'),
                $tip = $layero.find(".login-error-tips"),
                $loginBtn = $layero.find('.alert-login-btn'),
                $params = {};



            // 验证表单
            $username.on('blur', function () {
                var $that = $(this),
                    $reg = /^[a-zA-Z0-9_]{4,20}$/;

                if($.trim($that.val()) == '') {
                    $that.attr('data-valid',0);
                    $tip.text('请输入用户名和密码！');
                } else {
                    $that.attr('data-valid',1);
                    $params[ $that.attr('name')] = $that.val();
                    $tip.text('');
                }
            });


            $pwd.on('blur', function () {
                var $that = $(this),
                    $reg = /^[a-zA-Z0-9_@!#$%^&*\.]{6,20}$/;
                if($.trim($that.val()) == '') {
                    $that.attr('data-valid',0);
                    $tip.text('请输入用户名和密码！');
                } else {
                    $that.attr('data-valid',1);
                    $params[$that.attr('name')] = $that.val();
                    $tip.text('');
                }

            });

            $yzm.on('blur',function(){
                var $that = $(this);
                if($.trim($that.val()) == '') {
                    $that.attr('data-valid',0);
                    $tip.text('验证码不能为空哦');
                } else {
                    $that.attr('data-valid',1);
                    $params[$that.attr('name')] = $that.val();
                    $tip.text('');
                }
            });


            // 验证码刷新
            var $yzmImg = $layero.find('.yzm-img'),
                $src = $yzmImg.attr('src');
                $yzmImg.on('click',function(){
                    var $that = $(this);
                    $that.attr('src',$src + '&v='+parseInt(Math.random()*10000));
                });


            // 点击登录
            $loginBtn.off('click').on('click',function(){
                var $yzmKey = $(".yzm-head-login-key").data("key");
                $params["yzmKey"] = $yzmKey
                $params["IP"] = returnCitySN['cip'];
                $this.loginAjax($layero,layer,idx,$params,$yzmImg,$src);
            });


            // 回车登录
            $layero.off('keydown').on('keydown',function(e) {

                var $keyCode = e.keyCode || e.which;

                if($keyCode == 13)  {
                    $username.trigger('blur');
                    $pwd.trigger('blur');
                    $yzm.trigger('blur');
                    $this.loginAjax($layero,layer,idx,$params,$yzmImg,$src);
                }

            });

        },
        loginAjax : function ($layero,layer,idx,$params,$yzmImg,$src) {


            var $that = this,
                $loginBtn = $layero.find('.alert-login-btn'),
                $tip = $layero.find(".login-error-tips"),
                $inp = $layero.find('.form-control'),
                $url = $loginBtn.data('url'),
                $sLogReg = $('.s-log-reg'),
                $loginInfo = $('.login-info'),
                $flag = 0,
                $loginFlag= $('.login-flag'),
				$loginUid= $('.login-uid'),
                $thirdBindingFlag = $('.third-binding-flag'),
                $loginAndRegFlag = $('.login-regiser-flag');

            $inp.each(function(){
                var $_that = $(this);
                if($_that.attr('data-valid') == 1) $flag++;
            });

            if($flag == $inp.length) {
                $loginBtn.doAjax({
                    url : $url,
                    beforeSend : function () {
                        $loginBtn.attr('disabled','disabled');
                    },
                    data : $params,
                    success : function ($data) {

                        if($data.status == 'success')  {
                            $tip.addClass('green').removeClass('red');
                            layer.close(idx);

                            layer.msg($data.msg);

                            layui.use('laytpl', function(){
                                var laytpl = layui.laytpl;
                                laytpl($loginInfo.html()).render($data, function(html){
                                    $sLogReg.html('').html(html);
                                });
                            });

                            $.cookie('bind_flag','1', {path:'/'});
                            $loginUid.val($data.info.uid);
                            $loginFlag.val(1);
                            $loginAndRegFlag.val(1);
                            if($loginAndRegFlag.val() == "1" && $loginFlag.val()=="1"){
                                setTimeout(function(){
                                    window.location.href = FRONT_APP_BASE
                                },1000)
                            }else{

                            }
                            // 绑定账号
                            if($data.info.regType && $data.info.regType !== '') {

                                $thirdBindingFlag.val(0);

                                if(!$.cookie('bind_flag')) {
                                    window.location.href = BIND_URL;
                                    $.cookie('bind_flag','1', {path:'/'});
                                }

                            } else {
                                $thirdBindingFlag.val(1);
                            }
                            $tip.addClass('green').removeClass('red').html('<i class="layui-icon">&#xe605;</i>'+$data.msg);
                        } else {
                            $tip.addClass('red').removeClass('green').html('<i class="layui-icon">&#xe60b;</i>'+$data.msg);

                            $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));

							$loginFlag.val(0);
                        }
                    },
                    complete : function () {
                        $loginBtn.removeAttr('disabled');
                    }
                });
            } else {
                $tip.text('提交失败，请检查以下信息是否正确！');
                $yzmImg.attr('src',$src + '&v='+parseInt(Math.random()*10000));
            }
        }

    };

    return TOOLS;

});
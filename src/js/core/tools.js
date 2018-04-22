/**
 * @fileOverview tools 通用组件
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/12 DEAN. All Rights Reserved.
 * Created by Sirpale on 2017/6/12.
 */


/*============================================================================
 *  全局对象
 * ============================================================================*/

(function ($, window) {

    'use strict';


    /*检测jquery*/
    if (typeof($) === 'undefined') throw new Error('SJUI requires jQuery');


    // SJUI shared object
    if (!$.sjui) $.sjui = function (obj) {
        if ($.isPlainObject(obj)) $.extend($.sjui, obj);
    };


    var lastUuidAmend = 0;
    $.sjui({
        uuid: function () {
            return (new Date()).getTime() * 1000 + (lastUuidAmend++) % 1000;
        },
        callEvent: function (func, event, proxy) {
            if ($.isFunction(func)) {
                if (proxy !== undefined) {
                    func = $.proxy(func, proxy);
                }

                var result = func(event);
                if (event) event.result = result;
                return !(result !== undefined && (!result));
            }
        },
        clientLang: function () {
            var lang, config = window.config;
            if (typeof(config) != 'undefined' && config.clientLang) {
                lang = config.clientLang;
            } else {
                var hl = $('html').attr('lang');
                lang = hl ? hl : (navigator.userLanguage || navigator.userLanguage || 'zh_cn');
            }

            return lang.replace('-', '_').toLowerCase();

        }
    });


    $.fn.callEvent = function (name, event, model) {
        var $this = $(this),
            dotIndex = name.indexOf('.zui'),
            shortName = name;

        if (dotIndex < 0 && model && model.name) {
            name += '.' + model.name;
        } else {
            shortName = name.substring(0, dotIndex);
        }

        var e = $.Event(name, event);

        if (model === undefined && dotIndex > 0) {
            model = $this.data(name.substring(dotIndex + 1));
        }

        if (model && model.options) {
            var func = model.options[shortName];
            if ($.isFunction(func)) {
                $.sjui.callEvent(model.options[shortName], e, model);
            }
        }

        return e;


    }


})(jQuery, window);


/*============================================================================
 * Ajax 封装
 * @param
 * type-类型
 * url-地址
 * async-同步/异步
 * data-提交的数据
 * dataType-数据类型
 * beforeSend-函数，发送前操作
 * success-函数，成功回调
 * error-函数，错误回调
 * complete-函数，成功回调
 * @return
 *============================================================================ */

+function ($,window) {

    'use strict';

    // DoAjax
    var DoAjax = function (element, options) {
        this.element = $(element);
        this.options = this.getOptions(options);
        this.init();
    };

    DoAjax.prototype.getOptions = function (options) {
        options = $.extend({}, DoAjax.DEFAULTS, typeof options == 'object' && options);
        return options;
    };


    DoAjax.DEFAULTS = {
        type : 'GET',
        dataType: 'json',
        data : {},
        async: true
    };

    DoAjax.prototype.init = function () {
        this.doAjax();
    };


    DoAjax.prototype.doAjax = function () {

        var $this = $(this),
            setting = this.options;


        // console.log(setting);

        $.ajax({
            type: setting.type,
            contentType : setting.contentType,
            url: setting.url,
            // url: setting.url + '?v=' + parseInt(Math.random()*10000),
            async: setting.async,
            data: setting.data,
            dataType: setting.dataType,
            beforeSend: function (jqXHR, settings) {
                if (setting.beforeSend) setting.beforeSend();
            },
            success: function ($data) {
                if (setting.success) setting.success($data);
            },
            error: function (xhr, status, error) {

                if (setting.error) setting.error(xhr, status, error);
            },
            complete: function () {
                if (setting.complete) setting.complete();
            }
        });
    };


    var old = $.fn.doAjax;

    $.fn.doAjax = function (options) {
        return this.each(function(){
            new DoAjax(this, options);
        });
    };


    $.fn.doAjax.Constructor = DoAjax;


    $.fn.doAjax.noConflict = function () {
        $.fn.doAjax = old;
        return this;
    };


}($,window);


/*============================================================================
 * 分页-异步取数据
 * @param
 * @return
 * ============================================================================*/

+function($,window) {

    'use strict';

    // Page
    var Page = function (ele,options) {
        this.ele = $(ele);
        this.options = this.getOptions(options);

        this.init();
    };

    Page.DEFAULTS = {
        pageSize: 10,			    // 每页要显示的条数
        totalPages: 9,		        // 分页数
        showNums: 5,			    // 要显示几个按钮
        activeClass: 'current',	    // active类
        pageNum: 1,			        // 当前页数
        pageNumWrap : '.page-num' , // 显示分页数字的区域
        firstPage: '首页',		    // 首页按钮名称
        lastPage: '末页',		    // 末页按钮名称
        prev: '上一页',		        // 上一页名称
        next: '下一页',		        // 下一页名称
        hasFirstPage: true,	        // 是否显示首页按钮
        hasLastPage: true,		    // 是否显示末页按钮
        hasPrev: true,			    // 是否有上一页按钮
        hasNext: true,			    // 是否有下一页按钮
        callBack: function ($pageNum, $pageSize) {}
    };

    Page.prototype.getOptions = function (options) {
        options = $.extend({},Page.DEFAULTS,typeof options == 'object' && options);
        return options;
    };


    Page.prototype.init = function () {
        var $this = this,
            $obj = $($this.ele),						    // 对象
            $opts = $this.options,                          // 设置
            $total = $opts.total,						    // 总数
            $pageSize = $opts.pageSize,					    // 每页显示条数
            $l = Math.ceil($opts.total / $opts.pageSize),	// 分页数
            $n = $opts.showNums,						    // 按钮个数
            $aNum = $opts.pageNum,					        // 当前页数
            $active = $opts.activeClass,
            $str = '',
            $str1 = '<a href="javascript:void(0);" class="' + $active + '">1</a>';

        // console.log($opts);

        if (!$total || $total <= 0) {
            $obj.hide();
        } else {
            $obj.show();
            $obj.attr('data-pagesize', $pageSize);


            if ($l > 1 && $l < $n + 1) {
                // 根据总长度添加按钮
                for (var i = 2; i < $l + 1; i++) {
                    $str += '<a href="javascript:void(0);">' + i + '</a>';
                }
            } else if ($l > $n) {
                for (var j = 2; j < $n + 1; j++) {
                    $str += '<a href="javascript:void(0);">' + j + '</a>';
                }
            }


            // 添加
            var $dataHtml = '';

            // 首页、末页、上一页、下一页
            if ($l > 1) {
                if ($opts.hasFirstPage && $opts.hasPrev) {

                    $dataHtml += '<a href="javascript:void(0);" class="first">' + $opts.firstPage + '</a>' +
                        '<a href="javascript:void(0);" class="prev">' + $opts.prev + '</a>';

                }
                $dataHtml += '<em class="page-num">' + $str1 + $str + '</em>';
                if ($opts.hasNext && $opts.hasLastPage) {
                    $dataHtml += '<a href="javascript:void(0);" class="next">' + $opts.next + '</a>' +
                        '<a href="javascript:void(0);" class="last">' + $opts.lastPage + '</a>';

                }
            }


            $obj.html($dataHtml).off('click');


            var $pageNum = $obj.find('.page-num');

            // 上一页
            $obj.on('click', '.prev', function () {
                var $pageShow = parseInt($('.' + $active).html()),
                    $nums = $this.odevity($n);


                if ($pageShow <= 1) {
                    return;
                } else if ($pageShow <= $n - $nums / 2) {
                    $this.firstPage(0);
                } else if (($pageShow > 1 && $pageShow <= $nums / 2) || ($pageShow > $l - $nums / 2 && $pageShow < $l + 1)) {
                    // 最前几项或最后几项
                    $('.' + $active).removeClass($active).prev().addClass($active);
                } else {
                    $('.' + $active).removeClass($active).prev().addClass($active);
                    $this.renderPage($pageShow - 1);
                }


                $opts.callBack($pageShow - 1, $pageSize);
            });


            // 下一页
            $obj.on('click', '.next', function () {
                var $pageShow = parseInt($('.' + $active).html()),
                    $nums, $flag,
                    $a = $n % 2;

                if ($a === 0) {
                    // 偶数
                    $nums = $n;
                    $flag = true;
                } else if ($a == 1) {
                    //奇数
                    $nums = $n + 1;
                    $flag = false;

                }

                // 显示的当前页
                if ($pageShow >= $l - 1) {

                    if ($pageShow === $l) return;

                    if ($l > $n) {
                        $this.lastPage($n - 1);
                    } else {
                        $this.lastPage($l - 1);
                    }

                } else if ($pageShow > 0 && $pageShow <= $nums / 2) {
                    // 最前几项
                    $('.' + $active).removeClass($active).next().addClass($active);
                } else if (($pageShow > $l - $nums / 2 && $pageShow < $l - 1 && $flag === false) || ($pageShow > $l - $nums / 2 - 1 && $pageShow < $l && $flag === true)) {
                    // 最后几项
                    $('.' + $active).removeClass($active).next().addClass($active);
                } else {

                    $('.' + $active).removeClass($active).next().addClass($active);
                    $this.renderPage($pageShow + 1);

                }


                $opts.callBack($pageShow + 1, $pageSize);

            });


            // 首页
            $obj.on('click', '.first', function () {
                var $activePage = parseInt($('.' + $active).html());
                if ($activePage <= 1) return;

                // 当前第一页
                $opts.callBack(1, $pageSize);
                $this.firstPage(0);

            });

            // 末页
            $obj.on('click', '.last', function () {
                var $activePage = parseInt($('.' + $active).html());
                if ($activePage >= $l) return;
                // 当前最后一页
                $opts.callBack($l, $pageSize);

                if ($l > $n) {
                    $this.lastPage($n - 1);
                } else {
                    $this.lastPage($l - 1);
                }

            });

            // 点击页码
            $pageNum.on('click', 'a', function () {
                var $that = $(this),
                    $pageShow = parseInt($that.html()),
                    $nums = $this.odevity($n);

                if ($l > $n) {
                    if ($pageShow > $l - $nums / 2 && $pageShow < $l + 1) {
                        // 最后几项
                        $this.lastPage(($n - 1) - ($l - $pageShow));
                    } else if ($pageShow > 0 && $pageShow < $nums / 2) {
                        // 最前几项
                        $this.firstPage($pageShow - 1);
                    } else {
                        $this.renderPage($pageShow);
                    }
                } else {
                    $('.' + $active).removeClass($active);
                    $that.addClass($active);
                }


                $opts.callBack($pageShow, $pageSize);

            });

        }
    };

    // 渲染结构，$activePage当前项
    Page.prototype.renderPage = function ($activePage) {
        var $opts = this.options,
            $nums = this.odevity($opts.showNums),
            $pageStart = $activePage - ($nums / 2 - 1),
            $n = $opts.showNums,
            $str1 = '',
            $pageNum = this.ele.find($opts.pageNumWrap);

        for (var i = 0; i < $n; i++) {
            $str1 += '<a href="javascript:void(0);">' + ($pageStart + i) + '</a>';
        }

        $pageNum.html($str1);
        $pageNum.find('a').eq($nums / 2 - 1).addClass($opts.activeClass);

    };

    // 首页，$index选中索引项
    Page.prototype.firstPage = function ($index) {
        var $opts = this.options,
            $l = Math.ceil($opts.total / $opts.pageSize ),
            $n = $opts.showNums,
            $str1 = '',
            $pageNum = this.ele.find($opts.pageNumWrap);

        // console.log($l);

        if ($l > $n - 1) {
            for (var i = 0; i < $n; i++) {
                $str1 += '<a href="javascript:void(0);">' + (i + 1) + '</a>';
            }
        } else {
            for (var j = 0; j < $l; j++) {
                $str1 += '<a class="javascript:void(0);">' + (j + 1) + '</a>';
            }
        }

        $pageNum.html($str1);
        $pageNum.find('a').eq($index).addClass($opts.activeClass);
    };


    // 末页，$index选中项索引
    Page.prototype.lastPage = function ($index) {
        var $opts = this.options,
            $l = Math.ceil($opts.total / $opts.pageSize ),
            $n = $opts.showNums,
            $str1 = '',
            $pageNum = this.ele.find($opts.pageNumWrap);

        if ($l > $n - 1) {
            for (var i = $l - ($n - 1); i < $l + 1; i++) {
                $str1 += '<a href="javascript:void(0);">' + i + '</a>';
            }

        } else {
            for (var j = 0; j < $l; j++) {
                $str1 += '<a href="javascript:void(0);">' + (j + 1) + '</a>';
            }
        }


        $pageNum.html($str1);
        $pageNum.find('a').eq($index).addClass($opts.activeClass);
    };

    //判断奇偶
    Page.prototype.odevity = function (n) {
        var a = n % 2;
        if (a === 0) {
            // 偶数
            return n;
        } else {
            return n + 1;
        }
    };



    //
    var old = $.fn.Page;
    $.fn.Page = function (options) {
        return this.each(function(){
            new Page(this,options);
        });
    };

    $.fn.Page.Constructor = Page;

    $.fn.Page.noConflict = function () {
        $.fn.Page = old;
        return this;
    };




}($,window);


/*============================================================================
 * 分页-静态
 * @param
 * @return
 * ============================================================================*/

+function($,window){
    'use strict';

    var PageStatic = function (ele, options) {

        this.ele = $(ele);
        this.options = this.getOptions(options);

        this.init();

    };

    PageStatic.DEFAULTS = {
        pageSize : 10,
        totalPages : 10,
        showNum : 10,
        activeClass : 'current',
        pageNumWrap : '.page-num' , // 显示分页数字的区域
        firstPage: '首页',		    // 首页按钮名称
        lastPage: '末页',		    // 末页按钮名称
        prev: '上一页',		        // 上一页名称
        next: '下一页',		        // 下一页名称
        asFirstPage: true,	        // 是否显示首页按钮
        hasLastPage: true,		    // 是否显示末页按钮
        hasPrev: true,			    // 是否有上一页按钮
        hasNext: true,			    // 是否有下一页按钮
        callBack: function ($pageNum, $pageSize) {}
    };

    PageStatic.prototype.getOptions = function (options) {
        options = $.extend({}, PageStatic.DEFAULTS, typeof options == 'object' && options);
        return options;
    };


    PageStatic.prototype.init = function () {
        var $this = this,
            $obj = $($this.ele),						    // 对象
            $opts = $this.options,                          // 设置
            $total = $opts.total,						    // 总数
            $pageSize = $opts.pageSize,					    // 每页显示条数
            $l = Math.ceil($opts.total / $opts.pageSize),	// 分页数
            $n = $opts.showNum,						        // 按钮个数
            $aNum = $opts.pageNum,					        // 当前页数
            $url = $opts.url,
            $numArr = [],
            $str = '',
            $str1 = '<a href="javascript:void(0);" class="' + $opts.activeClass + '">1</a>';




        // 根据总数判断是否要显示分页
        if(!$total || $total <= 0) {
            $obj.hide();
        } else {
            $obj.show();

            $obj.attr('data-pageSize',$pageSize);

            // 根据总数添加按钮
            if ($l > 1 && $l < $n + 1) {
                // 根据总长度添加按钮
                for (var i = 2; i < $l + 1; i++) {
                    $str += '<a href="javascript:void(0);">' + i + '</a>';
                }
            } else if ($l > $n) {
                for (var j = 2; j < $n + 1; j++) {
                    $str += '<a href="javascript:void(0);">' + j + '</a>';
                }
            }


            // 添加
            var $dataHtml = '';

            // 首页、末页、上一页、下一页
            if ($l > 1) {

                // if ($opts.hasFirstPage && $opts.hasPrev) {
                //
                //     $dataHtml += '<a href="javascript:void(0);" class="first">' + $opts.firstPage + '</a>' +
                //         '<a href="javascript:void(0);" class="prev">' + $opts.prev + '</a>';
                //
                // }
                // $dataHtml += '<em class="page-num">' + $str1 + $str + '</em>';
                // if ($opts.hasNext && $opts.hasLastPage) {
                //     $dataHtml += '<a href="javascript:void(0);" class="next">' + $opts.next + '</a>' +
                //         '<a href="javascript:void(0);" class="last">' + $opts.lastPage + '</a>';
                //
                // }

                // console.log($aNum);

                // console.log($l + '===' + $n);

                $dataHtml += '<a href="'+($aNum == 1 ? 'javascript:void(0);': $url+($aNum-1))+'" class="prev '+($aNum == 1 ? 'disab' : '')+'">'+$opts.prev+'</a>' +
                    '<a href="'+($aNum == 1 ? 'javascript:void(0);' : $url+'1')+'" class="'+($aNum == 1 ? 'disab' : '')+'">'+$opts.firstPage+'</a>' +
                    '<span>' ;

                // console.log('当前页：'+$aNum + 'n=' + $n);

                if($l <= $n) $n = $l-1;

                for(var j=0;j<$n+1;j++) {
                    if($aNum > 5 && $aNum < ($l-5)) {
                        $numArr.push(($aNum-5)+j);
                    } else if($aNum >= $l-5) {
                        $numArr.push($l - $n + j);
                    } else {
                        $numArr.push(j+1)
                    }
                }

                // console.log($numArr);


                for(var i=0;i<$numArr.length;i++) {
                    $dataHtml += '<a href="'+$url+$numArr[i]+'" class="'+($numArr[i] == $aNum ? 'current' : '')+'">'+$numArr[i]+'</a>'
                }

                $dataHtml += '</span>' +
                    '<a href="javascript:void(0);">共'+$l+'页</a>' +
                    '<a href="'+($aNum == $l ? 'javascript:void(0);' : $url +$l)+'" class="last '+($aNum == $l ? 'disab' :'')+'">末页</a>' +
                    '<a href="'+($aNum == $l ? 'javascript:void(0);' : $url + ($aNum+1))+'" class="nxt '+($aNum == $l ? 'disab' : '')+'">'+$opts.next+'</a>';
            }

            $obj.html('').html($dataHtml).off('click');
            if($opts.callBack) $opts.callBack($aNum,$pageSize);

        }

    };



    var old = $.fn.PageStatic;

    $.fn.PageStatic = function (options) {
        return this.each(function(){
            new PageStatic(this, options);
        });
    };

    $.fn.PageStatic.Constructor = PageStatic;

    $.fn.noConflict = function () {
        $.fn.PageStatic = old;
        return this;
    }

}($,window);


/*============================================================================
 * 文本多余部分以省略号替换
 * @param
 * @return
 * ============================================================================*/

+function($, window) {

    'use strict';
    var Ellp = function(ele, options) {

        this.ele = $(ele);
        this.options = this.getOptions(options);
        this.init();

    };

    Ellp.DEFAULTS = {
        target : 'p',
        ellChar : '...',
        maxWidth : 0,
        maxLine : 1,
        num : 1.2
    };

    Ellp.prototype.getOptions = function (options) {
        options = $.extend({}, Ellp.DEFAULTS, typeof options == 'object' && options);
        return options;
    };

    Ellp.prototype.init = function () {

        var $this = this,
            $obj = $(this.ele),
            $opts = this.options,
            $max = $opts.maxWidth,
            $ellChar = $opts.ellChar;

        if(!$max) $max = $obj.width();

        $max = $max * $opts.maxLine;

        // white-space bug
        var $text = $.trim($obj.text()).replace(' ','　'),
            $tempEle = $obj.clone(false)
                .css({'visibility': 'hidden', 'whiteSpace': 'nowrap', 'width': 'auto'}).appendTo(document.body);

        var $width = $tempEle.width();

        // for performance while content exceeding the limit substantially
        var $stop = Math.floor($text.length * $max / $width * $opts.num),
            $tempStr = '';


        if($width > $max) {
            $tempStr = $text.substring(0, $stop) + $ellChar;
        } else {
            $tempStr = $text.substring(0, $stop);
        }

        $obj.text($tempStr.replace('　',' '));

        $tempEle.remove();

    };

    var old = $.fn.Ellp;

    $.fn.Ellp = function (options) {
        return this.each(function(){
           new Ellp(this, options);
        });
    };

    $.fn.Ellp.Constructor = Ellp;

    $.fn.noConflict = function() {
        $.fn.Ellp = old;
        return this;
    }

}($,window);









/**
 * @fileOverview 首页
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/6/12 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/6/12.
 */


define(['./core/control'],function(){
    'use strict';


    var $rotation = $('.rotation');

    $rotation.side();


    var $div_li =$(".h-module-1 h3 em a");
    $div_li.hover(function(){
        $(this).addClass("hh")
            .siblings().removeClass("hh");
        var index =  $div_li.index(this);
        $("div.h-module-1 > div")
            .eq(index).show()
            .siblings(".h-module-content").hide();
    });
});







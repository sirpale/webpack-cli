/**
 * @fileOverview openwin
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/7/3 DEAN. All Rights Reserved.
 * Created by Administrator on 2017/7/3.
 */


define([
    '../core/control'
],function(){

    var $openwin =  {
        init : function ($obj) {
            var $this = this;

            $obj.find('a').each(function(){
                var $that = $(this);

                $this.openWindow($that, $that.attr('data-url'), 816, 664);

            });

        },
        openWindow : function ($obj,$url,$w, $h) {

            $obj.on('click',function(){
                window.open(
                    $url,
                    'newwindow',
                    'height=' + $h + ', width=' + $w + ', top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no'
                );
            });

        }
    };

    return $openwin;

});

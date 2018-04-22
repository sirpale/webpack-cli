/**
 * @fileOverview 网吧点评
 * @author Sirpale
 * @version 0.0.1
 * @copycright Copyright 2017/3/29 DEAN. All Rights Reserved.
 * Created by Sirpale on 2017/3/29.
 */

define(['./core/control'],function(){
    var $hrefPast = $("a.layui-btn-normal").attr("href");
	$(document).ajaxStop(function() {
		var $logFlag = $('.login-flag').val(),
            $bindingFlag = $('.third-binding-flag').val(),
			$aBtn=$("a.layui-btn-normal");

        if($logFlag == "1") {
            if($bindingFlag == "1") {
                $aBtn.each(function() {
                    $(this).attr("href", $hrefPast);
                });
            }else{
                $aBtn.each(function() {
                    var $href = $(this).attr("binding-href");
                    $(this).attr("href", $href);
                });
            }
        } else {
            $aBtn.each(function() {
                var $href = $(this).attr("login-href");
                $(this).attr("href", $href);
            });

        }
	});
	
	
	var $showmenu = $('.l-content-pasting .l-leader .showmenu');
	var $menu = $('.l-content-pasting .l-leader .menu');
	var $hrefPast = $("a.layui-btn-normal").attr("href");

	$showmenu.click(function() {
		$menu.show();
	}).mouseout(function() {
		var timer = setTimeout(function() {
			$menu.hide();
		}, 200);
		$menu.mouseover(function() {
			clearTimeout(timer);
			$menu.show();
		}).mouseout(function() {
			$menu.hide();
		});
	});
	
	pastLink();
	function pastLink(){
		
			var $href=location.href;
			
			while($href.substring($href.length-1,$href.length)=="/"){
				$href=$href.substring(0,$href.length-1);
			}

			var $hrefArr=$href.split("/");
			
			var $index=$hrefArr.indexOf("topic");
			
			
			var $length=$hrefArr.length-1-$index;
			
			var $href1="";
			
			if($length<=1){
				$href1=$href+"/new/0/0";
			}else if($length==2){
				$href=$href.substring(0,$href.lastIndexOf("/"));
				$href1=$href+"/new/0/0";
			}else if($length==4){
				$href1=$href;
				var i=0;
				while(i<3){
					$href=$href.substring(0,$href.lastIndexOf("/"));
					i++;
				}
			}else{
				$href=$href.substring(0,$href.lastIndexOf("/"));
				$href1=$href;
				var i=0;
				while(i<3){
					$href=$href.substring(0,$href.lastIndexOf("/"));
					i++;
				}
			}
		
			$hrefArr=$href1.split("/topic/")[1].split("/");
			
			var $arry=[$hrefArr[1],$hrefArr[2],$hrefArr[3]];
			

			$(".leader-type .filter").each(function(){
				var $filter = $(this).data("filter");
				if($filter==$arry[0]){
					$(this).addClass("active").siblings().removeClass("active");
				}
				$(this).attr("href",$href+"/"+$filter+"/"+$arry[1]+"/"+$arry[2]);
			});
			

			$(".leader-type .more-order .order").each(function(){
				var $order = $(this).data("order");
				if($order==$arry[1]){
					$(this).addClass("active").siblings().removeClass("active");
				}
				$(this).attr("href",$href+"/"+$arry[0]+"/"+$order+"/"+$arry[2]);
			});
			
			
			$(".leader-type .more-time .time").each(function(){
				var $time = $(this).data("time");
				if($time==$arry[2]){
					$(this).addClass("active").siblings().removeClass("active");
				}
				$(this).attr("href",$href+"/"+$arry[0]+"/"+$arry[1]+"/"+$time);
			});

		}

});


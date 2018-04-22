import './core/control';

//隐藏search
$('.search').hide();

//返回清单显示
$(".toptb .back").mouseover(function() {
	$(".back_menu").show();
}).mouseout(function() {
	var timer = setTimeout(function() {
		$(".back_menu").hide();
	}, 200);
	$(".back_menu").mouseover(function() {
		clearTimeout(timer);
		$(".back_menu").show();
	}).mouseout(function() {
		$(".back_menu").hide();
	});
});

//选择清单显示
$(".sel_right .quick").mouseover(function() {
	$(".quick_sch_menu").show();
}).mouseout(function() {
	var timer = setTimeout(function() {
		$(".quick_sch_menu").hide();
	}, 200);
	$(".quick_sch_menu").mouseover(function() {
		clearTimeout(timer);
		$(".quick_sch_menu").show();
	}).mouseout(function() {
		$(".quick_sch_menu").hide();
	});
});



//搜索
var $key="";
var $arry=[];
if(location.href.indexOf("?")!=-1){
	if(location.href.indexOf("&")!=-1){
		$arry=location.href.split("?")[1].split("&");
		for(var i=0;i<$arry.length;i++){
			if($arry[i].split("=")[0]=='key'){
				$key=$arry[i].split("=")[1];
			}
		}
	}else{
		$arry=location.href.split("?")[1].split("=");
		if($arry[0]=="key"){
			$key=$arry[1];
		}
	}
}

var $searchBtn = $(".search_input").find("a"),
	$searchInput = $(".search_input").find("input"),
	$href = $searchBtn.attr('href'),
	$Rhref = $searchBtn.attr('data-href'),
	$Href=$searchBtn.attr('href');
	
	
$searchInput.val(decodeURI($key));

$searchBtn.attr("href", $Rhref + "?key=" + $searchInput.val());
$(document).keydown(function(e) {
	var e = e || window.event;
	if(e.keyCode == 13) {
		window.location.href = $Rhref + "?key=" + $searchInput.val();
	}
});


function task() {
	var $searchBtn = $(".search_input").find("a"),
		$searchInput = $(".search_input").find("input"),
		$href = $searchBtn.attr('href'),
		$Rhref = $searchBtn.attr('data-href'),
		$searchKey = $searchInput.val();

	if(!$searchKey) {
		$searchBtn.attr("href", $Href);

		$(document).keydown(function(e) {
			var e = e || window.event;
			if(e.keyCode == 13) {
				window.location.href = $Href;
			}
		});

	} else {
		$searchBtn.attr("href", $Rhref + "?key=" + $searchKey);
		$(document).keydown(function(e) {
			var e = e || window.event;
			if(e.keyCode == 13) {
				window.location.href = $Rhref + "?key=" + $searchKey;
			}
		});
	}
}

$searchInput.keyup(function(){
        task();
});




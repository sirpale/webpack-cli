import './core/control';

//隐藏search
$('.search').hide();

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

var $searchInput = $(".search_input").find("input");
var $searchBtn=$(".search").find("a");
var $Href=$searchBtn.attr('href');

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
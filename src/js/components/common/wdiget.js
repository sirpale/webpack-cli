/*
 * 组件
 *
 * */

(function ($) {

    // 轮播组件
    $.fn.side = function (options) {

        $.fn.side.defaults = {
            effect: 'fade',
            prevCell: '.prev',
            nextCell: '.next',
            childCell: '.hd li',
            indexCon: '.hd-index',
            autoPlay: true
        };


        return this.each(function () {

            var $opts = $.extend($.fn.side.defaults, options),
                $silder = $(this),
                // 效果
                $effect = $opts.effect,
                // 上一个
                $prevBtn = $($opts.prevCell, $silder),
                // 下一个
                $nextBtn = $($opts.nextCell, $silder),
                // 子元素
                $childCell = $($opts.childCell, $silder),
                // 子元素个数
                $childLen = $childCell.length,
                // 索引容器
                $indexCon = $($opts.indexCon, $silder),
                // 自动播放
                $autoPlay = $opts.autoPlay ? $opts.autoPlay : false,
                $timer;

            // 添加索引
            for (var i = 0; i < $childLen; i++) {
                $indexCon.append('<a href="javascript:void(0);" class="' + (i == 0 ? 'active' : '') + '">' + (i + 1) + '</a>')
            }

            $indexCon.find('a').each(function ($index) {
                var $this = $(this);
                $this.on('click', function () {
                    $this.addClass('active').siblings('a').removeClass('active');
                    $childCell.eq($index).fadeIn(300).siblings().fadeOut(300);
                });
            });

            // 自动播放
            clearInterval($timer);
            if ($autoPlay) {
                $timer = setInterval(function () {
                    _doPlay();
                }, 3000);
            }

            // 停止播放
            $silder.hover(function(){
                clearInterval($timer);
            },function(){
                $timer = setInterval(function(){
                    _doPlay();
                },3000);
            });

            function _doPlay() {
                var $num;
                $indexCon.find('a').each(function($index){
                    var $this = $(this);
                    if($this.is('.active')) $num = $index;
                });
                $num++;
                if($num >= $childLen) $num = 0;
                $indexCon.find('a').eq($num).addClass('active').siblings('a').removeClass('active');
                $childCell.eq($num).fadeIn(300).siblings().fadeOut(300);
            }
        });
    };

})(jQuery);



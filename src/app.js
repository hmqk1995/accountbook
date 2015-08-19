'use strict';
$(function(){
//START
console.log('Hello World!');
var $addPage = $('#add_page'),
	$accountItems = $('.account_list .account_item');

// 禁用默认滑动
$('body')[0].addEventListener('touchmove', function(e){
	e.preventDefault();
});

// 首页－记一笔按钮
$('#home_add').on('tap', function(){
	$addPage.css('display','block');
});

// 首页－选项按钮
$('#home_option').on('tap', function(){
	$('#nav_bar').toggle();
})

// 添加页－关闭按钮
$('#add_close').on('tap', function(){
	$addPage.css('display', 'none');
});

// 首页－每个帐目item
$accountItems.on('swipeLeft', function(){
	$(this).addClass('swipeLeft');
});
$accountItems.on('swipeRight', function(){
	$(this).removeClass('swipeLeft');
});

/***
 *  计算器输入
 ***/
function calculate(){
	var $amount = $('#input_mount');
	
}
//END
});
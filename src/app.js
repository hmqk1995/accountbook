'use strict';
$(function(){
//START

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

/****
 *  计算器
 ***/

function Calculator(){
	// 初始化金额数为0
	var inputMount = document.getElementById('input_mount');
	inputMount.innerHTML = '0';

	this.val1          = 0;
	this.val2          = 0;
	this.isCalculating = false;
}

Calculator.prototype.inputNumber = function(number) {
	var $html = $amount.html();
	if ($html[0][0] === '0') {
		$html = '';
	}
	// 如果之前没有按过求值键
	if(this.isCalculating === false) {
		$amount.html($html + number);
		return;
	} else if(this.isCalculating === true){
		this.val1 = $html;
		$amount.html(number);
		this.isCalculating = false;
	}
};

Calculator.prototype.add = function() {
	this.val2 = this.val1;
	console.log(this.val2, this.val1);
	this.isCalculating = true;
	// 先执行之前的求值

	// 将之前输入的数字保存到一个变量
	this.val1 = $amount.html() + this.val2;
	console.log(calculator);
	// 输入数字
};

Calculator.prototype.euqal = function() {
	//求值
}


// 新的对象实例
var calculator = new Calculator();

// 获取显示器
var $amount = $('#input_mount');

// 获取计算器面板
var $cPanel = $('.calculator');

// 给按钮绑定事件
var $cPanelChildren = $cPanel.children();
$cPanelChildren.map(function(){

	// 取出标签中html内容并转换为字符串
	var html = $(this).html() + '';
	if (html !== '+' && html !== '-' && html !== 'x' && html !== '.' && html !== 'C' && html !== '='){
		$(this).on('tap', function(){
			calculator.inputNumber(html);
		});
	} else if (html === '+'){
		$(this).on('tap', function(){
			calculator.add();
			console.log('added');
		});
	} else {
		return false;
	}
});

//END
});
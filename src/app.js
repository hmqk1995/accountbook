'use strict';
$(function(){
//START

var $addPage = $('#add_page'),
	$accountItems = $('.account_list .account_item'),
	colorClass = 'icon_blue';	// 获取添加的对象的颜色类 用于添加页－每一个收入／支出选项按钮

// 禁用默认滑动
$('body')[0].addEventListener('touchmove', function(e){
	e.preventDefault();
});

// 首页－记一笔按钮
$('#home_add').on('tap', function(){
	$addPage.removeClass('easein2').addClass('pageLeft easeout2');
});

// 首页－选项按钮
$('#home_option').on('tap', function(){
	var $navbar = $('#nav_bar');
	if ($navbar.css('display') === 'none') { 
		$navbar.show().css('opacity','1');
		return;
	}
	$navbar.css('opacity','0');
	setTimeout(function(){
		$navbar.hide();
	}, 120);
})

// 首页－每个帐目item
$accountItems.on('swipeLeft', function(){
	$(this).removeClass('easein').addClass('swipeLeft easeout');
});
$accountItems.on('swipeRight', function(){
	$(this).addClass('easein').removeClass('swipeLeft easeout');
});

// 首页－向左滑动删除按钮
$('.button_delete').on('tap', function(){
	$(this).parent().parent().hide();
});

// 添加页－关闭按钮
$('#add_close').on('tap', function(){
	$addPage.addClass('easein2').removeClass('pageLeft easeout2');
});

// 添加页－每一个收入／支出选项按钮
$('#add_account_list').on('tap', function(e){
	console.log(e.target.tagName.toLowerCase());

	if (e.target.className.indexOf('icon ') > -1 || e.target.tagName.toLowerCase() === 'i') {
		var $this = $(e.target).parent(),
			$i    = $('#account_input #input_show i'),
			$icon = $('#account_input .icon'),
			color = $this.children('.icon').css('background').split(' none')[0];

		colorClass = $this.children('.icon')[0].className.split(' ')[1];

		console.log('$(e.target)', $(e.target));
		console.log('$this', $this);
		console.log($this.children('i').html());
		console.log('colorClass', colorClass);

		$i.html($this.children('i').html());
		$icon.html($this.children('.icon').html());
		$icon.css('color', color);

		$('#account_input').removeClass('easein').addClass('panelToTop easeout');
		return colorClass;
	}
	e.preventDefault();
	$('#account_input').addClass('easein').removeClass('panelToTop easeout');
	return;
});

// 添加页－发布按钮
$('#add_publish').on('tap', function(){

	var $ul = $('section.account_list ul'),
		icon = $('#input_show .icon').html(),
		text = $('#input_show i').html(),
		amount = ($('#input_mount').html() - 0).toFixed(2),
		type = (text !== '收入') ? 'minus' : 'add',
		color = colorClass;

	var storeList = {
	 	icon:   icon,
	 	color:  color,
	 	text:   text,
	 	type:   type,
	 	amount: amount
 	};

 	accounts.storeLists.push(storeList);

	$ul.append(accounts.add(accounts.storeLists[accounts.storeLists.length - 1]));
	// 绑定事件
	var $last = $ul.children().last();
	var $deleteBtn = $last.children('.account_edit').children('.button_delete');
	console.log($deleteBtn);
	$last.on('swipeLeft', function(){
		$(this).removeClass('easein').addClass('swipeLeft easeout');
	});
	$last.on('swipeRight', function(){
		$(this).addClass('easein').removeClass('swipeLeft easeout');
	});
	$deleteBtn.on('tap', function(){
		$(this).parent().parent().hide();
	});
	$addPage.addClass('easein2').removeClass('pageLeft easeout2');

});

/****
 *  计算器
 ***/

//  计算器按钮效果
$('#calculator i').on('touchstart', function() {
	$(this).css({
		'background':'#818181',
		'color':'#f8f8f8'
	});
});

$('#calculator i').on('touchend', function() {
	$(this).removeAttr('style');
});

function Calculator(){
	// 初始化金额数为0
	var inputMount = document.getElementById('input_mount');
	inputMount.innerHTML = '0';

	this.amount        = 0;
	this.number        = 0;
	this.calButtonOn   = false;
	this.isCalculating = false;
}

Calculator.prototype.inputNumber = function(number) {
	this.calButtonOn   = false;
	
	var $html = $amount.html();
	if ($html[0][0] === '0') {
		$html = '';
	}
	// 如果之前没有按过求值键
	if(this.isCalculating === false) {
		$amount.html($html + number);
		this.number = +$amount.html();
		return;
	} else if(this.isCalculating === true){
		$amount.html(number);
		this.number = +$amount.html();
		this.isCalculating = false;
		return;
	}
};

Calculator.prototype.add = function() {
	if(this.calButtonOn === false) {
		this.isCalculating = true;
		// 将之前输入的数字保存到一个变量
		this.amount = +$amount.html() + this.amount;
		$amount.html(this.amount);
	}
	
	this.calButtonOn   = true;
};

Calculator.prototype.equal = function() {
	// 求值
}

Calculator.prototype.reset = function() {
	// 清零
	this.amount        = 0;
	this.number        = 0;
	this.calButtonOn   = false;
	this.isCalculating = false;
	$amount.html(this.amount);
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

		// 按数字键
		$(this).on('tap', function(){
			calculator.inputNumber(html);
			console.log(calculator);
		});

	} else if (html === '+'){

		// 按加号
		$(this).on('tap', function(){
			calculator.add();
			// 显示数字
			console.log('added');
			console.log(calculator);
		});

	} else if (html === 'C'){

		// 按清零
		$(this).on('tap', function(){
			calculator.reset();
		});

	} else if (html === '='){

		// 按等于号
		$(this).on('tap', function(){
			calculator.equal();
			console.log(calculator);
		});
	} else {
		return false;
	}
});

/***
 *  项目增删查改
 ***/

 // 数据模版


// <li class="account_item">
// 	<span class="icon icon_green">&#xe613;</span>
// 	<span class="account_item_txt">收入</span>
// 	<span class="count add"><i class="icon">&#xe602;</i>766.50</span>
// 	<div class="account_edit icon">
// 		<i class="button_edit">&#xe611;</i>
// 		<i class="button_delete">&#xe610;</i>
// 	</div>
// </li>

// 数据
 var accounts        = {};
 accounts.storeLists = [
 {
 	icon:   '&#xe613;',
 	color:  'icon_green',
 	text:   '收入',
 	type:   'add',
 	amount: '766.50'
 },{
 	icon:   '&#xe613;',
 	color:  'icon_green',
 	text:   '收入',
 	type:   'minus',
 	amount: '766.50'
 }];
 accounts.add = function (storeList) {
 	if (storeList.type === 'add') {
 		var icon      = '&#xe602;',
 			iconClass = 'add';
 	} else {
 		var icon      = '&#xe603;',
 			iconClass = 'minus';
 	}

 	var str =	'<li class="account_item">' + 
					'<span class="icon '+ storeList.color + '">' + storeList.icon + '</span>' +
					'<span class="account_item_txt">' + storeList.text + '</span>' +
					'<span class="count '+ iconClass + '">' + 
						'<i class="icon">' + icon + '</i>' + storeList.amount + 
					'</span>' +
					'<div class="account_edit icon">' +
						'\r<i class="button_edit">&#xe611;</i>' +
						'\r<i class="button_delete">&#xe610;</i>' +
					'\r</div>' +
				'</li>';


	accounts.storeLists.push();
	console.log(accounts.storeLists);
	return str;
 }


//END
});
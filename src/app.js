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

/*  计算器对象(12月添加)
 *
 *
 */
function Calculator() {
	// 当前面板视图
	this.panel = 0;
	// 数字模型1
	this._num1 = 0;
	// 数字模型2
	this._num2 = 0;
	// 计算状态
	this._sign = '+';
	// 前一次是否按下了计算符号键
	this.isCaling = false;

}

//  计算方法
//  doCal('计算符号(=-/*)')
Calculator.prototype = {
	// 做运算
	doCal: function(sign) {
		// 输入非法符号直接返回
		if (sign !== '+' && sign !== '-' && sign !== 'x' && sign !== '=') return;
		// 没有启动计算状态时
		if (this.isCaling === false) {
			// 将当前视图数字保存到模型1
			this._num1 = parseFloat(this.panel);
			// 将当前计算符号保存到计算状态
			this._sign = sign;
			// 开启运算状态
			this.isCaling = true;
			this.panel = 0;
			// 返回
			return this.panel;
		}
		// 启动了运算状态时
		if (this.isCaling === true) {
			// 将当前视图数字保存到模型2
			this._num2 = parseFloat(this.panel);
			// 完成上一次的运算(现在的面板视图数字与之前保存的数字进行运算，同时保存这一次输入的运算符号)
			// 加法
			if (this._sign === '+') {
				this.panel = this._num1 + this._num2;
			}
			// 减法
			if (this._sign === '-') {
				this.panel = this._num1 - this._num2;
			}
			// 乘法
			if (this._sign === 'x') {
				this.panel = this._num1 * this._num2;
			}
			// 更新为现在的运算状态
			this._sign = sign;
			// 关闭运算状态
			this._num1 = parseFloat(this.panel);
			this.panel = 0;
			// 返回最新视图数据
			return this.panel;
		}
	},
	// 重置计算器
	reset: function() {
		// 状态清零
		this.panel = 0;
		this._num1 = 0;
		this._num2 = 0;
		this._sign = '+';
		this.isCaling = false;
	},
	// 输入数字
	input: function(input) {
		// 如果面板数字为0
		if (this.panel === 0) {
			if (input === '.') {
				this.panel += input;
			} else {
				this.panel += parseFloat(input);
			}
		// 如果已经输入了数字
		} else {
			if (input === '.') {
			//如果输入为小数点

				// 如果输入过小数点
				if (this.panel.toString().indexOf('.') > -1) {
					return;
				} else {
				// 如果没输入过
					this.panel += input;
				}
			} else {
			// 如果输入不是小数点
				this.panel += input.toString();
			}
		}
	},
	// 显示面板
	showPanel: function() {
		return this.panel;
	},
	// 等于
	equal: function() {
		this.doCal('=');
		this.isCaling = false;
		this.panel = this._num1;
		return this._num1;
	}
}

var calculator = new Calculator();

// 绑定计算器按钮事件
$('.calculator i').click(function(e){
	// 目标元素
	var target = e.target;
	// 目标元素的值
	var val = target.innerHTML.toString();

	if (val === 'C') {
		calculator.reset();
	}
	if (val === 'x' || val === '+' || val === '-') {
		calculator.doCal(val);
	} else if (val === '=') {
		calculator.equal();
	} else if (val !== 'C') {
		calculator.input(val);
	}
	$('#input_mount').html(calculator.showPanel());
	console.log(calculator, val);
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
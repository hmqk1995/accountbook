'use strict';
$(function(){
//START

var $addPage = $('#add_page'),
	$accountItems = $('.account_list .account_item'),
	colorClass = 'icon_red';	// 获取添加的对象的颜色类 用于添加页－每一个收入／支出选项按钮

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

// 首页 - 帐目图表
$('#tostatistic').on('tap', function(){
	$('#nav_bar').css('opacity','0').hide();
	$('#statistics').removeClass('easein2').addClass('pageLeft easeout2');

	var data = controller.countData();
	accounts.renderStatistic(data);
	console.log(data);

})

// 帐目图表－关闭按钮
$('#statistics_close').on('tap', function(){
	$('#statistics').addClass('easein2').removeClass('pageLeft easeout2');
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
	// 从视图中获取模型信息
	var $ul = $('section.account_list ul'),
		icon = $('#input_show .icon').html(),
		text = $('#input_show i').html(),
		amount = ($('#input_mount').html() - 0).toFixed(2),
		type = (text !== '收入') ? 'minus' : 'add',
		color = colorClass;
	// 得到模型对象
	var storeList = {
	 	icon:   icon,
	 	color:  color,
	 	text:   text,
	 	type:   type,
	 	amount: amount,
	 	date: new Date().toISOString().split('T')[0]
 	};
 	// 推入模型
 	accounts.add(storeList);
 	// 得到该项
 	var item = accounts.getLastItem();
 	// 生成html字符串
 	var str = accounts.makeHtml(item);
 	// 将字符串插入到视图
	$ul.append(str);

	// 绑定事件
	controller.bindEvents();

	// 移除页面
	$addPage.addClass('easein2').removeClass('pageLeft easeout2');

	// 更新localStorage
	controller.setStorage();

	// 清空计算器
	calculator.reset();
	$('#input_mount').html(0);

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
		var _this = this;
		// 状态清零
		_this.panel = 0;
		_this._num1 = 0;
		_this._num2 = 0;
		_this._sign = '+';
		_this.isCaling = false;
	},
	// 输入数字
	input: function(input) {
		// 等于号则清除面板数据
		console.log(this._sign);
		if (this._sign === '=') {
			this.panel = 0;
			this._sign = '+';
		}
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
$('.calculator i').on('tap', function(e){
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
 *  数据模型
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
// 数据格式
// {
// 	icon:   '&#xe615;',
// 	color:  'icon_orange',
// 	text:   '生活',
// 	type:   'minus',
// 	amount: '200.00'
// }
var accounts        = {};
accounts.storeLists = [
{
	icon:   '&#xe613;',
	color:  'icon_green',
	text:   '收入',
	type:   'add',
	amount: '888.88',
	date: new Date().toISOString().split('T')[0]
}];

// 统计页面数据模型
accounts.data = {
	// 总收入
	income: 0,
	// 总支出
	cost: 0,
	// 生活
	life: 0,
	// 交通
	transportation: 0,
	// 食物
	food: 0,
	// 教育
	education: 0,
	// 住宿
	accomdation: 0,
	// 其他
	others: 0
}

// 插入html字符串
accounts.makeHtml = function (storeList) {
	if (storeList.type === 'add') {
		var icon      = '&#xe602;',
			iconClass = 'add';
	} else {
		var icon      = '&#xe603;',
			iconClass = 'minus';
	}

	var str='<li class="account_item">' + 
				'<span class="icon '+ storeList.color + '">' + storeList.icon + '</span>' +
				'<span class="account_item_txt">' + storeList.text + '</span>' +
				'<span class="count '+ iconClass + '">' + 
					'<i class="icon">' + icon + '</i>' + storeList.amount + 
				'</span>' +
				'<div class="account_edit icon">' +
					'\r<i class="button_edit">&#xe611;</i>' +
					'\r<i class="button_delete">&#xe610;</i>' +
				'\r</div>' + 
				'<span class="account_time">' + storeList.date + '</span>' +
			'</li>';
	return str;
};

accounts.add = function (storeList) {
	// 将数据推入模型
	accounts.storeLists.push(storeList);
	console.log(accounts.storeLists);
};

// 得到lists的最后一项
accounts.getLastItem = function() {
	return accounts.storeLists[accounts.storeLists.length - 1];
};
// 得到lists
accounts.getLists = function() {
	return this.storeLists;
};
// 渲染图表页
accounts.renderStatistic = function(data) {
	$('#statistic_info .income').html(data.income.toFixed(2));
	$('#statistic_info .spend').html(data.cost.toFixed(2));
	$('#statistic_info .left').html((data.income - data.cost).toFixed(2));
	$('#engel').html((data.cost === 0 ? 100 : ((data.food / data.cost) * 100).toFixed(2)) + '%');

	(function(){
		// Get the context of the canvas element we want to select
		var ctx = document.getElementById('distribute').getContext('2d');
		var cData = {
			labels : ["生活","交通","食物","教育","住宿","其他"],
			datasets : [
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : [
						data.life / data.cost,
						data.transportation / data.cost,
						data.food / data.cost,
						data.education / data.cost,
						data.accomdation / data.cost,
						data.others / data.cost
					]
				}
			]
		};
		var myNewChart = new Chart(ctx);
		myNewChart.Radar(cData);		
	}());
};

/*********
 *  控制器
 *********/
function Controller () {

};
// 生成模型列表对应的html字符串
Controller.prototype = {
	// 计算数据
	countData: function() {
		var data = accounts.data;
		// 初始化
		data.income 		= 0;
		data.cost   		= 0;
		data.life   		= 0;
		data.transportation = 0;
		data.food 			= 0;
		data.education 		= 0;
		data.accomdation 	= 0;
		data.others 		= 0;
		// map数据数组中所有数据，如果为type===add，把amount加入到income后return;否则如果type===minus，判断type后加入到对应的数据中
		accounts.storeLists.map(function(item, index){
			if (item.type === 'add') {
				data.income += parseFloat(item.amount);
				return;
			}
			if (item.type === 'minus') {
				if (item.text === '生活') {
					data.life           += parseFloat(item.amount);
				} else if (item.text === '交通') {
					data.transportation += parseFloat(item.amount);
				} else if (item.text === '食物') {
					data.food           += parseFloat(item.amount);
				} else if (item.text === '教育') {
					data.education      += parseFloat(item.amount);
				} else if (item.text === '住宿') {
					data.accomdation    += parseFloat(item.amount);
				} else if (item.text === '其他') {
					data.others         += parseFloat(item.amount);
				}
			}
		});
		// 总支出
		data.cost = data.life + data.transportation + data.food + data.education + data.accomdation + data.others;
		return data;
	},
	// 渲染数据列表模板
	renderLists: function(accounts) {
		var lists = accounts.getLists();
		var htmls = [];
		// 循环处理每一项
		for (var i = 0; i < lists.length; i++) {
			htmls.push(accounts.makeHtml(lists[i]));
		};
		// 合并后插入到html
		var $ul = $('section.account_list ul');
		$ul.append(htmls.join(''));

		console.log(htmls);
	},
	// 绑定事件（检测如果绑定过事件则不绑定，未绑定则绑定）
	bindEvents: function() {
	/* 初始化
	 */
		var $accountItems = $('.account_list .account_item');
		var lists = accounts.getLists();

	 	$accountItems.each(function(index){

	 		if ($(this).attr('data-isBind') === 'true') return;

			// 首页－每个帐目item
			$(this).on('swipeLeft', function(e){
				$(this).removeClass('easein').addClass('swipeLeft easeout');
			});
			$(this).on('swipeRight', function(e){
				$(this).addClass('easein').removeClass('swipeLeft easeout');
			});
			// 删除按钮
			$(this).children('.account_edit').children('.button_delete').on('tap', function(){
				$(this).parent().parent().hide();
				// 从模型中删除该项
				lists.splice(index, 1);
				controller.setStorage();
				console.log(lists);
			});
		 	// 绑定事件属性为真
			$(this).attr('data-isBind', 'true');

	 	});
	},
	// 设置到localStorage
	setStorage: function() {
		localStorage.data = JSON.stringify(accounts.storeLists);
	},
	// 从localStorage取回
	fetchStorage: function() {
		if(localStorage.data) {
			accounts.storeLists = JSON.parse(localStorage.data);
		}
	}
};

var controller = new Controller();
// 同步localStorage
if(!localStorage.data) {
	controller.setStorage();
} else {
	controller.fetchStorage();
}
// 初始化渲染列表页
controller.renderLists(accounts);
// 初始化绑定事件
controller.bindEvents();
//END
});
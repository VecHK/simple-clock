"use strict";
(function (){
/* 起点坐标x，起点坐标y，角度k，长度ll */
function GetLine(x, y, k, ll){
	k = k/360 * Math.PI*2;
	this.duibian = Math.sin(k)*ll;
	this.linbian = Math.cos(k)*ll;
	this.x1 = x;
	this.y1 = y;
	this.x2 = x-this.duibian;
	this.y2 = y-this.linbian;
}

class displayInit{
	/* 设定半径（时针的长度） */
	setRadius(){
		this.radius = this[this.width > this.height ? 'height' : 'width'] / 2;
	}
	/* 重新设置窗口的长宽 */
	resetWindow(){
		/* 重新设置长宽 */
		this.canvas.width = this.canvas.parentElement.offsetWidth;
		this.canvas.height = this.canvas.parentElement.offsetHeight;

		/* 简便一点 */
		this.width = this.canvas.width;
		this.height = this.canvas.height;

		/* 屏幕中心点（也可以说圆心） */
		this.centre = {
			x: this.canvas.width / 2,
			y: this.canvas.height / 2,
		};

		this.setRadius();
	}
	initTime(){
		let freshTime = () => {
			let currentDate = new Date;
			this.time = {
				hour: currentDate.getHours(),
				min: currentDate.getMinutes(),
				sec: currentDate.getSeconds(),
			};

			this.time.min += this.time.sec / 60;
			this.time.hour += this.time.min / 60;
			return freshTime;
		};
		/* 也是一样先执行出来，不然得等1秒挺麻烦的 */
		setInterval(freshTime(), 1000);
	}
	/* 设定指针颜色 */
	initSetColor(){
		this._pointerColor = this.defaultPointerColor; /* 指针颜色的设定，默认来自 defaultPointerColor */

		/* 解决改色后不会立即刷新的问题 */
		Object.defineProperty(this, 'pointerColor', {
			get(){
				return this._pointerColor;
			},
			set(value){
				this._pointerColor = value;
				this.refresh();
			}
		});
	}
	init(obj){
		this.initSetColor();

		this.canvas = obj.canvas;

		this.resetWindow();

		this.ctx = this.canvas.getContext('2d');

		this.initTime();
	}

	constructor(obj){
		this.init(obj);

		/* 每次调整窗口大小的时候执行resetWindow */
		window.addEventListener('resize', this.resetWindow.bind(this));
		try{
			/* 先绘制出来，不然得等1秒的时间才看得到 */
			this.refresh.bind(this)();
			var interval = setInterval(this.refresh.bind(this), 1000);
		}catch(e){
			console.error(e);
		}
	}
}

class display extends displayInit{
	clear(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
	/* 指针样式， 指针宽度， 长度， 角度，*/
	drawPointer(style, width, length, k){
		let
		ctx = this.ctx,
		secp = new GetLine(this.centre.x, this.centre.y, -k * 360, length);

		ctx.beginPath();

		ctx.lineWidth = width;
		ctx.strokeStyle = style;
		ctx.moveTo(secp.x1, secp.y1);
		ctx.lineTo(secp.x2, secp.y2);

		ctx.stroke();

		ctx.closePath();
	}
	drawHour(){
		this.drawPointer( this.pointerColor, 6, this.radius*0.3, this.time.hour/12);
	}
	drawMintue(){
		this.drawPointer( this.pointerColor, 3, this.radius*0.4, this.time.min/60);
	}
	drawSecond(){
		this.drawPointer( this.pointerColor, 3, this.radius*0.5, this.time.sec/60);
	}
	refresh(){
		this.clear();

		this.drawSecond();
		this.drawMintue();
		this.drawHour();
	}
}

class vClock extends display{

}

vClock.prototype.version = "0.0.2";
vClock.prototype.defaultPointerColor = 'darkred';

window.vClock = vClock;

})();


//Game Functions
function startGame() {

	myGameArea.start();
	mySword = new sword(myGameArea.canvas.width/2,myGameArea.canvas.height/2,30,-300,0.3);
}

function updateGameArea() {
	myGameArea.clear();
	sMove();
}


//Game Area
var myGameArea = {

	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 1400;
		this.canvas.height = 775;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
	}, 
	clear : function() {
		this.context.clearRect(-this.canvas.width, -this.canvas.height, 2*this.canvas.width, 2*this.canvas.height);
	}
}


//Constructors
function sword(x, y, w, h, com_y) {
	this.x = x;
	this.y = y;
	this.r = 0;
	this.w = w;
	this.h = h;
	// com = Center of mass
	this.com = [0.5,com_y];
	this.click;
	ctx = myGameArea.context;
	ctx.translate(x, y);
	ctx.fillStyle = "FF0000";
	this.update = function(u, r) {
		//Mousemovement per Frame
		if (this.click !== undefined) {
			if (this.click.sx !== undefined) {
				this.click.dx = this.click.sx - this.click.fx
				this.click.dy = this.click.sy - this.click.fy
				this.click.fx = this.click.sx;
				this.click.fy = this.click.sy;
			}
		}

		//Coordiantes of entity
		if (this.r > 2 * Math.PI) {
			this.r -= 2* Math.PI;
		}
		this.r -= r;
		this.x += Math.sin(this.r) * u;
		this.y += Math.cos(this.r) * u;


		//Positioning and Drawing
		
		ctx.rotate(r);
  		ctx.translate(0 , u);
  		ctx.fillRect(-this.com[0] * this.w , -this.com[1] * this.h , this.w , this.h);
  	}
}


//Sword Move 
function sMove() {
	//check if mySword.click exists
	if (mySword.click !== undefined) {
		if (mySword.click.dx !== undefined) {
			//Handle position
			var x = Math.sin(mySword.r) * mySword.h * mySword.com[1];
			var y = Math.cos(mySword.r) * mySword.h * mySword.com[1];
			//new handle position and relative to com
			x += mySword.click.dx;
			y += mySword.click.dy;
			//change of distance from com
			var u = - Math.sqrt(x*x+y*y) + Math.abs(mySword.h * mySword.com[1]);
			//change of angle
			var r = - mySword.r + Math.atan(x/y);
			//return update function
			return mySword.update(u, r);
		} else {return mySword.update(0, 0)};
	} else {return mySword.update(0, 0)};
}


//Events
myGameArea.canvas.addEventListener("mousedown", myClick);
myGameArea.canvas.addEventListener("mousemove", myMove);
myGameArea.canvas.addEventListener("mouseout", myClear);
myGameArea.canvas.addEventListener("mouserelease", myClear);

function myClick(ev) {
	mySword.click = {
		button: ev.button,
		fx: ev.clientX,
		fy: ev.clientY
	}
}

function myMove(ev) {
	if (mySword.click !== undefined) {
		if (mySword.click.button == 0) {
			mySword.click.sx = ev.clientX;
			mySword.click.sy = ev.clientY;
		}
	}
}

function myClear(ev) {
	mySword.click = undefined;
}

startGame();

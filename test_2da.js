
//Game Functions
function startGame() {

	myGameArea.start();
	mouse = {
		fx: 0,
		fy: 0,
		sx: 0,
		sy: 0
	};
	mySword = new sword(myGameArea.canvas.width / 4, myGameArea.canvas.height / 4, 40, -400, 0.3);
	
};

function updateGameArea() {
	//Drawing updates
	myGameArea.clear();
	mySword.update();

	//Mousemovement per Frame
	mouse.fx = mouse.sx;
	mouse.fy = mouse.sy;
};


//Game Area
var myGameArea = {

	canvas : document.createElement("canvas"),
	fps: 80,
	start : function() {
		this.canvas.width = 1400;
		this.canvas.height = 775;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 1000/this.fps);
	}, 
	clear : function() {
		this.context.clearRect(-this.canvas.width, -this.canvas.height, 2*this.canvas.width, 2*this.canvas.height);
	}
};


//Constructors
function sword(x, y, w, h, com_y) {
	this.x = x;
	this.y = y;
	this.r = 0;
	this.w = w;
	this.h = h;
	this.v = {
		x: 0,
		y: 0,
		max: 30	
	};

	// com = Center of mass
	this.com = [0.5,com_y];
	let parent = this;

    attType = myGameArea.context;
	attType.font = "30px Arial";

	ctx = myGameArea.context;
	ctx.translate(x, y);
	ctx.fillStyle = "FF0000";

	this.update = function() {
		//Change in Coordiantes of entity
		sMove(parent);
		
		//Positioning and Drawing
		ctx.save();
  		ctx.translate(this.x, this.y);
		ctx.rotate(this.r);
  		ctx.fillRect(- this.com[0] * this.w , - this.com[1] * this.h , this.w , this.h);
  		ctx.restore();
  	};

  	this.attack = function(direction) {
		if (direction >= 0.8 && vectorLength(this.v.x, this.v.y) >= this.v.max / 2) {
			attType.fillText("slash", -300, -130);
		} else if (direction <= - 0.85) {
			attType.fillText("stab", -300, -130);
		} else {attType.fillText(null, -300, -130);};
	};
};

//Sword Move 
function sMove(parent) {

	
	//unitvector of mouse position change
	dx = checkDevisionByZero(mouse.sx - mouse.fx, vectorLength(mouse.sx - mouse.fx, mouse.sy - mouse.fy));
	dy = checkDevisionByZero(mouse.sy - mouse.fy, vectorLength(mouse.sx - mouse.fx, mouse.sy - mouse.fy));

	//acceleration (a); time until max velocity is reached (t)
	t = 0.4;
	a = parent.v.max / (myGameArea.fps * t);

	//change velocity vector
	parent.v.x = mouse.button == 0 && Math.abs(dx) > 0 ? parent.v.x + dx * a :
		roundToZero(parent.v.x ,checkDevisionByZero(- parent.v.x * a, vectorLength(parent.v.x, parent.v.y), - parent.v.x));
	parent.v.y = mouse.button == 0 && Math.abs(dy) > 0 ? parent.v.y + dy * a :
		roundToZero(parent.v.y ,checkDevisionByZero(- parent.v.y * a, vectorLength(parent.v.x, parent.v.y), - parent.v.y));

	//check max velocity
	if (vectorLength(parent.v.x, parent.v.y) > parent.v.max) {
		parent.v.x *= parent.v.max / vectorLength(parent.v.x, parent.v.y);
		parent.v.y *= parent.v.max / vectorLength(parent.v.x, parent.v.y);
	};

 	// hx, hy Handle Position; nhx, nhy new Handle position
	hx = Math.sin(parent.r) * parent.h * parent.com[1] + parent.x;
	hy = - Math.cos(parent.r) * parent.h * parent.com[1] + parent.y;
	nhx = hx + parent.v.x;
	nhy = hy + parent.v.y;

	//Find new com Position in new x (nx) and new y (ny)
	nx = nhx - (nhx - parent.x) * vectorLength(hx - parent.x, hy - parent.y) / vectorLength(nhx - parent.x, nhy - parent.y);
	ny = nhy - (nhy - parent.y) * vectorLength(hx - parent.x, hy - parent.y) / vectorLength(nhx - parent.x, nhy - parent.y);
	
	//Find new angle in new r (nr)
	if (nhx - nx <= 0) {
		nr = Math.acos((nhy - ny) / vectorLength(nhx - nx, nhy - ny)); 
	} else {
		nr = - Math.acos((nhy - ny) / vectorLength(nhx - nx, nhy - ny));
	};

	//Check for attack	
	// dir is cos of angle between mouse movement and Handle vector
	dir = (parent.v.x * (hx - parent.x) + parent.v.y * (hy - parent.y))
		/ (vectorLength(parent.v.x, parent.v.y) * vectorLength(hx - parent.x, hy - parent.y));

	//update Positon and Rotation	
	if (dir <= - 0.85) {
		//in case stab
		parent.x += dir * vectorLength(parent.v.x, parent.v.y) * (hx - parent.x) / vectorLength(hx - parent.x, hy - parent.y);
		parent.y += dir * vectorLength(parent.v.x, parent.v.y) * (hy - parent.y) / vectorLength(hx - parent.x, hy - parent.y);
	} else if (nr < - 0.5 * Math.PI || nr > 0.7 * Math.PI) {
		//in case max rotation
		parent.x += parent.v.x * 0.8;
		parent.y += parent.v.y * 0.8;
	} else {
		parent.x = nx;
		parent.y = ny;
		parent.r = nr;
	};

	//check for attack
	parent.attack(dir);
};


//Events
myGameArea.canvas.addEventListener("mousedown", myClick);
myGameArea.canvas.addEventListener("mousemove", myMove);
myGameArea.canvas.addEventListener("mouseout", myClear);
myGameArea.canvas.addEventListener("mouseup", myClear);

function myClick(ev) {
	mouse.button = ev.button;
};

function myMove(ev) {
	mouse.sx = ev.clientX;
	mouse.sy = ev.clientY;
};

function myClear(ev) {
	mouse.button = null;
};

//Utility functions
function vectorLength (x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

function checkDevisionByZero (dividend, divisor, ifZero) {
	ifZero = ifZero || 0;
	return quotient = Math.abs(divisor) > 0 ? dividend / divisor : ifZero;
};

function roundToZero (value, change) {
	return difference = Math.abs(change) > Math.abs(value) ? 0 : value + change; 
};


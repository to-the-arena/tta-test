
//Game Functions
function startGame() {

	myGameArea.start();
	mouse = {
		fx: 0,
		fy: 0,
		sx: 0,
		sy: 0
	};
	mySword = new sword(myGameArea.canvas.width / 4, myGameArea.canvas.height / 4, 30, -300, 0.3);
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
};


//Constructors
function sword(x, y, w, h, com_y) {
	this.x = x;
	this.y = y;
	this.r = 0;
	this.w = w;
	this.h = h;
	let parent = this;
	// com = Center of mass
	this.com = [0.5,com_y];
	ctx = myGameArea.context;
	ctx.translate(x, y);
	ctx.fillStyle = "FF0000";
	this.update = function() {

		//Coordiantes of entity
		sMove(parent);
		

		//Positioning and Drawing
		ctx.save();
  		ctx.translate(parent.x, parent.y);
		ctx.rotate(parent.r);
  		ctx.fillRect(- parent.com[0] * parent.w , - parent.com[1] * parent.h , parent.w , parent.h);
  		ctx.restore();
  	}
};


//Sword Move 
function sMove(parent) {
	//Find new com Position in new x (nx) and new y (ny)
	// hx, hy Handle Position nhx, nhy new Handle position
	hx = (Math.sin(parent.r) * parent.h * parent.com[1]) + parent.x;
	hy = - (Math.cos(parent.r) * parent.h * parent.com[1]) + parent.y;
	nhx = hx + mouse.sx - mouse.fx;
	nhy = hy + mouse.sy - mouse.fy;

	nx = nhx - (nhx - mySword.x) * Math.sqrt(Math.pow(hx - mySword.x , 2) + Math.pow(hy - mySword.y , 2)) / Math.sqrt(Math.pow(nhx - mySword.x , 2) + Math.pow(nhy - mySword.y , 2));
	ny = nhy - (nhy - mySword.y) * Math.sqrt(Math.pow(hx - mySword.x , 2) + Math.pow(hy - mySword.y , 2)) / Math.sqrt(Math.pow(nhx - mySword.x , 2) + Math.pow(nhy - mySword.y , 2));
	
	//Find new angle in new r (nr)
	if (nhx - nx <= 0) {
		nr = Math.acos((nhy - ny) / Math.sqrt(Math.pow(nhx - nx , 2) + Math.pow(nhy - ny , 2)));
	} else {
		nr = - Math.acos((nhy - ny) / Math.sqrt(Math.pow(nhx - nx , 2) + Math.pow(nhy - ny , 2)));
	};

	//update Positon and Rotation
	if (mouse.button == 0) {	
		if (nr < - 0.5 * Math.PI || nr > 0.7 * Math.PI) {
			parent.x = mySword.x + mouse.sx - mouse.fx;
			parent.y = mySword.y + mouse.sy - mouse.fy;
		} else {
			parent.x = nx;
			parent.y = ny;
			parent.r = nr;
		};
	};
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

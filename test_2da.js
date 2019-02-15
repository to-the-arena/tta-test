
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
	fps: 50,
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
		l: 0,
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
		if (direction >= 0.8 && this.v.l >= this.v.max / 2) {
			attType.fillText("slash", -300, -130);
		} else if (direction <= - 0.85) {
			attType.fillText("stab", -300, -130);
		} else {attType.fillText(null, -300, -130);};
	};
};

//Sword Move 
function sMove(parent) {

	if (mouse.button == 0 && (mouse.sx != mouse.fx || mouse.sy != mouse.fy)) {
		// unitvector of mouse position change
		dx = (mouse.sx - mouse.fx) / Math.sqrt(Math.pow(mouse.sx - mouse.fx, 2) + Math.pow(mouse.sy - mouse.fy, 2));
		dy = (mouse.sy - mouse.fy) / Math.sqrt(Math.pow(mouse.sx - mouse.fx, 2) + Math.pow(mouse.sy - mouse.fy, 2));

		//acceleration (a); time until max velocity is reached (t)
		t = 1;
		a = myGameArea.fps * t;

		//change velocity
		if (parent.v.l <= parent.v.max && parent.v.l >= 0) {
			if (Math.sqrt(Math.pow(mouse.sx - mouse.fx, 2) + Math.pow(mouse.sy - mouse.fy, 2)) > parent.v.l) {
				parent.v.l += parent.v.max / a;
			} else {
				parent.v.l -= parent.v.max / a;
			};
		} else {
			parent.v.l -= parent.v.l % parent.v.max
		};

		dx *= parent.v.l;
		dy *= parent.v.l;
		
	 	// hx, hy Handle Position; nhx, nhy new Handle position
		hx = Math.sin(parent.r) * parent.h * parent.com[1] + parent.x;
		hy = - Math.cos(parent.r) * parent.h * parent.com[1] + parent.y;
		nhx = hx + dx;
		nhy = hy + dy;

		//Find new com Position in new x (nx) and new y (ny)
		nx = nhx - (nhx - parent.x) * Math.sqrt(Math.pow(hx - parent.x , 2) + Math.pow(hy - parent.y , 2)) / Math.sqrt(Math.pow(nhx - parent.x , 2) + Math.pow(nhy - parent.y , 2));
		ny = nhy - (nhy - parent.y) * Math.sqrt(Math.pow(hx - parent.x , 2) + Math.pow(hy - parent.y , 2)) / Math.sqrt(Math.pow(nhx - parent.x , 2) + Math.pow(nhy - parent.y , 2));
		
		//Find new angle in new r (nr)
		if (nhx - nx <= 0) {
			nr = Math.acos((nhy - ny) / Math.sqrt(Math.pow(nhx - nx , 2) + Math.pow(nhy - ny , 2)));
		} else {
			nr = - Math.acos((nhy - ny) / Math.sqrt(Math.pow(nhx - nx , 2) + Math.pow(nhy - ny , 2)));
		};

		//Check for attack
		if ((dx != 0 || dy != 0) && mouse.button == 0) {	
			// dir is angle between mouse movement and Handle vector
			dir = (dx * (Math.sin(parent.r) * parent.h * parent.com[1] + dx) + dy * ( - Math.cos(parent.r) * parent.h * parent.com[1] + dy)) / (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * Math.sqrt(Math.pow(Math.sin(parent.r) * parent.h * parent.com[1] + dx, 2) + Math.pow( - Math.cos(parent.r) * parent.h * parent.com[1] + dy, 2)));
		};

		//update Positon and Rotation	
		if (dir <= - 0.85) {
			//in case stab
			parent.x += dir * Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * (hx - parent.x) / Math.sqrt(Math.pow(hx - parent.x, 2) + Math.pow(hy - parent.y, 2));
			parent.y += dir * Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) * (hy - parent.y) / Math.sqrt(Math.pow(hx - parent.x, 2) + Math.pow(hy - parent.y, 2));
		} else if (nr < - 0.5 * Math.PI || nr > 0.7 * Math.PI) {
			//in case max rotation
			parent.x += dx;
			parent.y += dy;
		} else {
			parent.x = nx;
			parent.y = ny;
			parent.r = nr;
		};

		//check for attack
		parent.attack(dir);
	} else if (parent.v.l > 0) {
		
		parent.v.l -= parent.v.max / a;
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


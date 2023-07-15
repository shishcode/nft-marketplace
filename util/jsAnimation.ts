export function startAnimation(canvas: HTMLCanvasElement) {
    /* Click to the attract the snake bugs */

var a = document.getElementById( 'c' ),
c = a.getContext( '2d' );

var chains = [],
chainCount = 50,
entityCount = 8,
w = a.width,
h = a.height,
cx = w / 2,
cy = h / 2,
mx = cx,
my = cy,
md = 0,
tick = 0,
maxa = 2,
maxv = 1,
avoidTick = 20,
avoidThresh = 50,
TWO_PI = Math.PI * 2;

function rand( min, max ) {
return Math.random() * ( max - min ) + min;
}

function Impulse() {
this.x = cx;
this.y = cy;
this.ax = 0;
this.ay = 0;
this.vx = 0;
this.vy = 0;
this.r = 1;
}

Impulse.prototype.step = function() {
this.x += this.vx;
this.y += this.vy;
if( this.x + this.r >= w || this.x <= this.r ) { this.vx = 0; this.ax = 0; }
if( this.y + this.r >= h || this.y <= this.r ) { this.vy = 0; this.ay = 0; }
if( this.x + this.r >= w ) { this.x = w - this.r; }
if( this.x <= this.r ) { this.x = this.r; }
if( this.y + this.r >= h ) { this.y = h - this.r; }
if( this.y <= this.r ) { this.y = this.r; }

if( md ) {
	let dx = this.x - mx;
	let dy = this.y - my;
	let dist = Math.sqrt(dx * dx + dy * dy);
	dist = rand(50, 150);
	let angle = Math.atan2(dy, dx) - Math.PI / 2;
	let frac = 0.02;
	this.vx -= Math.cos(angle) * dist * frac;
	this.vy -= Math.sin(angle) * dist * frac;
	
	
	let dx2 = this.x - mx;
	let dy2 = this.y - my;
	let dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
	let angle2 = Math.atan2(dy2, dx2);
	let frac2 = 0.01;
	this.vx -= Math.cos(angle2) * dist2 * frac2;
	this.vy -= Math.sin(angle2) * dist2 * frac2;
	
	
	
	//this.vx += ( mx - this.x ) * 0.03;
	//this.vy += ( my - this.y ) * 0.03;
}// else {
	let angle = rand(0, 1) * Math.PI;
	let magnitude = rand(-0.4, 0.4);
	this.ax += Math.cos(angle) * magnitude;
	this.ay += Math.sin(angle) * magnitude;
//}


// let angle = rand(0, 1) * Math.PI;
// let magnitude = rand(-0.4, 0.4);
// this.ax += Math.cos(angle) * magnitude;
// this.ay += Math.sin(angle) * magnitude;


// this.ax += rand( -0.4, 0.4 );
// this.ay += rand( -0.4, 0.4 );
this.vx += this.ax;
this.vy += this.ay;
this.ax *= Math.abs( this.ax ) > maxa ? 0.75 : 1;
this.ay *= Math.abs( this.ay ) > maxa ? 0.75 : 1;
this.vx *= Math.abs( this.vx ) > maxv ? 0.75 : 1;
this.vy *= Math.abs( this.vy ) > maxv ? 0.75 : 1;
};

function Chain() {
this.branches = [];
this.impulse = new Impulse();
this.branches.push( new Branch({
	chain: this,
	attractor: this.impulse
}));
}

Chain.prototype.step = function() {
this.impulse.step();
this.branches.forEach( function( branch, i ) {
	branch.step();
});

this.branches.forEach( function( branch, i ) {
	branch.draw();
});
};

function Branch( opt ) {
this.entities = [];
this.chain = opt.chain;
this.avoiding = 0;
var entity;
for( var i = 0; i < entityCount; i++ ) {
	entity = new Entity({
		branch: this,
		i: i,
		x: cx,
		y: cy,
		radius: 1 + ( entityCount - i ) / entityCount * 5,
		damp: 0.2,
		attractor: i === 0 ? opt.attractor : this.entities[ i - 1 ]
	});
	this.entities.push( entity );
}
}

Branch.prototype.step = function() {
var i = chains.length;
while( i-- ) {
	var impulse = this.chain.impulse,
		oImpulse = chains[ i ].impulse,
		dx = oImpulse.x - impulse.x,
		dy = oImpulse.y - impulse.y,
		dist = Math.sqrt( dx * dx + dy * dy );
	if( !md && impulse !== oImpulse && dist < avoidThresh ) {
		impulse.ax = 0;
		impulse.ay = 0;
		impulse.vx -= dx * 0.1;
		impulse.vy -= dy * 0.1;
		this.avoiding = avoidTick;
	}
}

this.entities.forEach( function( entity, i ) {
	entity.step();
});

if( this.avoiding > 0 ) {
	this.avoiding--;
}
};

Branch.prototype.draw = function() {
var self = this;
c.beginPath();
c.moveTo( this.entities[ 0 ].x, this.entities[ 0 ].y );
this.entities.forEach( function( entity, i ) {
	if( i > 0 ) {
		c.lineTo( entity.x, entity.y );
	}
});
c.strokeStyle = 'hsla(' + ( md ? 120 : ( self.avoiding ? 0 : 200 ) ) + ', 70%, 60%, 0.3)';
c.stroke();

this.entities.forEach( function( entity, i ) {
	c.save();
	c.translate( entity.x, entity.y );
	c.beginPath();
	c.rotate( entity.rot );
	if( entity.i === 0 ) {
		c.fillStyle = ( md ? '#6c6' : ( self.avoiding ? '#c66' : '#6bf' ) );
	} else {
		c.fillStyle = 'hsla(' + ( md ? 120 : ( self.avoiding ? 0 : 200 ) ) + ', 70%, ' + Math.min( 50, ( 5 + ( ( entity.av / maxv ) * 20 ) ) ) + '%, ' + ( ( ( entityCount - i ) / entityCount ) ) + ')';
	}
	c.fillRect( -entity.radius, -entity.radius, entity.radius * 2, entity.radius * 2 );
	c.restore();
});

};

function Entity( opt: any ) {
this.branch = opt.branch;
this.i = opt.i;
this.x = opt.x;
this.y = opt.y;
this.vx = 0;
this.vy = 0;
this.radius = opt.radius;
this.attractor = opt.attractor;
this.damp = opt.damp;
}

Entity.prototype.step = function() {
this.vx = ( this.attractor.x - this.x ) * this.damp;
this.vy = ( this.attractor.y - this.y ) * this.damp;
this.x += this.vx;
this.y += this.vy;
this.av = ( Math.abs( this.vx ) + Math.abs( this.vy ) ) / 2;

var dx = this.attractor.x - this.x,
	dy = this.attractor.y - this.y;
this.rot = Math.atan2( dy, dx );
};

function loop() {
requestAnimationFrame( loop );

c.globalCompositeOperation = 'destination-out';
c.fillStyle = 'rgba(0, 0, 0, 1)';
c.fillRect( 0, 0, a.width, a.height );
c.globalCompositeOperation = 'lighter';

chains.forEach( function( chain, i ) {
	chain.step();
});

tick++;
}

function resize() {
w = window.innerWidth;
h = window.innerHeight;
a.width = w * devicePixelRatio;
a.height = h * devicePixelRatio;
a.style.width = `${w}px`;
a.style.height = `${h}px`;
c.scale(devicePixelRatio, devicePixelRatio)

cx = w / 2;
cy = h / 2;
}

window.addEventListener( 'resize', resize );

window.addEventListener( 'mousedown', function() {
md = 1;
});

window.addEventListener( 'mouseup', function() {
md = 0;
});

window.addEventListener( 'mousemove', function( e ) {
mx = e.clientX;
my = e.clientY;
});

resize();

for( var i = 0; i < chainCount; i++ ) {
chains.push( new Chain() );
}

loop();
}
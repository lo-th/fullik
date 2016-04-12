
var THREE;

var Fullik = Fullik || {};

Fullik.torad = 0.0174532925199432957;
Fullik.todeg = 57.295779513082320876;

Fullik.MIN_ANGLE_DEGS = 0;
Fullik.MAX_ANGLE_DEGS = 180;


Fullik.MAX_VALUE = Infinity;//Number.MAX_VALUE;

Fullik.PRECISION = 0.001;
Fullik.PRECISION_DEG = 0.01;

// point position
//Fullik.START = 0; 
//Fullik.END = 1;

// joint Type
Fullik.J_BALL = 1;  // ball-joint constraint about the previous bone in the chain
Fullik.J_GLOBAL_HINGE = 4; //A world-space hinge constraint
Fullik.J_LOCAL_HINGE = 5; // A hinge constraint relative to the previous bone in the chain.

// chain Basebone Constraint Type 
Fullik.BB_NONE = 1; // No constraint - basebone may rotate freely
Fullik.BB_GLOBAL_ROTOR = 2; // World-space rotor constraint
Fullik.BB_GLOBAL_HINGE = 4; // World-space hinge constraint

Fullik.BB_LOCAL_ROTOR = 3;// Rotor constraint in the coordinate space of (i.e. relative to) the direction of the connected bone
Fullik.BB_LOCAL_HINGE = 5;// Hinge constraint in the coordinate space of (i.e. relative to) the direction of the connected bone

// the LOCAL_ROTOR and LOCAL_HINGE basebone constraint types are only available 
// to be used by chains which are connected to other chains. 
// In addition, hinge constraints may have an additional reference axis constraint which is the direction
// within the axis of the hinge about which clockwise/anticlockwise movement is allowed.

Fullik.lerp = function (a, b, percent) { return a + (b - a) * percent; };
Fullik.randRange = function (min, max) { return Fullik.lerp( min, max, Math.random()); };
Fullik.randRangeInt = function (min, max, n) { return Fullik.lerp( min, max, Math.random()).toFixed(n || 0)*1; };
Fullik.nearEquals = function (a, b, t) { return Math.abs(a - b) <= t ? true : false; };
Fullik.sign = function ( v ) { return v >= 0 ? 1 : -1; };

Fullik.radtodeg = function ( v ) { return v * Fullik.todeg; };
Fullik.degtorad = function ( v ) { return v * Fullik.torad; };
//Return the co-tangent of an angle specified in radians.
Fullik.cot = function ( a ) { return 1 / Math.tan( a ); };
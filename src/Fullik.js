
var THREE;

var Fullik = Fullik || {};

Fullik.torad = 0.0174532925199432957;
Fullik.todeg = 57.295779513082320876;

Fullik.MIN_ANGLE_DEGS = 0;
Fullik.MAX_ANGLE_DEGS = 180;


Fullik.MAX_VALUE = Infinity;//Number.MAX_VALUE;

// point position
Fullik.START = 0; 
Fullik.END = 1;

// joint Type
Fullik.J_BALL = 0; 
Fullik.J_GLOBAL_HINGE = 1;
Fullik.J_LOCAL_HINGE = 2;

// chain BaseboneConstraintType3D 
Fullik.BB_NONE = 0; // No constraint - basebone may rotate freely
Fullik.BB_GLOBAL_ROTOR = 1; // World-space rotor constraint
Fullik.BB_LOCAL_ROTOR = 2;// Rotor constraint in the coordinate space of (i.e. relative to) the direction of the connected bone
Fullik.BB_GLOBAL_HINGE = 3; // World-space hinge constraint
Fullik.BB_LOCAL_HINGE = 4;// Hinge constraint in the coordinate space of (i.e. relative to) the direction of the connected bone

Fullik.lerp = function (a, b, percent) { return a + (b - a) * percent; };
Fullik.randRange = function (min, max) { return Fullik.lerp( min, max, Math.random()); };
Fullik.randRangeInt = function (min, max, n) { return Fullik.lerp( min, max, Math.random()).toFixed(n || 0)*1; };
Fullik.nearEquals = function (a, b, t) { return Math.abs(a - b) <= t ? true : false; };
Fullik.sign = function ( v ) { return v >= 0 ? 1 : -1; };

Fullik.radtodeg = function ( v ) { return v * Fullik.todeg; };
Fullik.degtorad = function ( v ) { return v * Fullik.torad; };
//Return the co-tangent of an angle specified in radians.
Fullik.cot = function ( a ) { return 1 / Math.tan( a ); };
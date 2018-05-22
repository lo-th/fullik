import { Tools } from '../core/Tools.js';

var _Math = {

	toRad: Math.PI / 180,
	toDeg: 180 / Math.PI,
	pi90: Math.PI * 0.5,

	clamp: function ( v, min, max ) {

	    v = v < min ? min : v;
	    v = v > max ? max : v;
	    return v;

	},

	lerp: function ( x, y, t ) { 

		return ( 1 - t ) * x + t * y; 

	},

	rand: function ( low, high ) { 

		return low + Math.random() * ( high - low ); 

	},

	randInt: function ( low, high ) { 

		return low + Math.floor( Math.random() * ( high - low + 1 ) ); 

	},

	nearEquals: function (a, b, t) { 

		return Math.abs(a - b) <= t ? true : false; 

	},

	

	radtodeg: function ( v ) { 

		return v * _Math.toDeg; 

	},

	degtorad: function ( v ) { 

		return v * _Math.toRad; 

	},

	cot: function ( a ) {

		//Return the co-tangent of an angle specified in radians.
	   return 1 / Math.tan( a ); 

	},

	perpendicular: function ( a, b ) {

		return _Math.nearEquals( a.dot(b), 0.0, 0.01 ) ? true : false;

	    //return _Math.nearEquals( _Math.dotProduct(a, b), 0.0, 0.01 ) ? true : false;

	},

	scalarProduct: function ( v1, v2 ) { 

		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; 

	},
	

	

	genPerpendicularVectorQuick: function ( v ) {

		//return _Math.genPerpendicularVectorFrisvad( v );

	    var p = v.clone();
	    // cross(v, UP) : cross(v, RIGHT)
	    return Math.abs( v.y ) < 0.99 ? p.set( -v.z, 0, v.x ).normalize() : p.set( 0, v.z, -v.y ).normalize();

	},

	/*genPerpendicularVectorHM: function ( v ) { 

	    var a = v.abs();
	    var b = v.clone();
	    if (a.x <= a.y && a.x <= a.z) return b.set(0, -v.z, v.y).normalize();
	    else if (a.y <= a.x && a.y <= a.z) return b.set(-v.z, 0, v.x).normalize();
	    else return b.set(-v.y, v.x, 0).normalize();

	},*/

	genPerpendicularVectorFrisvad: function ( v ) { 

		var nv = v.clone();
	    if ( v.z < -0.9999999 ) return nv.set(0, -1, 0);// Handle the singularity
	    var a = 1/(1 + v.z);
	    return nv.set( 1 - v.x * v.x * a, - v.x * v.y * a, -v.x ).normalize();

	},

	/*getUvBetween: function ( v1, v2 ) {

	     return v2.minus(v1).normalize();

	},

	dotProduct: function ( v1, v2 ) { 

	    //var v1Norm = v1.normalised();
	    //var v2Norm = v2.normalised();
	    //return v1Norm.x * v2Norm.x + v1Norm.y * v2Norm.y + v1Norm.z * v2Norm.z;
	    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;

	},

	crossProduct: function ( v1, v2 ) { 

		var ax = v1.x, ay = v1.y, az = v1.z;
		var bx = v2.x, by = v2.y, bz = v2.z;

	    return v1.clone().set( 
	    	ay * bz - az * by, 
	    	az * bx - ax * bz, 
	    	ax * by - ay * bx
	    );

	},

	getAngleBetweenRads: function ( v1, v2 ){ 

		var theta = v1.dot( v2 ) / ( Math.sqrt( v1.lengthSq() * v2.lengthSq() ) );
		// clamp, to handle numerical problems
		return Math.acos( _Math.clamp( theta, - 1, 1 ) );

		//var a = _Math.dotProduct( v1, v2 );
		//if (a <= -1) return Math.PI;
		//if (a >= 1) return 0;
	    //return Math.acos( a );

	},

	getAngleBetweenDegs: function( v1, v2 ){

	    return _Math.getAngleBetweenRads( v1, v2 ) * _Math.toDeg;

	},

	getDirectionUV: function ( v1, v2 ) {

	    return v2.minus( v1 ).normalize();

	},*/

	/*getSignedAngleBetweenDegs: function ( referenceVector, otherVector, normalVector ) {

	    var unsignedAngle = _Math.getAngleBetweenDegs( referenceVector, otherVector );
	    var sign          = _Math.sign( _Math.dotProduct( _Math.crossProduct( referenceVector, otherVector ), normalVector ) ); 
	    return unsignedAngle * sign;

	},

	getSignedAngle: function ( v1, v2, normal ) {

	    var angle = _Math.getAngleBetweenRads( v1, v2 );
	    var sign = _Math.sign( _Math.dotProduct( _Math.crossProduct( v1, v2 ), normal ) ); 
	    return angle * sign;

	},

	sign: function ( v ) {

		return v >= 0 ? 1 : -1; 

	},*/


	// rotation

	rotateXDegs: function ( v, angleDegs ) { return _Math.rotateXRads( v, angleDegs * _Math.toRad ); },
	rotateYDegs: function ( v, angleDegs ) { return _Math.rotateYRads( v, angleDegs * _Math.toRad ); },
	rotateZDegs: function ( v, angleDegs ) { return _Math.rotateZRads( v, angleDegs * _Math.toRad ); },

	rotateXRads: function ( v, angleRads ) {

	    var cosTheta = Math.cos( angleRads );
	    var sinTheta = Math.sin( angleRads );
	    return v.clone().set( v.x, v.y * cosTheta - v.z * sinTheta, v.y * sinTheta + v.z * cosTheta );

	},

	rotateYRads: function ( v, angleRads ) {

	    var cosTheta = Math.cos( angleRads );
	    var sinTheta = Math.sin( angleRads );
	    return v.clone().set( v.z * sinTheta + v.x * cosTheta, v.y, v.z * cosTheta - v.x * sinTheta );

	},

	rotateZRads: function ( v, angleRads ) {

	    var cosTheta = Math.cos( angleRads );
	    var sinTheta = Math.sin( angleRads );
	    return v.clone().set( v.x * cosTheta - v.y * sinTheta, v.x * sinTheta + v.y * cosTheta, v.z );

	},

	// distance

	withinManhattanDistance: function ( v1, v2, distance ) {

	    if (Math.abs(v2.x - v1.x) > distance) return false; // Too far in x direction
	    if (Math.abs(v2.y - v1.y) > distance) return false; // Too far in y direction
	    if (Math.abs(v2.z - v1.z) > distance) return false; // Too far in z direction   
	    return true;

	},

	manhattanDistanceBetween: function ( v1, v2 ) {

	    return Math.abs(v2.x - v1.x) + Math.abs(v2.x - v1.x) + Math.abs(v2.x - v1.x);

	},

	distanceBetween: function ( v1, v2 ) {

	    var dx = v2.x - v1.x;
	    var dy = v2.y - v1.y;
	    var dz = v1.z !== undefined ? v2.z - v1.z : 0;
	    return Math.sqrt( dx * dx + dy * dy + dz * dz );

	},

	// ______________________________ 2D _____________________________

	rotateRads: function( v, angleRads ) {

		var cosTheta = Math.cos( angleRads );
		var sinTheta = Math.sin( angleRads );
		return v.clone().set( v.x * cosTheta - v.y * sinTheta,  v.x * sinTheta + v.y * cosTheta );

	},

	rotateDegs: function( v, angleDegs ) {

		return _Math.rotateRads( v, angleDegs * _Math.toRad );
 
	},


	validateDirectionUV: function( directionUV ) {

		if( directionUV.length() < 0 ) Tools.error("vector direction unit vector cannot be zero.");
 
	},

	validateLength: function( length ) {

		if( length < 0 ) Tools.error("Length must be a greater than or equal to zero.");
 
	},



};

export { _Math };
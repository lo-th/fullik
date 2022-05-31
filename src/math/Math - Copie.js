import { Tools } from '../core/Tools.js';

export const _Math = {

	toRad: Math.PI / 180,
	toDeg: 180 / Math.PI,
	pi90: Math.PI * 0.5,
	twoPI: Math.PI * 2,

	// Center point is p1; angle returned in Radians
    //findAngle: function ( p0, p1, p2 ) {
    findAngle: function ( b0, b1 ) {

    	/*let a = p1.minus(p2).lengthSq(), 
	    	b = p1.minus(p0).lengthSq(), 
	    	c = p2.minus(p0).lengthSq(),*/
	    let a = b0.end.minus(b1.end).lengthSq(), 
	    	b = b0.end.minus(b0.start).lengthSq(),
	    	c = b1.end.minus(b0.start).lengthSq(),
	    	angle, r, sign;

	    r = ( a + b - c ) / Math.sqrt( 4 * a * b );
        if( r <= -1 ) angle = Math.PI;
		else if( r >= 1 ) angle = 0;
		else angle = Math.acos( r );
		// sign
		sign = b0.end.x * b1.end.y - b0.end.y * b1.end.x;
		return sign >= 0 ? angle : -angle;

	},

	clamp: function ( v, min, max ) {

	    v = v < min ? min : v;
	    v = v > max ? max : v;
	    return v;

	},

	/*clamp: function ( value, min, max ) {

		return Math.max( min, Math.min( max, value ) );

	},*/

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

	perpendicular: function ( a, b ) {

		return _Math.nearEquals( a.dot(b), 0.0, 0.01 ) ? true : false;

	    //return _Math.nearEquals( _Math.dotProduct(a, b), 0.0, 0.01 ) ? true : false;

	},

	genPerpendicularVectorQuick: function ( v ) {

		//return _Math.genPerpendicularVectorFrisvad( v );

	    let p = v.clone();
	    // cross(v, UP) : cross(v, RIGHT)
	    return Math.abs( v.y ) < 0.99 ? p.set( -v.z, 0, v.x ).normalize() : p.set( 0, v.z, -v.y ).normalize();

	},

	/*genPerpendicularVectorHM: function ( v ) { 

	    let a = v.abs();
	    let b = v.clone();
	    if (a.x <= a.y && a.x <= a.z) return b.set(0, -v.z, v.y).normalize();
	    else if (a.y <= a.x && a.y <= a.z) return b.set(-v.z, 0, v.x).normalize();
	    else return b.set(-v.y, v.x, 0).normalize();

	},*/

	genPerpendicularVectorFrisvad: function ( v ) { 

		let nv = v.clone();
	    if ( v.z < -0.9999999 ) return nv.set(0, -1, 0);// Handle the singularity
	    let a = 1/(1 + v.z);
	    return nv.set( 1 - v.x * v.x * a, - v.x * v.y * a, -v.x ).normalize();

	},

	// rotation

	rotateXDegs: function ( v, angle ) { return v.clone().rotate( angle * _Math.toRad, 'X' ); },
	rotateYDegs: function ( v, angle ) { return v.clone().rotate( angle * _Math.toRad, 'Y' ) },
	rotateZDegs: function ( v, angle ) { return v.clone().rotate( angle * _Math.toRad, 'Z' ) },

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

	    let dx = v2.x - v1.x;
	    let dy = v2.y - v1.y;
	    let dz = v1.z !== undefined ? v2.z - v1.z : 0;
	    return Math.sqrt( dx * dx + dy * dy + dz * dz );

	},

	unwrapDeg: ( r ) => (r - (Math.floor((r + 180)/360))*360), 
	unwrapRad: ( r ) => (r - (Math.floor((r + Math.PI)/(2*Math.PI)))*2*Math.PI),


	/*unwrapDeg: function ( r ) {

	    r = r % 360;
	    if (r > 180) r -= 360;
	    if (r < -180) r += 360;
	    return r;

	},

	unwrapRad: function( r ){

	    r = r % _Math.twoPI;
	    if (r > Math.Pi ) r -= _Math.twoPI;
	    if (r < - Math.Pi ) r += _Math.twoPI;
	    return r;

	},*/


	// ______________________________ 2D _____________________________

	rotateDegs: function( v, angle ) {

		return v.clone().rotate( angle * _Math.toRad )
 
	},


	validateDirectionUV: function( directionUV ) {

		if( directionUV.length() < 0 ) Tools.error("vector direction unit vector cannot be zero.");
 
	},

	validateLength: function( length ) {

		if( length < 0 ) Tools.error("Length must be a greater than or equal to zero.");
 
	},



}
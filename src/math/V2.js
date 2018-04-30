import { _Math } from './Math.js';
import { Tools } from '../core/Tools.js';

function V2( x, y ){

    this.x = x || 0;
    this.y = y || 0;
}

Object.assign( V2.prototype, {

	isVector2: true,

	set: function( x, y ){

	    this.x = x || 0;
	    this.y = y || 0;
	    return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;

		return this;

	},

	divideScalar: function ( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	},

	normalize: function () {

		return this.divideScalar( this.length() || 1 );

	},

	normalised: function () {

	    return new V2( this.x, this.y ).normalize();
	
	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

	    return Math.sqrt( this.x * this.x + this.y * this.y );
	
	},

	plus: function ( v ) {

	    return new V2( this.x + v.x, this.y + v.y );

	},

	min: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;

	    return this;

	},

	minus: function ( v ) {

	    return new V2( this.x - v.x, this.y - v.y );

	},

	divideBy: function ( value ) {

	    return new V2( this.x, this.y ).divideScalar( value );
	
	},

	times: function ( s ) {

	    if( s.isVector2 ) return new V2( this.x * s.x, this.y * s.y );
	    else return new V2( this.x * s, this.y * s, this.z * s );

	},

	randomise: function ( min, max ) {

	    this.x = _Math.rand( min, max );
	    this.y = _Math.rand( min, max );
	    return this;

	},

	/*projectOnPlane: function ( planeNormal ) {

	    if ( planeNormal.length() <= 0 ){ Tools.error("Plane normal cannot be a zero vector."); return; }
	        
        // Projection of vector b onto plane with normal n is defined as: b - ( b.n / ( |n| squared )) * n
        // Note: |n| is length or magnitude of the vector n, NOT its (component-wise) absolute value        
        var b = this.normalised();
        var n = planeNormal.normalised();     
        return b.minus( n.times( _Math.dotProduct( b, planeNormal ) ) ).normalize();// b.sub( n.multiply( Fullik.dotProduct(b, planeNormal) ) ).normalize();

	},*/

	/*cross: function( v ) { 

	    return new V2( this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x );

	},*/

	dot: function ( a, b ) {

		//if( b !== undefined ) return a.x * b.x + a.y * b.y;
		//else 
		return this.x * a.x + this.y * a.y;

	},

	negate: function() { 

	    this.x = -this.x;
	    this.y = -this.y;
	    return this;

	},

	negated: function () { 

	    return new V2( -this.x, -this.y );

	},

	clone: function () {

	    return new V2( this.x, this.y );

	},

	copy: function ( v ) {

	    this.x = v.x;
	    this.y = v.y;
	    return this;

	},

	zcross: function( b ) { //  Method to determine the sign of the angle between two V2 objects.

	    var p = this.x * b.y - b.x * this.y;
		if      ( p > 0 ) return 1; 
		else if ( p < 0 ) return -1;	
		return 0;

	},

	approximatelyEquals: function ( v, t ) {

	    if ( t < 0 ) return false;
	    var xDiff = Math.abs(this.x - v.x);
	    var yDiff = Math.abs(this.y - v.y);
	    return ( xDiff < t && yDiff < t );

	},

	getSignedAngleDegsTo: function ( otherVector ) { // 2D

		var angle = _Math.getAngleBetweenDegs( this, otherVector );

	    // Normalise the vectors that we're going to use
		//var thisVectorUV  = this.normalised();
		//var otherVectorUV = otherVector.normalised();
		// Calculate the unsigned angle between the vectors as the arc-cosine of their dot product
		//var unsignedAngleDegs = Math.acos( thisVectorUV.dot(otherVectorUV) ) * _Math.toDeg;
		// Calculate and return the signed angle between the two vectors using the zcross method
		if ( this.zcross( otherVector ) === 1 ) return angle;
		else return -angle;
		
	},

} );

export { V2 };
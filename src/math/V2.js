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

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;

		return dx * dx + dy * dy;

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

	add: function ( v ) {

		this.x += v.x;
		this.y += v.y;
	    return this;

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

	dot: function ( a, b ) {

		//if( b !== undefined ) return a.x * b.x + a.y * b.y;
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

	cross: function( v ) {

	    return this.x * v.y - this.y * v.x;

	},

	sign: function( v ) { //  Method to determine the sign of the angle between two V2 objects.

		var s = this.cross( v );
		return s >= 0 ? 1 : -1;
		/*if ( s > 0 ) return 1; 
		else if ( s < 0 ) return -1;
		return 0;*/

	},

	approximatelyEquals: function ( v, t ) {

	    if ( t < 0 ) return false;
	    var xDiff = Math.abs(this.x - v.x);
	    var yDiff = Math.abs(this.y - v.y);
	    return ( xDiff < t && yDiff < t );

	},

	rotate: function( angle ) {

		var cos = Math.cos( angle );
		var sin = Math.sin( angle );
		var x = this.x * cos - this.y * sin;
		var y = this.x * sin + this.y * cos;
		return new V2( x, y );

	},

	rotateSelf: function( angle ) {

		var cos = Math.cos( angle );
		var sin = Math.sin( angle );
		var x = this.x * cos - this.y * sin;
		var y = this.x * sin + this.y * cos;
		this.x = x;
		this.y = y;
		return this;

	},

	angleTo: function ( v ) {

		var a = this.dot(v) / (Math.sqrt( this.lengthSq() * v.lengthSq() ));
		//return Math.acos( _Math.clamp( a, - 1, 1 ) );
		if(a <= -1) return Math.PI;
		if(a >= 1) return 0;
		return Math.acos( a );

	},

	getSignedAngle: function ( v ) {

		var a = this.angleTo( v );
		var s = this.sign( v );
		return s === 1 ? a : -a;
		
	},

	/*getSignedAngleDegsTo: function ( v ) { 

		var angle = _Math.getAngleBetweenDegs( this, v );

	    // Normalise the vectors that we're going to use
		//var thisVectorUV  = this.normalised();
		//var otherVectorUV = otherVector.normalised();
		// Calculate the unsigned angle between the vectors as the arc-cosine of their dot product
		//var unsignedAngleDegs = Math.acos( thisVectorUV.dot(otherVectorUV) ) * _Math.toDeg;
		// Calculate and return the signed angle between the two vectors using the cross method
		if ( this.sign( v ) === 1 ) return angle;
		else return -angle;
		
	},*/

	constrainedUV: function( baselineUV, min, max ) {

        var angle = baselineUV.getSignedAngle( this );
        //_Math.clamp( angle, min, max );
        //if( angle > max ) this.copy( baselineUV ).rotateSelf( max );
        //if( angle < min ) this.copy( baselineUV ).rotateSelf( min );
        if( angle > max ) this.copy( baselineUV.rotate(max) )
        if( angle < min ) this.copy( baselineUV.rotate(min) )
        //if( angle > max ) return baselineUV.rotate( max );
        //if( angle < min ) return baselineUV.rotate( min );
        return this;

    },

} );

export { V2 };
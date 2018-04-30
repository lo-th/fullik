import { _Math } from './Math.js';
import { Tools } from '../core/Tools.js';

function V3( x, y, z ){

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

}

Object.assign( V3.prototype, {

	isVector3: true,

	set: function( x, y, z ){

	    this.x = x || 0;
	    this.y = y || 0;
	    this.z = z || 0;
	    return this;

	},

	abs: function () {

		return new V3( 
			this.x < 0 ? -this.x : this.x, 
			this.y < 0 ? -this.y : this.y, 
			this.z < 0 ? -this.z : this.z
		);

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	divideScalar: function ( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	normalize: function () {

		return this.divideScalar( this.length() || 1 );

	},

	normalised: function () {

	    return new V3( this.x, this.y, this.z ).normalize();//this.clone().normalize();
	
	},

	length: function () {

	    return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
	
	},

	plus: function ( v ) {

	    return new V3(this.x + v.x, this.y + v.y, this.z + v.z);

	},

	min: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	    return this;

	},

	minus: function ( v ) {

	    return new V3( this.x - v.x, this.y - v.y, this.z - v.z );

	},

	divideBy: function ( value ) {

	    return new V3( this.x / value, this.y / value, this.z / value );
	
	},

	times: function ( s ) {

		if( s.isVector3 ) return new V3( this.x * s.x, this.y * s.y, this.z * s.z );
	    else return new V3( this.x * s, this.y * s, this.z * s );

	},

	randomise: function ( min, max ) {

	    this.x = _Math.rand( min, max );
	    this.y = _Math.rand( min, max );
	    this.z = _Math.rand( min, max );
	    return this;

	},

	cross: function( v ) { 

	    return new V3( this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x );

	},

	negate: function() { 

	    this.x = -this.x;
	    this.y = -this.y;
	    this.z = -this.z;
	    return this;

	},

	negated: function () { 

	    return new V3( -this.x, -this.y, -this.z );

	},

	clone: function () {

	    return new V3( this.x, this.y, this.z );

	},

	copy: function ( v ) {

	    this.x = v.x;
	    this.y = v.y;
	    this.z = v.z;
	    return this;

	},

	approximatelyEquals: function ( v, t ) {

	    if ( t < 0 ) return false;
	    var xDiff = Math.abs(this.x - v.x);
	    var yDiff = Math.abs(this.y - v.y);
	    var zDiff = Math.abs(this.z - v.z);
	    return ( xDiff < t && yDiff < t && zDiff < t );

	},

	zero: function () {

	    this.x = 0;
	    this.y = 0;
	    this.z = 0;
	    return this;

	},

	projectOnPlane: function ( planeNormal ) {

	    if ( planeNormal.length() <= 0 ){ Tools.error("Plane normal cannot be a zero vector."); return; }
	        
        // Projection of vector b onto plane with normal n is defined as: b - ( b.n / ( |n| squared )) * n
        // Note: |n| is length or magnitude of the vector n, NOT its (component-wise) absolute value        
        var b = this.normalised();
        var n = planeNormal.normalised();   

        return b.min( n.times( _Math.dotProduct( b, planeNormal ) ) ).normalize();

	},

	// added

	projectOnVector: function ( vector ) {

		var scalar = vector.dot( this ) / vector.lengthSq();
		return this.copy( vector ).multiplyScalar( scalar );

	},

	projectOnPlane_new: function () {

		var v1 = new V3();

		return function projectOnPlane( planeNormal ) {

			v1.copy( this ).projectOnVector( planeNormal.normalised() );

			return this.min( v1 ).normalize();

		};

	}(),

	applyQuaternion: function ( q ) {

		var x = this.x, y = this.y, z = this.z;
		var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

		// calculate quat * vector

		var ix = qw * x + qy * z - qz * y;
		var iy = qw * y + qz * x - qx * z;
		var iz = qw * z + qx * y - qy * x;
		var iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

	},


} );

export { V3 };


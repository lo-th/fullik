// Polyfills

if ( Number.EPSILON === undefined ) {

	Number.EPSILON = Math.pow( 2, - 52 );

}

//

if ( Math.sign === undefined ) {

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

	Math.sign = function ( x ) {

		return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : + x;

	};

}

if ( Function.prototype.name === undefined ) {

	// Missing in IE9-11.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

	Object.defineProperty( Function.prototype, 'name', {

		get: function () {

			return this.toString().match( /^\s*function\s*([^\(\s]*)/ )[ 1 ];

		}

	} );

}

if ( Object.assign === undefined ) {

	// Missing in IE.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

	( function () {

		Object.assign = function ( target ) {

			if ( target === undefined || target === null ) {

				throw new TypeError( 'Cannot convert undefined or null to object' );

			}

			var output = Object( target );

			for ( var index = 1; index < arguments.length; index ++ ) {

				var source = arguments[ index ];

				if ( source !== undefined && source !== null ) {

					for ( var nextKey in source ) {

						if ( Object.prototype.hasOwnProperty.call( source, nextKey ) ) {

							output[ nextKey ] = source[ nextKey ];

						}

					}

				}

			}

			return output;

		};

	} )();

}

var Tools = {

	error: function (str) {

		console.error( str );

	},


};

var _Math = {

	toRad: Math.PI / 180,
	toDeg: 180 / Math.PI,
	pi90: Math.PI * 0.5,

	// Center point is p1; angle returned in Radians
    //findAngle: function ( p0, p1, p2 ) {
    findAngle: function ( b0, b1 ) {

    	/*var a = p1.minus(p2).lengthSq(), 
	    	b = p1.minus(p0).lengthSq(), 
	    	c = p2.minus(p0).lengthSq(),*/
	    var a = b0.end.minus(b1.end).lengthSq(), 
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

	    var dx = v2.x - v1.x;
	    var dy = v2.y - v1.y;
	    var dz = v1.z !== undefined ? v2.z - v1.z : 0;
	    return Math.sqrt( dx * dx + dy * dy + dz * dz );

	},

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



};

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

	/*randomise: function ( min, max ) {

	    this.x = _Math.rand( min, max );
	    this.y = _Math.rand( min, max );
	    return this;

	},*/

	dot: function ( a, b ) {

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

	sign: function( v ) {

		var s = this.cross( v );
		return s >= 0 ? 1 : -1;

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
		this.x = x;
		this.y = y;
		return this;

	},

	angleTo: function ( v ) {

		var a = this.dot(v) / (Math.sqrt( this.lengthSq() * v.lengthSq() ));
		if(a <= -1) return Math.PI;
		if(a >= 1) return 0;
		return Math.acos( a );

	},

	getSignedAngle: function ( v ) {

		var a = this.angleTo( v );
		var s = this.sign( v );
		return s === 1 ? a : -a;
		
	},

	constrainedUV: function ( baselineUV, min, max ) {

        var angle = baselineUV.getSignedAngle( this );
        if( angle > max ) this.copy( baselineUV ).rotate(max);
        if( angle < min ) this.copy( baselineUV ).rotate(min);
        return this;

    },

} );

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

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	},

	abs: function () {

		return new V3( 
			this.x < 0 ? -this.x : this.x, 
			this.y < 0 ? -this.y : this.y, 
			this.z < 0 ? -this.z : this.z
		);

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

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

	    return new V3( this.x, this.y, this.z ).normalize();
	
	},

	add: function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	    return this;

	},

	min: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	    return this;

	},

	plus: function ( v ) {

	    return new V3( this.x + v.x, this.y + v.y, this.z + v.z );

	},

	minus: function ( v ) {

	    return new V3( this.x - v.x, this.y - v.y, this.z - v.z );

	},

	divideBy: function ( s ) {

	    return new V3( this.x / s, this.y / s, this.z / s );
	
	},

	multiply: function ( s ) {

	    return new V3( this.x * s, this.y * s, this.z * s );
	
	},
	

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;

	},

	divideScalar: function ( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	},

	cross: function( v ) { 

	    return new V3( this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x );

	},

	crossVectors: function ( a, b ) {

		var ax = a.x, ay = a.y, az = a.z;
		var bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;

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

	/*projectOnPlane_old: function ( planeNormal ) {

	    if ( planeNormal.length() <= 0 ){ Tools.error("Plane normal cannot be a zero vector."); return; }
	        
        // Projection of vector b onto plane with normal n is defined as: b - ( b.n / ( |n| squared )) * n
        // Note: |n| is length or magnitude of the vector n, NOT its (component-wise) absolute value        
        var b = this.normalised();
        var n = planeNormal.normalised();   

        return b.min( n.times( _Math.dotProduct( b, planeNormal ) ) ).normalize();

	},*/

	rotate: function( angle, axe ) {

		var cos = Math.cos( angle );
		var sin = Math.sin( angle );
		var x, y, z;

		switch ( axe ){
			case 'X':
			x = this.x;
			y = this.y * cos - this.z * sin;
			z = this.y * sin + this.z * cos;
			break
			case 'Y':
			x = this.z * sin + this.x * cos;
			y = this.y;
			z = this.z * cos - this.x * sin;
			break
			case 'Z':
			x = this.x * cos - this.y * sin;
			y = this.x * sin + this.y * cos;
			z = this.z;
			break
		}

		this.x = x;
		this.y = y;
		this.z = z;
		return this;

	},

	// added

	projectOnVector: function ( vector ) {

		var scalar = vector.dot( this ) / vector.lengthSq();
		return this.copy( vector ).multiplyScalar( scalar );

	},

	projectOnPlane: function () {

		var v1 = new V3();

		return function projectOnPlane( planeNormal ) {

			v1.copy( this ).projectOnVector( planeNormal.normalised() );

			return this.min( v1 ).normalize();

		};

	}(),

	applyM3: function ( m ) {

		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 1 ] * y + e[ 2 ] * z;
		this.y = e[ 3 ] * x + e[ 4 ] * y + e[ 5 ] * z;
		this.z = e[ 6 ] * x + e[ 7 ] * y + e[ 8 ] * z;

		return this.normalize();

	},

	applyMatrix3: function ( m ) {

		var x = this.x, y = this.y, z = this.z;
		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
		this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

		return this;

	},

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

	/////

	sign: function( v, normal ) {

		var s = this.cross( v ).dot( normal );
		return s >= 0 ? 1 : -1;

	},

	angleTo: function ( v ) {

		var a = this.dot(v) / Math.sqrt( this.lengthSq() * v.lengthSq() );
		if(a <= -1) return Math.PI;
		if(a >= 1) return 0;
		return Math.acos( a );

	},

	getSignedAngle: function ( v, normal ) {

		var a = this.angleTo( v );
		var s = this.sign( v, normal );
		return s === 1 ? a : -a;
		
	},

	constrainedUV: function( referenceAxis, rotationAxis, mtx, min, max ) {

        var angle = referenceAxis.getSignedAngle( this, rotationAxis );
        if( angle > max ) this.copy( mtx.rotateAboutAxis( referenceAxis, max, rotationAxis ) );
        if( angle < min ) this.copy( mtx.rotateAboutAxis( referenceAxis, min, rotationAxis ) );
        return this;

    },

    limitAngle: function( base, mtx, max ) {

        var angle = base.angleTo( this );
        if( angle > max ){ 
        	var correctionAxis = base.normalised().cross(this).normalize();
        	this.copy( mtx.rotateAboutAxis( base, max, correctionAxis ) );
        }
        return this;

    },


} );

function M3 () {

	this.elements = [

		1, 0, 0,
		0, 1, 0,
		0, 0, 1

	];

	if ( arguments.length > 0 ) {

		console.error( 'M3: the constructor no longer reads arguments. use .set() instead.' );

	}

}

Object.assign( M3.prototype, {

	isMatrix3: true,

	set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
		te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
		te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		);

		return this;

	},

	setV3: function ( xAxis, yAxis, zAxis ) {

		var te = this.elements;

	    te[ 0 ] = xAxis.x;
	    te[ 3 ] = xAxis.y; 
	    te[ 6 ] = xAxis.z;
	        
	    te[ 1 ] = yAxis.x;
	    te[ 4 ] = yAxis.y; 
	    te[ 7 ] = yAxis.z;
	        
	    te[ 2 ] = zAxis.x;
	    te[ 5 ] = zAxis.y; 
	    te[ 8 ] = zAxis.z;

	    return this;

	},

	transpose: function () {

		var tmp, m = this.elements;

		tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
		tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
		tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

		return this;

	},

	createRotationMatrix: function ( referenceDirection ) {
  
	    var zAxis = referenceDirection;//normalised();
	    var xAxis = new V3(1, 0, 0);
	    var yAxis = new V3(0, 1, 0);
	            
	    // Handle the singularity (i.e. bone pointing along negative Z-Axis)...
	    if( referenceDirection.z < -0.9999999 ){
	        xAxis.set(1, 0, 0); // ...in which case positive X runs directly to the right...
	        yAxis.set(0, 1, 0); // ...and positive Y runs directly upwards.
	    } else {
	        var a = 1/(1 + zAxis.z);
	        var b = -zAxis.x * zAxis.y * a;           
	        xAxis.set( 1 - zAxis.x * zAxis.x * a, b, -zAxis.x ).normalize();
	        yAxis.set( b, 1 - zAxis.y * zAxis.y * a, -zAxis.y ).normalize();
	    }

	    return this.setV3( xAxis, yAxis, zAxis );

	},

	rotateAboutAxis: function ( v, angle, rotationAxis ){

	    var sinTheta = Math.sin( angle );
	    var cosTheta = Math.cos( angle );
	    var oneMinusCosTheta = 1.0 - cosTheta;
	    
	    // It's quicker to pre-calc these and reuse than calculate x * y, then y * x later (same thing).
	    var xyOne = rotationAxis.x * rotationAxis.y * oneMinusCosTheta;
	    var xzOne = rotationAxis.x * rotationAxis.z * oneMinusCosTheta;
	    var yzOne = rotationAxis.y * rotationAxis.z * oneMinusCosTheta;

	    var te = this.elements;

	    // Calculate rotated x-axis
	    te[ 0 ] = rotationAxis.x * rotationAxis.x * oneMinusCosTheta + cosTheta;
	    te[ 3 ] = xyOne + rotationAxis.z * sinTheta;
	    te[ 6 ] = xzOne - rotationAxis.y * sinTheta;

	    // Calculate rotated y-axis
	    te[ 1 ] = xyOne - rotationAxis.z * sinTheta;
	    te[ 4 ] = rotationAxis.y * rotationAxis.y * oneMinusCosTheta + cosTheta;
	    te[ 7 ] = yzOne + rotationAxis.x * sinTheta;

	    // Calculate rotated z-axis
	    te[ 2 ] = xzOne + rotationAxis.y * sinTheta;
	    te[ 5 ] = yzOne - rotationAxis.x * sinTheta;
	    te[ 8 ] = rotationAxis.z * rotationAxis.z * oneMinusCosTheta + cosTheta;

	    // Multiply the source by the rotation matrix we just created to perform the rotation
	    return v.clone().applyM3( this );

	},

} );

function Q( x, y, z, w ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = ( w !== undefined ) ? w : 1;

}

Object.assign( Q, {

	slerp: function ( qa, qb, qm, t ) {

		return qm.copy( qa ).slerp( qb, t );

	},

} );

Object.defineProperties( Q.prototype, {

	x: {

		get: function () {

			return this._x;

		},

		set: function ( value ) {

			this._x = value;
			this.onChangeCallback();

		}

	},

	y: {

		get: function () {

			return this._y;

		},

		set: function ( value ) {

			this._y = value;
			this.onChangeCallback();

		}

	},

	z: {

		get: function () {

			return this._z;

		},

		set: function ( value ) {

			this._z = value;
			this.onChangeCallback();

		}

	},

	w: {

		get: function () {

			return this._w;

		},

		set: function ( value ) {

			this._w = value;
			this.onChangeCallback();

		}

	}

} );


Object.assign( Q.prototype, {

	set: function ( x, y, z, w ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

		this.onChangeCallback();

		return this;

	},

	clone: function () {

		return new this.constructor( this._x, this._y, this._z, this._w );

	},

	setFromAxisAngle: function ( axis, angle ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		var halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );

		this.onChangeCallback();

		return this;

	},

	copy: function ( quaternion ) {

		this._x = quaternion.x;
		this._y = quaternion.y;
		this._z = quaternion.z;
		this._w = quaternion.w;

		this.onChangeCallback();

		return this;

	},

	

	setFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33,
			s;

		if ( trace > 0 ) {

			s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}

		this.onChangeCallback();

		return this;

	},

	setFromUnitVectors: function () {

		// assumes direction vectors vFrom and vTo are normalized

		var v1 = new V3();
		var r;

		var EPS = 0.000001;

		return function setFromUnitVectors( vFrom, vTo ) {

			if ( v1 === undefined ) v1 = new V3();

			r = vFrom.dot( vTo ) + 1;

			if ( r < EPS ) {

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					v1.set( - vFrom.y, vFrom.x, 0 );

				} else {

					v1.set( 0, - vFrom.z, vFrom.y );

				}

			} else {

				v1.crossVectors( vFrom, vTo );

			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			return this.normalize();

		};

	}(),

	inverse: function () {

		// quaternion is assumed to have unit length

		return this.conjugate();

	},

	conjugate: function () {

		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;

		this.onChangeCallback();

		return this;

	},

	dot: function ( v ) {

		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

	},

	lengthSq: function () {

		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

	},

	length: function () {

		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

	},

	normalize: function () {

		var l = this.length();

		if ( l === 0 ) {

			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;

		} else {

			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;

		}

		this.onChangeCallback();

		return this;

	},

	multiply: function ( q, p ) {

		if ( p !== undefined ) {

			console.warn( 'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
			return this.multiplyQuaternions( q, p );

		}

		return this.multiplyQuaternions( this, q );

	},

	premultiply: function ( q ) {

		return this.multiplyQuaternions( q, this );

	},

	multiplyQuaternions: function ( a, b ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		this.onChangeCallback();

		return this;

	},

	onChangeCallback: function () {}

} );

/*
 * A list of constants built-in for
 * the Fik engine.
 */

var REVISION = '1.3.3';

var PRECISION = 0.001;
var PRECISION_DEG = 0.01;
var MAX_VALUE = Infinity;

var PI = Math.PI;
var TORAD = Math.PI / 180;
var TODEG = 180 / Math.PI;

// chain Basebone Constraint Type

var NONE = 1; // No constraint
// 3D
var GLOBAL_ROTOR = 2;// World-space rotor constraint
var GLOBAL_HINGE = 3;// World-space hinge constraint
var LOCAL_ROTOR = 4;// Rotor constraint in the coordinate space of (i.e. relative to) the direction of the connected bone
var LOCAL_HINGE = 5;// Hinge constraint in the coordinate space of (i.e. relative to) the direction of the connected bone

// 2D
var GLOBAL_ABSOLUTE = 6; // Constrained about a world-space direction
var LOCAL_RELATIVE = 7; // Constrained about the direction of the connected bone
var LOCAL_ABSOLUTE = 8; // Constrained about a direction with relative to the direction of the connected bone

// joint Type
var J_BALL = 10;
var J_LOCAL = 11;
var J_GLOBAL = 12;

var START = 20;
var END = 21;

// Define world-space axis

var X_AXE = new V3( 1, 0, 0 );
var Y_AXE = new V3( 0, 1, 0 );
var Z_AXE = new V3( 0, 0, 1 );

var X_NEG = new V3( -1, 0, 0 );
var Y_NEG = new V3( 0, -1, 0 );
var Z_NEG = new V3( 0, 0, -1 );

// Define world-space 2D cardinal axes

var UP = new V2( 0, 1 );
var DOWN = new V2( 0, -1 );
var LEFT = new V2( -1, 0 );
var RIGHT = new V2( 1, 0 );

function Joint3D(){

    this.rotor = PI;
    this.min = -PI;
    this.max = PI;

    this.freeHinge = true;

    this.rotationAxisUV = new V3();
    this.referenceAxisUV = new V3();
    this.type = J_BALL;

}

Object.assign( Joint3D.prototype, {

	isJoint3D: true,

    clone:function(){

        var j = new Joint3D();

        j.type = this.type;
        j.rotor = this.rotor;
        j.max = this.max;
        j.min = this.min;
        j.freeHinge = this.freeHinge;
        j.rotationAxisUV.copy( this.rotationAxisUV );
        j.referenceAxisUV.copy( this.referenceAxisUV );

        return j;

    },

    testAngle: function () {

        if( this.max === PI && this.min === -PI ) this.freeHinge = true;
        else this.freeHinge = false;

    },

    validateAngle: function ( a ) {

        a = a < 0 ? 0 : a;
        a = a > 180 ? 180 : a;
        return a;

    },

    setAsBallJoint:function( angle ){

        this.rotor = this.validateAngle( angle ) * TORAD;
        this.type = J_BALL;
        
    },

    // Specify this joint to be a hinge with the provided settings

    setHinge: function( type, rotationAxis, clockwise, anticlockwise, referenceAxis ){

        this.type = type;
        if( clockwise < 0 ) clockwise *= -1;
        this.min = -this.validateAngle( clockwise ) * TORAD;
        this.max = this.validateAngle( anticlockwise ) * TORAD;

        this.testAngle();

        this.rotationAxisUV.copy( rotationAxis ).normalize();
        this.referenceAxisUV.copy( referenceAxis ).normalize();

    },

    // GET

    getHingeReferenceAxis:function () {

        return this.referenceAxisUV; 

    },

    getHingeRotationAxis:function () {

        return this.rotationAxisUV; 

    },

    // SET

    setBallJointConstraintDegs: function ( angle ) {

        this.rotor = this.validateAngle( angle ) * TORAD;

    },

    setHingeClockwise: function ( angle ) {

        if( angle < 0 ) angle *= -1;
        this.min = -this.validateAngle( angle ) * TORAD;
        this.testAngle();

    },

    setHingeAnticlockwise: function ( angle ) {

        this.max = this.validateAngle( angle ) * TORAD;
        this.testAngle();

    },

    /*setHingeRotationAxis: function ( axis ) {

        this.rotationAxisUV.copy( axis ).normalize();

    },

    setHingeReferenceAxis: function ( referenceAxis ) {

        this.referenceAxisUV.copy( referenceAxis ).normalize(); 

    },*/

    
    
} );

function Bone3D ( startLocation, endLocation, directionUV, length, color ){

    this.joint = new Joint3D();
    this.start = new V3();
    this.end = new V3();
    
    this.boneConnectionPoint = END;
    this.length = 0;

    this.color = color || 0xFFFFFF;
    this.name = '';

    this.init( startLocation, endLocation, directionUV, length );

}
Object.assign( Bone3D.prototype, {

    isBone3D: true,

    init:function( startLocation, endLocation, directionUV, length ){

        this.setStartLocation( startLocation );
        if( endLocation ){ 
            this.setEndLocation( endLocation );
            this.length = this.getLength();

        } else {
            this.setLength( length );
            this.setEndLocation( this.start.plus( directionUV.normalised().multiplyScalar( length ) ) );
        }

    },

    clone:function () {

        var b = new Bone3D( this.start, this.end );
        b.joint = this.joint.clone();
        return b;

    },

    // SET

    setColor: function ( c ) {

        this.color = c;

    },

    setBoneConnectionPoint: function ( bcp ) {

        this.boneConnectionPoint = bcp;

    },

    setHingeClockwise: function ( angle ) {


        this.joint.setHingeClockwise( angle );

    },

    setHingeAnticlockwise: function ( angle ) {

        this.joint.setHingeAnticlockwise( angle );

    },

    setBallJointConstraintDegs: function ( angle ) {

        this.joint.setBallJointConstraintDegs( angle );

    },

    setStartLocation: function ( location ) {

        this.start.copy ( location );

    },

    setEndLocation: function ( location ) {

        this.end.copy ( location );

    },

    setLength: function ( lng ) {

        if ( lng > 0 ) this.length = lng;

    },

    setJoint: function ( joint ) {

        this.joint = joint;

    },


    // GET

    getBoneConnectionPoint: function () {

        return this.boneConnectionPoint;

    },

    getDirectionUV: function () {

        return this.end.minus( this.start ).normalize();

    },

    getLength: function(){

        return this.start.distanceTo( this.end );

    },

} );

function Chain3D ( color ){

    this.tmpTarget = new V3();
    this.tmpMtx = new M3();

    this.bones = [];
    this.name = '';
    this.color = color || 0xFFFFFF;

    this.solveDistanceThreshold = 1.0;
    this.minIterationChange = 0.01;
    this.maxIteration = 20;
    this.precision = 0.001;

    this.chainLength = 0;
    this.numBones = 0;

    this.baseLocation = new V3();
    this.fixedBaseMode = true;

    this.baseboneConstraintType = NONE;

    this.baseboneConstraintUV = new V3();
    this.baseboneRelativeConstraintUV = new V3();
    this.baseboneRelativeReferenceConstraintUV = new V3();
    this.lastTargetLocation = new V3( MAX_VALUE, MAX_VALUE, MAX_VALUE );

    this.lastBaseLocation =  new V3( MAX_VALUE, MAX_VALUE, MAX_VALUE );
    this.currentSolveDistance = MAX_VALUE;

    this.connectedChainNumber = -1;
    this.connectedBoneNumber = -1;
    this.boneConnectionPoint = END;

    // test full restrict angle 
    this.isFullForward = false;

    

    this.embeddedTarget = new V3();
    this.useEmbeddedTarget = false;

}

Object.assign( Chain3D.prototype, {

    isChain3D: true,

    clone: function () {

        var c = new Chain3D();

        c.solveDistanceThreshold = this.solveDistanceThreshold;
        c.minIterationChange = this.minIterationChange;
        c.maxIteration = this.maxIteration;
        c.precision = this.precision;

        c.bones = this.cloneBones();
        c.baseLocation.copy( this.baseLocation );
        c.lastTargetLocation.copy( this.lastTargetLocation );
        c.lastBaseLocation.copy( this.lastBaseLocation );
                
        // Copy the basebone constraint UV if there is one to copy
        if ( !(this.baseboneConstraintType === NONE) ){
            c.baseboneConstraintUV.copy( this.baseboneConstraintUV );
            c.baseboneRelativeConstraintUV.copy( this.baseboneRelativeConstraintUV );
        }       
        
        // Native copy by value for primitive members
        c.fixedBaseMode          = this.fixedBaseMode;
        
        c.chainLength            = this.chainLength;
        c.numBones               = this.numBones;
        c.currentSolveDistance   = this.currentSolveDistance;

        c.boneConnectionPoint    = this.boneConnectionPoint;
        c.connectedChainNumber   = this.connectedChainNumber;
        c.connectedBoneNumber    = this.connectedBoneNumber;
        c.baseboneConstraintType = this.baseboneConstraintType;

        c.color = this.color;

        c.embeddedTarget = this.embeddedTarget.clone();
        c.useEmbeddedTarget = this.useEmbeddedTarget;

        return c;

    },

    clear: function () {

        var i = this.numBones;
        while(i--) this.removeBone(i);
        this.numBones = 0;

    },

    addBone: function ( bone ) {

        bone.setColor( this.color );

        // Add the new bone to the end of the ArrayList of bones
        this.bones.push( bone );
        // Increment the number of bones in the chain and update the chain length
        this.numBones ++;

        // If this is the basebone...
        if ( this.numBones === 1 ){
            // ...then keep a copy of the fixed start location...
            this.baseLocation.copy( bone.start );
            
            // ...and set the basebone constraint UV to be around the initial bone direction
            this.baseboneConstraintUV.copy( bone.getDirectionUV() );
        }
        
        // Increment the number of bones in the chain and update the chain length
        this.updateChainLength();

    },

    removeBone: function ( id ) {

        if ( id < this.numBones ){   
            // ...then remove the bone, decrease the bone count and update the chain length.
            this.bones.splice(id, 1);
            this.numBones --;
            this.updateChainLength();

        }

    },

    addConsecutiveBone: function ( directionUV, length ) {

         if (this.numBones > 0) {               
            // Get the end location of the last bone, which will be used as the start location of the new bone
            // Add a bone to the end of this IK chain
            // Note: We use a normalised version of the bone direction
            this.addBone( new Bone3D(  this.bones[ this.numBones-1 ].end, undefined, directionUV.normalised(), length ) );
        }

    },

    addConsecutiveFreelyRotatingHingedBone: function ( directionUV, length, type, hingeRotationAxis ) {

        this.addConsecutiveHingedBone( directionUV, length, type, hingeRotationAxis, 180, 180, _Math.genPerpendicularVectorQuick( hingeRotationAxis ) );

    },

    addConsecutiveHingedBone: function ( DirectionUV, length, type, HingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis ) {

        // Cannot add a consectuive bone of any kind if the there is no basebone
        if ( this.numBones === 0 ) return;

        // Normalise the direction and hinge rotation axis 
        var directionUV = DirectionUV.normalised();
        var hingeRotationAxis = HingeRotationAxis.normalised();
            
        // Create a bone, get the end location of the last bone, which will be used as the start location of the new bone
        var bone = new Bone3D( this.bones[ this.numBones-1 ].end, undefined, directionUV, length, this.color );

        type = type || 'global';

        // ...set up a joint which we'll apply to that bone.
        bone.joint.setHinge( type === 'global' ? J_GLOBAL : J_LOCAL, hingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis );
        
        // Finally, add the bone to this chain
        this.addBone( bone );

    },

    addConsecutiveRotorConstrainedBone: function ( boneDirectionUV, length, constraintAngleDegs ) {

        if (this.numBones === 0) return;

        // Create the bone starting at the end of the previous bone, set its direction, constraint angle and colour
        // then add it to the chain. Note: The default joint type of a new Bone is J_BALL.
        boneDirectionUV = boneDirectionUV.normalised();
        var bone = new Bone3D( this.bones[ this.numBones-1 ].end, undefined , boneDirectionUV, length );
        bone.joint.setAsBallJoint( constraintAngleDegs );
        this.addBone( bone );

    },

    // -------------------------------
    //      GET
    // -------------------------------

    getBoneConnectionPoint: function () {

        return this.boneConnectionPoint;

    },

    getConnectedBoneNumber:function(){

        return this.connectedBoneNumber;

    },

    getConnectedChainNumber:function(){

        return this.connectedChainNumber;

    },

    getBaseboneConstraintType:function(){

        return this.baseboneConstraintType;

    },

    getBaseboneConstraintUV:function(){

        if ( !(this.baseboneConstraintType === NONE) ) return this.baseboneConstraintUV;

    },

    getBaseLocation: function () {

        return this.bones[0].start;

    },

    getEffectorLocation: function () {

        return this.bones[this.numBones-1].end;

    },

    getLastTargetLocation: function () {

        return this.lastTargetLocation;

    },

    getLiveChainLength: function () {

        var lng = 0;
        var i = this.numBones;
        while( i-- ) lng += this.bones[i].getLength();
        return lng;

    },


    getBaseboneRelativeReferenceConstraintUV: function () {

        return this.baseboneRelativeReferenceConstraintUV;

    },

    // -------------------------------
    //      SET
    // -------------------------------

    setConnectedBoneNumber: function ( boneNumber ) {

        this.connectedBoneNumber = boneNumber;

    },

    setConnectedChainNumber: function ( chainNumber ) {

        this.connectedChainNumber = chainNumber;

    },

    setBoneConnectionPoint: function ( point ) {

        this.boneConnectionPoint = point;

    },

    setColor: function ( c ) {

        this.color = c;
        var i = this.numBones;
        while( i-- ) this.bones[i].setColor( this.color );
        
    },

    setBaseboneRelativeConstraintUV: function( uv ){ 

        this.baseboneRelativeConstraintUV = uv.normalised(); 

    },

    setBaseboneRelativeReferenceConstraintUV: function( uv ){ 

        this.baseboneRelativeReferenceConstraintUV = uv.normalised(); 

    },

    setBaseboneConstraintUV : function( uv ){

        this.baseboneConstraintUV = uv.normalised(); 

    },

    setRotorBaseboneConstraint : function( type, constraintAxis, angleDegs ){

        // Sanity checking
        if (this.numBones === 0){ Tools.error("Chain must contain a basebone before we can specify the basebone constraint type."); return; }     
        if ( !(constraintAxis.length() > 0) ){ Tools.error("Constraint axis cannot be zero."); return;}

        type = type || 'global';       
        // Set the constraint type, axis and angle
        this.baseboneConstraintType = type === 'global' ? GLOBAL_ROTOR : LOCAL_ROTOR;
        this.baseboneConstraintUV = constraintAxis.normalised();
        this.baseboneRelativeConstraintUV.copy( this.baseboneConstraintUV );
        this.bones[0].joint.setAsBallJoint( angleDegs );

    },

    setHingeBaseboneConstraint : function( type, hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis ){

        // Sanity checking
        if ( this.numBones === 0){ Tools.error("Chain must contain a basebone before we can specify the basebone constraint type."); return; }   
        if ( hingeRotationAxis.length() <= 0 ){ Tools.error("Hinge rotation axis cannot be zero."); return;  }          
        if ( hingeReferenceAxis.length() <= 0 ){ Tools.error("Hinge reference axis cannot be zero."); return; }     
        if ( !( _Math.perpendicular( hingeRotationAxis, hingeReferenceAxis ) ) ){ Tools.error("The hinge reference axis must be in the plane of the hinge rotation axis, that is, they must be perpendicular."); return; }
        
        type = type || 'global';

        // Set the constraint type, axis and angle
        this.baseboneConstraintType = type === 'global' ? GLOBAL_HINGE : LOCAL_HINGE;
        this.baseboneConstraintUV = hingeRotationAxis.normalised();
        this.bones[0].joint.setHinge( type === 'global' ? J_GLOBAL : J_LOCAL, hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );

    },

    setFreelyRotatingGlobalHingedBasebone : function( hingeRotationAxis ){

        this.setHingeBaseboneConstraint( 'global', hingeRotationAxis, 180, 180, _Math.genPerpendicularVectorQuick( hingeRotationAxis ) );
    },

    setGlobalHingedBasebone: function ( hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis ) {

        this.setHingeBaseboneConstraint( 'global', hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );

    },

    setFreelyRotatingLocalHingedBasebone: function ( hingeRotationAxis ) {

        this.setHingeBaseboneConstraint( 'local', hingeRotationAxis, 180, 180, _Math.genPerpendicularVectorQuick( hingeRotationAxis ) );

    },

    setLocalHingedBasebone: function ( hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis ) {

        this.setHingeBaseboneConstraint( 'local', hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );

    },

    setBaseLocation: function ( baseLocation ) {

        this.baseLocation.copy( baseLocation );

    },
    
    setFixedBaseMode: function( value ){

        // Enforce that a chain connected to another chain stays in fixed base mode (i.e. it moves with the chain it's connected to instead of independently)
        if ( !value && this.connectedChainNumber !== -1) return;
        if ( this.baseboneConstraintType === GLOBAL_ROTOR && !value ) return;
        // Above conditions met? Set the fixedBaseMode
        this.fixedBaseMode = value;

    },

    setMaxIterationAttempts: function ( maxIterations ) {

        if (maxIterations < 1) return;
        this.maxIteration = maxIterations;

    },

    setMinIterationChange: function ( minIterationChange ) {

        if (minIterationChange < 0) return;
        this.minIterationChange = minIterationChange;

    },

    setSolveDistanceThreshold: function ( solveDistance ) {

        if (solveDistance < 0) return;
        this.solveDistanceThreshold = solveDistance;

    },

    // -------------------------------
    //
    //      UPDATE TARGET
    //
    // -------------------------------

    solveForEmbeddedTarget: function () {

        if ( this.useEmbeddedTarget ) return this.solveForTarget( this.embeddedTarget );

    },

    resetTarget: function () {

        this.lastBaseLocation = new V3( MAX_VALUE, MAX_VALUE, MAX_VALUE );
        this.currentSolveDistance = MAX_VALUE;

    },


    // Method to solve this IK chain for the given target location.
    // The end result of running this method is that the IK chain configuration is updated.

    // To minimuse CPU usage, this method dynamically aborts if:
    // - The solve distance (i.e. distance between the end effector and the target) is below the solveDistanceThreshold,
    // - A solution incrementally improves on the previous solution by less than the minIterationChange, or
    // - The number of attempts to solve the IK chain exceeds the maxIteration.

    solveForTarget : function( t ){

        this.tmpTarget.set( t.x, t.y, t.z );
        var p = this.precision;

        var isSameBaseLocation = this.lastBaseLocation.approximatelyEquals( this.baseLocation, p );

        // If we have both the same target and base location as the last run then do not solve
        if ( this.lastTargetLocation.approximatelyEquals( this.tmpTarget, p ) && isSameBaseLocation ) return this.currentSolveDistance;

        // Keep starting solutions and distance
        var startingDistance;
        var startingSolution = null;

        // If the base location of a chain hasn't moved then we may opt to keep the current solution if our 
        // best new solution is worse...
        if ( isSameBaseLocation ) {
            startingDistance = this.bones[ this.numBones-1 ].end.distanceTo( this.tmpTarget );
            startingSolution = this.cloneBones();
        } else {
            // Base has changed? Then we have little choice but to recalc the solution and take that new solution.
            startingDistance = MAX_VALUE;
        }
        
        /*
         * NOTE: We must allow the best solution of THIS run to be used for a new target or base location - we cannot
         * just use the last solution (even if it's better) - because that solution was for a different target / base
         * location combination and NOT for the current setup.
         */
                        
        // Not the same target? Then we must solve the chain for the new target.
        // We'll start by creating a list of bones to store our best solution
        var bestSolution = [];
        
        // We'll keep track of our best solve distance, starting it at a huge value which will be beaten on first attempt
        var bestSolveDistance = MAX_VALUE;
        var lastPassSolveDistance = MAX_VALUE;
        
        // Allow up to our iteration limit attempts at solving the chain
        var solveDistance;

        var i = this.maxIteration;

        while( i-- ){   

            // Solve the chain for this target
            solveDistance = this.solveIK( this.tmpTarget );
            
            // Did we solve it for distance? If so, update our best distance and best solution, and also
            // update our last pass solve distance. Note: We will ALWAYS beat our last solve distance on the first run. 
            if ( solveDistance < bestSolveDistance ) {   

                bestSolveDistance = solveDistance;
                bestSolution = this.cloneBones();
                
                // If we are happy that this solution meets our distance requirements then we can exit the loop now
                if ( solveDistance <= this.solveDistanceThreshold ) break;
                
            } else {// Did not solve to our satisfaction? Okay...
            
                // Did we grind to a halt? If so break out of loop to set the best distance and solution that we have
                if ( Math.abs( solveDistance - lastPassSolveDistance ) < this.minIterationChange )  break; 

            }
            
            // Update the last pass solve distance
            lastPassSolveDistance = solveDistance;
            
        } // End of loop

        // Did we get a solution that's better than the starting solution's to the new target location?
        if ( bestSolveDistance < startingDistance ){
            // If so, set the newly found solve distance and solution as the best found.
            this.currentSolveDistance = bestSolveDistance;
            this.bones = bestSolution;
        } else {
            // Did we make things worse? Then we keep our starting distance and solution!
            this.currentSolveDistance = startingDistance;
            this.bones = startingSolution; 
        }
        
        // Update our base and target locations
        this.lastBaseLocation.copy( this.baseLocation );
        this.lastTargetLocation.copy( this.tmpTarget );
        
        return this.currentSolveDistance;
        
    },

    // -------------------------------
    //
    //      SOLVE IK
    //
    // -------------------------------

    // Solve the IK chain for the given target using the FABRIK algorithm.
    // retun the best solve distance found between the end-effector of this chain and the provided target.

    solveIK : function( target ){

        if ( this.numBones === 0 ) return;

        var bone, boneLength, joint, jointType, nextBone;
        var hingeRotationAxis, hingeReferenceAxis;
        var tmpMtx = this.tmpMtx;
        
        // ---------- Forward pass from end effector to base -----------

        // Loop over all bones in the chain, from the end effector (numBones-1) back to the basebone (0) 
        var i = this.numBones;

        while( i-- ){


            // Get the length of the bone we're working on
            bone = this.bones[i];
            boneLength  = bone.length;
            joint = bone.joint;
            jointType = joint.type;

            // If we are NOT working on the end effector bone
            if ( i !== this.numBones - 1 ) {

                nextBone = this.bones[i+1];

                // Get the outer-to-inner unit vector of the bone further out
                var outerBoneOuterToInnerUV = nextBone.getDirectionUV().negate();

                // Get the outer-to-inner unit vector of this bone
                var boneOuterToInnerUV = bone.getDirectionUV().negate();

                // Get the joint type for this bone and handle constraints on boneInnerToOuterUV

                /*if( this.isFullForward ){

                    switch ( jointType ) {
                        case J_BALL:
                            // Constrain to relative angle between this bone and the next bone if required
                            boneOuterToInnerUV.limitAngle( outerBoneOuterToInnerUV, tmpMtx, nextBone.joint.rotor );
                        break;                      
                        case J_GLOBAL:

                            hingeRotationAxis = nextBone.joint.getHingeRotationAxis().negated();
                            hingeReferenceAxis = nextBone.joint.getHingeReferenceAxis().negated();
                            
                            // Project this bone outer-to-inner direction onto the hinge rotation axis
                            boneOuterToInnerUV.projectOnPlane( hingeRotationAxis ); 

                            // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
                            if( !nextBone.joint.freeHinge ) boneOuterToInnerUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx,  nextBone.joint.min,  nextBone.joint.max );

                            
                        break;
                        case J_LOCAL:
                            

                            if ( i > 0 ) {// Not a basebone? Then construct a rotation matrix based on the previous bones inner-to-to-inner direction...
                                // ...and transform the hinge rotation axis into the previous bones frame of reference.

                                tmpMtx.createRotationMatrix( outerBoneOuterToInnerUV );
                                hingeRotationAxis = nextBone.joint.getHingeRotationAxis().clone().negate().applyM3( tmpMtx );
                                hingeReferenceAxis = nextBone.joint.getHingeReferenceAxis().clone().negate().applyM3( tmpMtx );



                            } else {// ...basebone? Need to construct matrix from the relative constraint UV.

                                hingeRotationAxis = this.baseboneRelativeConstraintUV.negated();
                                hingeReferenceAxis = this.baseboneRelativeReferenceConstraintUV.negated();

                            }

                            // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                            boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );

                            // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.  
                            if( !nextBone.joint.freeHinge ){

                                boneOuterToInnerUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, nextBone.joint.min, nextBone.joint.max );

                            }
                        break;
                    }
                } else {*/

                    switch ( jointType ) {
                        case J_BALL:
                            // Constrain to relative angle between this bone and the next bone if required
                            boneOuterToInnerUV.limitAngle( outerBoneOuterToInnerUV, tmpMtx, joint.rotor );
                        break;                      
                        case J_GLOBAL:

                            hingeRotationAxis = joint.getHingeRotationAxis();
                            
                            // Project this bone outer-to-inner direction onto the hinge rotation axis
                            boneOuterToInnerUV.projectOnPlane( hingeRotationAxis ); 

                            // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
                        break;
                        case J_LOCAL:
                            

                            if ( i > 0 ) {// Not a basebone? Then construct a rotation matrix based on the previous bones inner-to-to-inner direction...
                                // ...and transform the hinge rotation axis into the previous bones frame of reference.

                                tmpMtx.createRotationMatrix( this.bones[i-1].getDirectionUV() );
                                hingeRotationAxis = joint.getHingeRotationAxis().clone().applyM3( tmpMtx );

                            } else {// ...basebone? Need to construct matrix from the relative constraint UV.

                                hingeRotationAxis = this.baseboneRelativeConstraintUV;

                            }

                            // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                            boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );

                            // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
                        break;
                    }
                //}
                    
                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
                // so we can set the new inner joint location to be the end joint location of this bone plus the
                // outer-to-inner direction unit vector multiplied by the length of the bone.
                var newStartLocation = bone.end.plus( boneOuterToInnerUV.multiplyScalar( boneLength ) );

                // Set the new start joint location for this bone
                bone.setStartLocation( newStartLocation );

                // If we are not working on the basebone, then we also set the end joint location of
                // the previous bone in the chain (i.e. the bone closer to the base) to be the new
                // start joint location of this bone.
                if (i > 0) this.bones[i-1].setEndLocation( newStartLocation );
                
            } else { // If we ARE working on the end effector bone...
            
                // Snap the end effector's end location to the target
                bone.setEndLocation( target );
                
                // Get the UV between the target / end-location (which are now the same) and the start location of this bone
                var boneOuterToInnerUV = bone.getDirectionUV().negated();
                
                // If the end effector is global hinged then we have to snap to it, then keep that
                // resulting outer-to-inner UV in the plane of the hinge rotation axis
                switch ( jointType ) {
                    case J_BALL:
                        // Ball joints do not get constrained on this forward pass
                    break;                      
                    case J_GLOBAL:
                        hingeRotationAxis = joint.getHingeRotationAxis();
                        // Global hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane
                        boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );
                    break;
                    case J_LOCAL:
                        // Local hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane
                        
                        // Construct a rotation matrix based on the previous bones inner-to-to-inner direction...
                        tmpMtx.createRotationMatrix( this.bones[i-1].getDirectionUV() );
                        
                        // ...and transform the hinge rotation axis into the previous bones frame of reference.
                        hingeRotationAxis = joint.getHingeRotationAxis().clone().applyM3( tmpMtx );
                                            
                        // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                        boneOuterToInnerUV.projectOnPlane( hingeRotationAxis );
                    break;
                }
                                                
                // Calculate the new start joint location as the end joint location plus the outer-to-inner direction UV
                // multiplied by the length of the bone.
                var newStartLocation = target.plus( boneOuterToInnerUV.multiplyScalar( boneLength ) );
                
                // Set the new start joint location for this bone to be new start location...
                bone.setStartLocation( newStartLocation );

                // ...and set the end joint location of the bone further in to also be at the new start location (if there IS a bone
                // further in - this may be a single bone chain)
                if (i > 0) this.bones[i-1].setEndLocation( newStartLocation );
                
            }
            
        } // End of forward pass

        // ---------- Backward pass from base to end effector -----------
 
        for ( i = 0; i < this.numBones; i++ ){

            bone = this.bones[i];
            boneLength  = bone.length;
            joint = bone.joint;
            jointType = joint.type;

            // If we are not working on the basebone
            if ( i !== 0 ){

                // Get the inner-to-outer direction of this bone as well as the previous bone to use as a baseline
                var boneInnerToOuterUV = bone.getDirectionUV();

                var prevBoneInnerToOuterUV = this.bones[i-1].getDirectionUV();

                //var hingeRotationAxis, hingeReferenceAxis;

                switch ( jointType ) {

                    case J_BALL:

                        // Keep this bone direction constrained within the rotor about the previous bone direction
                        boneInnerToOuterUV.limitAngle( prevBoneInnerToOuterUV, tmpMtx, joint.rotor );

                    break;    
                    case J_GLOBAL:

                        // Get the hinge rotation axis and project our inner-to-outer UV onto it
                        hingeRotationAxis  = joint.getHingeRotationAxis();
                        hingeReferenceAxis = joint.getHingeReferenceAxis();

                        boneInnerToOuterUV.projectOnPlane( hingeRotationAxis );

                        // Constrain rotation about reference axis if required
                        if( !joint.freeHinge ) boneInnerToOuterUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, joint.min, joint.max );

                    break;
                    case J_LOCAL:

                        // Transform the hinge rotation axis to be relative to the previous bone in the chain
                        // Construct a rotation matrix based on the previous bone's direction
                        tmpMtx.createRotationMatrix( prevBoneInnerToOuterUV );
                        
                        // Transform the hinge rotation axis into the previous bone's frame of reference
                        hingeRotationAxis  = joint.getHingeRotationAxis().clone().applyM3( tmpMtx );
                        hingeReferenceAxis = joint.getHingeReferenceAxis().clone().applyM3( tmpMtx );

                        
                        // Project this bone direction onto the plane described by the hinge rotation axis
                        // Note: The returned vector is normalised.
                        boneInnerToOuterUV.projectOnPlane( hingeRotationAxis );

                        // Constrain rotation about reference axis if required
                        if( !joint.freeHinge ) boneInnerToOuterUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, joint.min, joint.max );

                    break;

                }
                
                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
                // so we can set the new inner joint location to be the end joint location of this bone plus the
                // outer-to-inner direction unit vector multiplied by the length of the bone.
                var newEndLocation = bone.start.plus( boneInnerToOuterUV.multiplyScalar( boneLength ) );

                // Set the new start joint location for this bone
                bone.setEndLocation( newEndLocation );

                // If we are not working on the end effector bone, then we set the start joint location of the next bone in
                // the chain (i.e. the bone closer to the target) to be the new end joint location of this bone.
                if (i < (this.numBones - 1)) { this.bones[i+1].setStartLocation( newEndLocation ); }

            } else { // If we ARE working on the basebone...
               
                // If the base location is fixed then snap the start location of the basebone back to the fixed base...
                if ( this.fixedBaseMode ){

                    bone.setStartLocation( this.baseLocation );

                } else { // ...otherwise project it backwards from the end to the start by its length.
                
                    bone.setStartLocation( bone.end.minus( bone.getDirectionUV().multiplyScalar( boneLength ) ) );

                }

                // Get the inner-to-outer direction of this bone
                var boneInnerToOuterUV = bone.getDirectionUV();

                var hingeRotationAxis, hingeReferenceAxis;

                switch ( this.baseboneConstraintType ){

                    case NONE:  // Nothing to do because there's no basebone constraint
                    break; 
                    case GLOBAL_ROTOR: 

                        boneInnerToOuterUV.limitAngle( this.baseboneConstraintUV, tmpMtx, joint.rotor );

                    break;
                    case LOCAL_ROTOR:

                        boneInnerToOuterUV.limitAngle( this.baseboneRelativeConstraintUV, tmpMtx, joint.rotor );

                    break;
                    case GLOBAL_HINGE:

                        hingeRotationAxis  = joint.getHingeRotationAxis();
                        hingeReferenceAxis = joint.getHingeReferenceAxis();

                        // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
                        boneInnerToOuterUV.projectOnPlane( hingeRotationAxis );

                        // Constrain as necessary
                        if( !joint.freeHinge ) boneInnerToOuterUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, joint.min, joint.max );
                        
                    break;
                    case LOCAL_HINGE:

                        hingeRotationAxis  = this.baseboneRelativeConstraintUV;
                        hingeReferenceAxis = this.baseboneRelativeReferenceConstraintUV;

                        // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
                        //var boneInnerToOuterUV = bone.getDirectionUV();
                        boneInnerToOuterUV.projectOnPlane( hingeRotationAxis );

                        // Constrain as necessary
                        if( !joint.freeHinge ) boneInnerToOuterUV.constrainedUV( hingeReferenceAxis, hingeRotationAxis, tmpMtx, joint.min, joint.max );

                    break;

                }


                // Set the new end location of this bone, and if there are more bones,
                // then set the start location of the next bone to be the end location of this bone
                var newEndLocation = bone.start.plus( boneInnerToOuterUV.multiplyScalar( boneLength ) );
                bone.setEndLocation( newEndLocation );    
                
                if ( this.numBones > 1 ) { this.bones[1].setStartLocation( newEndLocation ); }

            } // End of basebone handling section

        } // End of backward-pass i over all bones

        // Update our last target location
        this.lastTargetLocation.copy( target );
                
        // DEBUG - check the live chain length and the originally calculated chain length are the same
        // if (Math.abs( this.getLiveChainLength() - chainLength) > 0.01) Tools.error(""Chain length off by > 0.01");
  
        // Finally, calculate and return the distance between the current effector location and the target.
        //return _Math.distanceBetween( this.bones[this.numBones-1].end, target );
        return this.bones[this.numBones-1].end.distanceTo( target );

    },

    updateChainLength: function () {

        // Loop over all the bones in the chain, adding the length of each bone to the chainLength property
        this.chainLength = 0;
        var i = this.numBones;
        while(i--) this.chainLength += this.bones[i].length;

    },

    cloneBones: function () {

        // Use clone to create a new Bone with the values from the source Bone.
        var chain = [];
        for ( var i = 0, n = this.bones.length; i < n; i++ ) chain.push( this.bones[i].clone() );
        return chain;

    }

} );

function Structure3D ( scene ) {

    this.fixedBaseMode = true;

    this.chains = [];
    this.meshChains = [];
    this.targets = [];
    this.numChains = 0;

    this.scene = scene;

    this.tmpMtx = new FIK.M3();

    this.isWithMesh = false;

}

Object.assign( Structure3D.prototype, {

    update:function(){

        var chain, mesh, bone, target;
        var hostChainNumber;
        var hostBone, constraintType;

        //var i =  this.numChains;

        //while(i--){

        for( var i = 0; i < this.numChains; i++ ){

            chain = this.chains[i];
            target = this.targets[i];

            hostChainNumber = chain.getConnectedChainNumber();

            if ( hostChainNumber !== -1 ){

                hostBone  = this.chains[ hostChainNumber ].bones[ chain.getConnectedBoneNumber() ];

                chain.setBaseLocation( chain.getBoneConnectionPoint() === START ? hostBone.start : hostBone.end );

                // Now that we've clamped the base location of this chain to the start or end point of the bone in the chain we are connected to, it's
                // time to deal with any base bone constraints...

                constraintType = chain.getBaseboneConstraintType();

                switch (constraintType){

                    case NONE:         // Nothing to do because there's no basebone constraint
                    case GLOBAL_ROTOR: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                    case GLOBAL_HINGE: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                        break;
                        
                    // If we have a local rotor or hinge constraint then we must calculate the relative basebone constraint before calling solveForTarget
                    case LOCAL_ROTOR:
                    case LOCAL_HINGE:

                    //chain.resetTarget(); // ??

                    // Get the direction of the bone this chain is connected to and create a rotation matrix from it.
                    this.tmpMtx.createRotationMatrix( hostBone.getDirectionUV() );
                    //var connectionBoneMatrix = new FIK.M3().createRotationMatrix( hostBone.getDirectionUV() );
                        
                    // We'll then get the basebone constraint UV and multiply it by the rotation matrix of the connected bone 
                    // to make the basebone constraint UV relative to the direction of bone it's connected to.
                    //var relativeBaseboneConstraintUV = connectionBoneMatrix.times( c.getBaseboneConstraintUV() ).normalize();
                    var relativeBaseboneConstraintUV = chain.getBaseboneConstraintUV().clone().applyM3( this.tmpMtx );
                            
                    // Update our basebone relative constraint UV property
                    chain.setBaseboneRelativeConstraintUV( relativeBaseboneConstraintUV );
                        
                    // Update the relative reference constraint UV if we hav a local hinge
                    if (constraintType === LOCAL_HINGE )
                        chain.setBaseboneRelativeReferenceConstraintUV( chain.bones[0].joint.getHingeReferenceAxis().clone().applyM3( this.tmpMtx ) );
                        
                    break;

                }

                
                

            }

            // Finally, update the target and solve the chain

            if ( !chain.useEmbeddedTarget ) chain.solveForTarget( target );
            else chain.solveForEmbeddedTarget();

            // update 3d mesh

            if( this.isWithMesh ){

                mesh = this.meshChains[i];

                for ( var j = 0; j < chain.numBones; j++ ) {
                    bone = chain.bones[j];
                    mesh[j].position.copy( bone.start );
                    mesh[j].lookAt( bone.end );
                }

            }

        }

    },

    clear:function(){

        this.clearAllBoneMesh();

        var i;

        i = this.numChains;
        while(i--){
            this.remove(i);
        }

        this.chains = [];
        this.meshChains = [];
        this.targets = [];

    },

    add:function( chain, target, meshBone ){

        this.chains.push( chain );
         
        this.targets.push( target ); 
        this.numChains ++;

        if( meshBone ) this.addChainMeshs( chain );
    },

    

    remove:function( id ){

        this.chains[id].clear();
        this.chains.splice(id, 1);
        this.meshChains.splice(id, 1);
        this.targets.splice(id, 1);
        this.numChains --;

    },

    setFixedBaseMode:function( value ){

        this.fixedBaseMode = value; 
        var i = this.numChains, host;
        while(i--){
            host = this.chains[i].getConnectedChainNumber();
            if( host===-1 ) this.chains[i].setFixedBaseMode( this.fixedBaseMode );
        }

    },

    getNumChains:function(){

        return this.numChains;

    },

    getChain:function(id){

        return this.chains[id];

    },

    connectChain : function( Chain, chainNumber, boneNumber, point, target, meshBone, color ){

        var c = chainNumber;
        var n = boneNumber;

        if ( chainNumber > this.numChains ) return;
        if ( boneNumber > this.chains[chainNumber].numBones ) return;

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        var chain = Chain.clone();//new Fullik.Chain( newChain );
        if( color !== undefined ) chain.setColor( color );

        // Connect the copy of the provided chain to the specified chain and bone in this structure
        //chain.connectToStructure( this, chainNumber, boneNumber );

        chain.setBoneConnectionPoint( point === 'end' ? END : START );
        chain.setConnectedChainNumber( c );
        chain.setConnectedBoneNumber( n );

        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start location of the given bone in the given chain.

        var position = point === 'end' ? this.chains[ c ].bones[ n ].end : this.chains[ c ].bones[ n ].start;
         

        chain.setBaseLocation( position );
        // When we have a chain connected to a another 'host' chain, the chain is which is connecting in
        // MUST have a fixed base, even though that means the base location is 'fixed' to the connection
        // point on the host chain, rather than a static location.
        chain.setFixedBaseMode( true );

        // Translate the chain we're connecting to the connection point
        for ( var i = 0; i < chain.numBones; i++ ){

            chain.bones[i].start.add( position );
            chain.bones[i].end.add( position );

        }
        
        this.add( chain, target, meshBone );

    },


    // 3D THREE

    addChainMeshs:function( chain, id ){

        this.isWithMesh = true;

        var meshBone = [];
        var lng  = chain.bones.length;
        for(var i = 0; i < lng; i++ ){
            meshBone.push( this.addBoneMesh( chain.bones[i], i-1, meshBone, chain ));
        }

        this.meshChains.push( meshBone );

    },

    addBoneMesh:function( bone, prev, ar, chain ){

        var size = bone.length;
        var color = bone.color;
        var g = new THREE.CylinderBufferGeometry ( 1, 0.5, size, 4 );
        g.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
        g.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, size*0.5 ) );
        var m = new THREE.MeshStandardMaterial({ color:color, wireframe:false, shadowSide:false });

        var m2 = new THREE.MeshBasicMaterial({ wireframe : true });
        //var m4 = new THREE.MeshBasicMaterial({ wireframe : true, color:color, transparent:true, opacity:0.3 });

        var extraMesh = null;
        var extraGeo;

        var type = bone.joint.type;
        switch(type){
            case J_BALL :
                m2.color.setHex(0xFF6600);
                var angle = bone.joint.rotor;
             
                if(angle === Math.PI) break;
                var s = 2;//size/4;
                var r = 2;//
                extraGeo = new THREE.CylinderBufferGeometry ( 0, r, s, 6,1, true );
                extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
                extraGeo.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, s*0.5 ) );
                extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case J_GLOBAL :
            var axe =  bone.joint.getHingeRotationAxis();
            //console.log( axe );
            var a1 = bone.joint.min;
            var a2 = bone.joint.max;
            var r = 2;
            //console.log('global', a1, a2)
            m2.color.setHex(0xFFFF00);
            extraGeo = new THREE.CircleBufferGeometry( r, 12, a1, -a1+a2 );
            //extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            if( axe.z === 1 ) extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            if( axe.y === 1 ) {extraGeo.applyMatrix( new THREE.Matrix4().makeRotationY( -Math.PI*0.5 ) );extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );}
            if( axe.x === 1 ) {  extraGeo.applyMatrix(new THREE.Matrix4().makeRotationY( Math.PI*0.5 ));}

            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case J_LOCAL :

            var axe =  bone.joint.getHingeRotationAxis();
            

            var r = 2;
            var a1 = bone.joint.min;
            var a2 = bone.joint.max;
            //console.log('local', a1, a2)
            m2.color.setHex(0x00FFFF);
            extraGeo = new THREE.CircleBufferGeometry( r, 12, a1, -a1+a2 );
            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );

            if( axe.z === 1 ) { extraGeo.applyMatrix( new THREE.Matrix4().makeRotationY( -Math.PI*0.5 ) ); extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI*0.5 ) );}
            if( axe.x === 1 ) extraGeo.applyMatrix( new THREE.Matrix4().makeRotationZ( -Math.PI*0.5 ) );
            if( axe.y === 1 ) { extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI*0.5 ) ); extraGeo.applyMatrix(new THREE.Matrix4().makeRotationY( Math.PI*0.5 ));}

            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
        }

        var axe = new THREE.AxesHelper(1.5);
        //var bw = new THREE.Mesh( g,  m4 );

        var b = new THREE.Mesh( g,  m );
        b.add(axe);
        //b.add(bw);
        this.scene.add( b );

        b.castShadow = true;
        b.receiveShadow = true;

        if( prev !== -1 ){
            if( extraMesh !== null ){ 
                if(type!==J_GLOBAL){
                    extraMesh.position.z = chain.bones[prev].length;
                    ar[prev].add( extraMesh );
                } else {
                    b.add( extraMesh );
                }
                
            }
        } else {
             if( extraMesh !== null ) b.add( extraMesh );
        }
       
        return b;

    },

    clearAllBoneMesh:function(){

        if(!this.isWithMesh) return;

        var i, j, b;

        i = this.meshChains.length;
        while(i--){
            j = this.meshChains[i].length;
            while(j--){
                b = this.meshChains[i][j];
                this.scene.remove( b );
                b.geometry.dispose();
                b.material.dispose();
            }
            this.meshChains[i] = [];
        }
        this.meshChains = [];

    }

} );

function Joint2D( clockwise, antiClockwise, coordSystem ){

    this.coordinateSystem = coordSystem || J_LOCAL;

    this.min = clockwise !== undefined ? -clockwise * TORAD : -PI;
    this.max = antiClockwise !== undefined ? antiClockwise * TORAD : PI;
    
}

Object.assign( Joint2D.prototype, {

    isJoint2D: true,

    clone: function () {

        var j = new Joint2D();

        j.coordinateSystem = this.coordinateSystem;
        j.max = this.max;
        j.min = this.min;

        return j;

    },

    validateAngle: function ( a ) {

        a = a < 0 ? 0 : a;
        a = a > 180 ? 180 : a;
        return a;

    },

    // SET

    set: function ( joint ) {

        this.max = joint.max;
        this.min = joint.min;
        this.coordinateSystem = joint.coordinateSystem;

    },

    setClockwiseConstraintDegs: function ( angle ) {

        // 0 to -180 degrees represents clockwise rotation
        this.min = - (this.validateAngle( angle ) * TORAD);
        
    },

    setAnticlockwiseConstraintDegs: function ( angle ) {

        // 0 to 180 degrees represents anti-clockwise rotation
        this.max = this.validateAngle( angle ) * TORAD;
        
    },

    setConstraintCoordinateSystem: function ( coordSystem ) {

        this.coordinateSystem = coordSystem;

    },


    // GET

    getConstraintCoordinateSystem: function () {

        return this.coordinateSystem;

    },

} );

function Bone2D ( Start, End, directionUV, length, clockwiseDegs, anticlockwiseDegs, color ) {

    this.start = new V2();
    this.end = new V2();
    this.length = length || 0;

    this.joint = new Joint2D( clockwiseDegs, anticlockwiseDegs );

    this.globalConstraintUV = new V2(1, 0);
    this.boneConnectionPoint = END;

    this.color = color || null;
    this.name = '';

    // init

    this.setStartLocation( Start );

    if( End ){ 

        this.setEndLocation( End );
        if( this.length === 0 ) this.length = this.getLength();

    } else if ( directionUV ) {

        this.setEndLocation( this.start.plus( directionUV.normalised().multiplyScalar( this.length ) ) );
        
    }

}
Object.assign( Bone2D.prototype, {

    isBone2D: true,

    clone: function () {

        var b = new Bone2D( this.start, this.end );
        b.length = this.length;
        b.globalConstraintUV = this.globalConstraintUV;
        b.boneConnectionPoint = this.boneConnectionPoint;
        b.joint = this.joint.clone();
        b.color = this.color;
        b.name = this.name;
        return b;

    },
    

    // SET

    setName: function ( name ) {

        this.name = name;

    },

    setColor: function ( c ) {

        this.color = c;

    },

    setBoneConnectionPoint: function ( bcp ) {

        this.boneConnectionPoint = bcp;

    },

    setStartLocation: function ( v ) {

        this.start.copy( v );

    },

    setEndLocation: function ( v ) {

        this.end.copy( v );

    },

    setLength:function ( length ) {

        if ( length > 0 ) this.length = length;

    },

    setGlobalConstraintUV: function ( v ) {

        this.globalConstraintUV = v;

    },

    // SET JOINT

    setJoint: function ( joint ) {

        this.joint = joint;

    },

    setClockwiseConstraintDegs: function ( angleDegs ) {

        this.joint.setClockwiseConstraintDegs( angleDegs );

    },

    setAnticlockwiseConstraintDegs: function ( angleDegs ) {

        this.joint.setAnticlockwiseConstraintDegs( angleDegs );

    },

    setJointConstraintCoordinateSystem: function ( coordSystem ) {

        this.joint.setConstraintCoordinateSystem( coordSystem );

    },


    // GET

    getGlobalConstraintUV: function () {

        return this.globalConstraintUV;

    },
    
    getBoneConnectionPoint: function () {

        return this.boneConnectionPoint;

    },

    getDirectionUV: function () {

        return this.end.minus( this.start ).normalize();

    },

    getLength: function () {

        return this.start.distanceTo( this.end );

    },
    

} );

function Chain2D ( color ){

    this.tmpTarget = new V2();

    this.bones = [];
    this.name = '';

    this.solveDistanceThreshold = 1.0;
    this.minIterationChange = 0.01;
    this.maxIteration = 15;
    this.precision = 0.001;
    
    this.chainLength = 0;
    this.numBones = 0;

    this.baseLocation = new V2();
    this.fixedBaseMode = true;

    this.baseboneConstraintType = NONE;

    this.baseboneConstraintUV = new V2();
    this.baseboneRelativeConstraintUV = new V2();

    this.lastTargetLocation = new V2( MAX_VALUE, MAX_VALUE );
    this.lastBaseLocation =  new V2( MAX_VALUE, MAX_VALUE );

    this.boneConnectionPoint = END;
    
    this.currentSolveDistance = MAX_VALUE;
    this.connectedChainNumber = -1;
    this.connectedBoneNumber = -1;

    this.color = color || 0xFFFFFF;

    this.embeddedTarget = new V2();
    this.useEmbeddedTarget = false;

}

Object.assign( Chain2D.prototype, {

    isChain2D: true,

    clone:function(){

        var c = new Chain2D();

        c.solveDistanceThreshold = this.solveDistanceThreshold;
        c.minIterationChange = this.minIterationChange;
        c.maxIteration = this.maxIteration;
        c.precision = this.precision;
        
        c.bones = this.cloneBones();
        c.baseLocation.copy( this.baseLocation );
        c.lastTargetLocation.copy( this.lastTargetLocation );
        c.lastBaseLocation.copy( this.lastBaseLocation );
                
        // Copy the basebone constraint UV if there is one to copy
        if ( !(this.baseboneConstraintType === NONE) ){
            c.baseboneConstraintUV.copy( this.baseboneConstraintUV );
            c.baseboneRelativeConstraintUV.copy( this.baseboneRelativeConstraintUV );
        }       
        
        // Native copy by value for primitive members
        c.fixedBaseMode          = this.fixedBaseMode;
        
        c.chainLength            = this.chainLength;
        c.numBones               = this.numBones;
        c.currentSolveDistance   = this.currentSolveDistance;

        c.boneConnectionPoint    = this.boneConnectionPoint;
        c.connectedChainNumber   = this.connectedChainNumber;
        c.connectedBoneNumber    = this.connectedBoneNumber;
        c.baseboneConstraintType = this.baseboneConstraintType;

        c.color = this.color;

        c.embeddedTarget = this.embeddedTarget.clone();
        c.useEmbeddedTarget = this.useEmbeddedTarget;

        return c;

    },

    

    clear: function () {

        var i = this.numBones;
        while(i--){
            this.removeBone(i);
        }

    },

    addBone: function ( bone ) {

        if( bone.color === null ) bone.setColor( this.color );

        // Add the new bone to the end of the ArrayList of bones
        this.bones.push( bone );
        

        // If this is the basebone...
        if ( this.numBones === 0 ){
            // ...then keep a copy of the fixed start location...
            this.baseLocation.copy( bone.start );
            
            // ...and set the basebone constraint UV to be around the initial bone direction
            this.baseboneConstraintUV.copy( bone.getDirectionUV() );

        }

        // Increment the number of bones in the chain and update the chain length
        this.numBones ++;
        
        // Increment the number of bones in the chain and update the chain length
        this.updateChainLength();

    },

    removeBone: function ( id ) {

        if ( id < this.numBones ){   
            // ...then remove the bone, decrease the bone count and update the chain length.
            this.bones.splice(id, 1);
            this.numBones --;
            this.updateChainLength();
        }

    },

    addConsecutiveBone: function( directionUV, length, clockwiseDegs, anticlockwiseDegs, color ){

        if ( this.numBones === 0 ){ Tools.error('Chain is empty ! need first bone'); return }
        if( directionUV.isBone2D ) { // first argument is bone

            var bone = directionUV;

            // Validate the direction unit vector - throws an IllegalArgumentException if it has a magnitude of zero
            var dir = bone.getDirectionUV();
            _Math.validateDirectionUV( dir );
            
            // Validate the length of the bone - throws an IllegalArgumentException if it is not a positive value
            var len = bone.length;
            _Math.validateLength( len );

            var prevBoneEnd = this.bones[ this.numBones-1 ].end;

            bone.setStartLocation( prevBoneEnd );
            bone.setEndLocation( prevBoneEnd.plus( dir.multiplyScalar( len ) ) );
            
            // Add a bone to the end of this IK chain
            this.addBone( bone );

        } else if( directionUV.isVector2 ) {
            
            color = color || this.color;
             
            // Validate the direction unit vector - throws an IllegalArgumentException if it has a magnitude of zero
            _Math.validateDirectionUV( directionUV );
            
            // Validate the length of the bone - throws an IllegalArgumentException if it is not a positive value
            _Math.validateLength( length );
                    
            // Get the end location of the last bone, which will be used as the start location of the new bone
            var prevBoneEnd = this.bones[ this.numBones-1 ].end;
                    
            // Add a bone to the end of this IK chain
            this.addBone( new Bone2D( prevBoneEnd, null, directionUV.normalised(), length, clockwiseDegs, anticlockwiseDegs, color ) );
            

        }
        
    },


    // -------------------------------
    //      GET
    // -------------------------------

    getBoneConnectionPoint: function () {

        return this.boneConnectionPoint;

    },

    getConnectedBoneNumber:function () {

        return this.connectedBoneNumber;

    },

    getConnectedChainNumber:function(){

        return this.connectedChainNumber;

    },

    getEmbeddedTarget:function () {

        return this.embeddedTarget;

    },

    getBaseboneConstraintType: function () {

        return this.baseboneConstraintType;

    },

    getBaseboneConstraintUV:function(){

        if ( !(this.baseboneConstraintType === NONE) ) return this.baseboneConstraintUV;

    },

    getBaseLocation:function(){

        return this.bones[0].start;

    },

    getEffectorLocation: function () {

        return this.bones[this.numBones-1].end;

    },

    getLastTargetLocation: function () {

        return this.lastTargetLocation;

    },

    getLiveChainLength: function () {

        var lng = 0;
        var i = this.numBones;
        while( i-- ) lng += this.bones[i].getLength();
        return lng;

    },


    // -------------------------------
    //      SET
    // -------------------------------

    setColor: function ( color ) {

        this.color = color;
        var i = this.numBones;
        while( i-- ) this.bones[i].setColor( this.color );
        
    },

    setBaseboneRelativeConstraintUV: function ( constraintUV ) { 

        this.baseboneRelativeConstraintUV = constraintUV; 

    },

    setConnectedBoneNumber: function ( boneNumber ) {

        this.connectedBoneNumber = boneNumber;

    },

    setConnectedChainNumber: function ( chainNumber ) {

        this.connectedChainNumber = chainNumber;

    },

    setBoneConnectionPoint: function ( point ) {

        this.boneConnectionPoint = point;

    },

    setBaseboneConstraintUV: function ( constraintUV ) {

        _Math.validateDirectionUV( constraintUV );
        this.baseboneConstraintUV.copy( constraintUV.normalised() );

    },

    setBaseLocation : function( baseLocation ){

        this.baseLocation.copy( baseLocation );

    },

    setBaseboneConstraintType: function ( value ) {

        this.baseboneConstraintType = value;

    },

    setFixedBaseMode: function ( value ) {

        // Enforce that a chain connected to another chain stays in fixed base mode (i.e. it moves with the chain it's connected to instead of independently)
        if ( !value && this.connectedChainNumber !== -1) return;
        if ( this.baseboneConstraintType === GLOBAL_ABSOLUTE && !value ) return;
        // Above conditions met? Set the fixedBaseMode
        this.fixedBaseMode = value;

    },

    setMaxIterationAttempts: function ( maxIteration ) {

        if ( maxIteration < 1 ) return;
        this.maxIteration = maxIteration;

    },

    setMinIterationChange: function ( minIterationChange ) {

        if (minIterationChange < 0) return;
        this.minIterationChange = minIterationChange;

    },

    setSolveDistanceThreshold: function ( solveDistance ) {

        if ( solveDistance < 0 ) return;
        this.solveDistanceThreshold = solveDistance;

    },

    // -------------------------------
    //
    //      UPDATE TARGET
    //
    // -------------------------------

    solveForEmbeddedTarget: function () {

        if ( this.useEmbeddedTarget ) return this.solveForTarget( this.embeddedTarget );

    },

    resetTarget: function(){

        this.lastBaseLocation = new V2( MAX_VALUE, MAX_VALUE );
        this.currentSolveDistance = MAX_VALUE;

    },


    // Solve the IK chain for this target to the best of our ability.
    // The end result of running this method is that the IK chain configuration is updated.

    // To minimuse CPU usage, this method dynamically aborts if:
    // - The solve distance (i.e. distance between the end effector and the target) is below the solveDistanceThreshold,
    // - A solution incrementally improves on the previous solution by less than the minIterationChange, or
    // - The number of attempts to solve the IK chain exceeds the maxIteration.

    solveForTarget: function ( t ) {

        this.tmpTarget.set( t.x, t.y );
        var p = this.precision;

        var isSameBaseLocation = this.lastBaseLocation.approximatelyEquals( this.baseLocation, p );

        // If we have both the same target and base location as the last run then do not solve
        if ( this.lastTargetLocation.approximatelyEquals( this.tmpTarget, p ) && isSameBaseLocation ) return this.currentSolveDistance;
        
        // Keep starting solutions and distance
        var startingDistance;
        var startingSolution = null;

        // If the base location of a chain hasn't moved then we may opt to keep the current solution if our 
        // best new solution is worse...
        if ( isSameBaseLocation ) {
            startingDistance = this.bones[ this.numBones-1 ].end.distanceTo( this.tmpTarget );
            startingSolution = this.cloneBones();
        } else {
            // Base has changed? Then we have little choice but to recalc the solution and take that new solution.
            startingDistance = MAX_VALUE;
        }
                        
        // Not the same target? Then we must solve the chain for the new target.
		// We'll start by creating a list of bones to store our best solution
        var bestSolution = [];
        
        // We'll keep track of our best solve distance, starting it at a huge value which will be beaten on first attempt
        var bestSolveDistance = MAX_VALUE;
        var lastPassSolveDistance = MAX_VALUE;
        
        // Allow up to our iteration limit attempts at solving the chain
        var solveDistance;
        
        var i = this.maxIteration;

        while( i-- ){

            // Solve the chain for this target
            solveDistance = this.solveIK( this.tmpTarget );
            
            // Did we solve it for distance? If so, update our best distance and best solution, and also
            // update our last pass solve distance. Note: We will ALWAYS beat our last solve distance on the first run

            if ( solveDistance < bestSolveDistance ) {   

                bestSolveDistance = solveDistance;
                bestSolution = this.cloneBones();
                
                // If we are happy that this solution meets our distance requirements then we can exit the loop now
                if ( solveDistance <= this.solveDistanceThreshold ) break;
                
            } else {

                // Did not solve to our satisfaction? Okay...
                // Did we grind to a halt? If so break out of loop to set the best distance and solution that we have
                if ( Math.abs( solveDistance - lastPassSolveDistance ) < this.minIterationChange )  break;

            }
            
            // Update the last pass solve distance
            lastPassSolveDistance = solveDistance;
            
        }

        // Did we get a solution that's better than the starting solution's to the new target location?
        if ( bestSolveDistance < startingDistance ){
            // If so, set the newly found solve distance and solution as the best found.
            this.currentSolveDistance = bestSolveDistance;
            this.bones = bestSolution;
        } else {
            // Did we make things worse? Then we keep our starting distance and solution!
            this.currentSolveDistance = startingDistance;
            this.bones = startingSolution; 
        }
        
        // Update our last base and target locations so we know whether we need to solve for this start/end configuration next time
        this.lastBaseLocation.copy( this.baseLocation );
        this.lastTargetLocation.copy( this.tmpTarget );
        
        return this.currentSolveDistance;

    },

    // -------------------------------
    //
    //      SOLVE IK
    //
    // -------------------------------

    // Solve the IK chain for the given target using the FABRIK algorithm.
    // retun the best solve distance found between the end-effector of this chain and the provided target.

    solveIK: function ( target ) {

        if ( this.numBones === 0 ) return;

        var bone, boneLength, nextBone, startPosition, endPosition, directionUV, baselineUV;
        
        // ---------- Forward pass from end effector to base -----------

        // Loop over all bones in the chain, from the end effector (numBones-1) back to the basebone (0) 
        var i = this.numBones;

        while( i-- ){

            // Get the length of the bone we're working on
            bone = this.bones[i];
            boneLength  = bone.length;
            

            // If we are NOT working on the end effector bone
            if ( i !== this.numBones - 1 ) {

                nextBone = this.bones[i+1];

                // Get the outer-to-inner unit vector of this bone
                directionUV = bone.getDirectionUV().negate();
                
                // Get the outer-to-inner unit vector of the bone further out
                baselineUV = bone.joint.coordinateSystem === J_LOCAL ? nextBone.getDirectionUV().negate() : bone.getGlobalConstraintUV().negated();
                directionUV.constrainedUV( baselineUV, nextBone.joint.min, nextBone.joint.max );

                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
                // so we can set the new inner joint location to be the end joint location of this bone plus the
                // outer-to-inner direction unit vector multiplied by the length of the bone.
                startPosition = bone.end.plus( directionUV.multiplyScalar( boneLength ) );

                // Set the new start joint location for this bone
                bone.setStartLocation( startPosition );

                // If we are not working on the basebone, then we also set the end joint location of
                // the previous bone in the chain (i.e. the bone closer to the base) to be the new
                // start joint location of this bone.
                if ( i > 0 ) this.bones[i-1].setEndLocation( startPosition );
                
            } else { // If we ARE working on the end effector bone...
            
                // Snap the end effector's end location to the target
                bone.setEndLocation( target );

                // update directionUV
                directionUV = bone.getDirectionUV().negate();

                if ( i > 0 ){

                    // The end-effector bone is NOT the basebone as well
                    // Get the outer-to-inner unit vector of the bone further in
                    baselineUV = bone.joint.coordinateSystem === J_LOCAL ? this.bones[i-1].getDirectionUV().negate() : bone.getGlobalConstraintUV().negated();
                    directionUV.constrainedUV( baselineUV, bone.joint.min, bone.joint.max );

                } else {

                    if(bone.joint.coordinateSystem !== J_LOCAL){

                        // Can constrain if constraining against global coordinate system
                        baselineUV = bone.getGlobalConstraintUV().negated();
                        directionUV.constrainedUV( baselineUV, bone.joint.min, bone.joint.max );

                    }

                }
      
                // Calculate the new start joint location as the end joint location plus the outer-to-inner direction UV
                // multiplied by the length of the bone.
                startPosition = bone.end.plus( directionUV.multiplyScalar( boneLength ) );
                
                // Set the new start joint location for this bone to be new start location...
                bone.setStartLocation( startPosition );

                // ...and set the end joint location of the bone further in to also be at the new start location.
                if ( i > 0 ) this.bones[i-1].setEndLocation( startPosition );
                
            }
            
        } // End of forward pass loop over all bones

        // ---------- Step 2 of 2 - Backward pass from base to end effector -----------
 
        for ( i = 0; i < this.numBones; i++ ){

            bone = this.bones[i];
            boneLength  = bone.length;

            // If we are not working on the basebone
            if ( i !== 0 ){

                // Get the inner-to-outer direction of this bone as well as the previous bone to use as a baseline
                directionUV = bone.getDirectionUV();
                // Constrain the angle between this bone and the inner bone.
                baselineUV = bone.joint.coordinateSystem === J_LOCAL ? this.bones[i-1].getDirectionUV() : bone.getGlobalConstraintUV();
                directionUV.constrainedUV( baselineUV, bone.joint.min, bone.joint.max );

                // At this stage we have an inner-to-outer unit vector for this bone which is within our constraints,
                // so we can set the new end location to be the start location of this bone plus the constrained
                // inner-to-outer direction unit vector multiplied by the length of this bone.
                endPosition = bone.start.plus( directionUV.multiplyScalar(boneLength) );

                // Set the new end joint location for this bone
                bone.setEndLocation( endPosition );

                // If we are not working on the end bone, then we set the start joint location of
                // the next bone in the chain (i.e. the bone closer to the end effector) to be the
                // new end joint location of this bone also.
                if ( i < this.numBones-1 ) this.bones[i+1].setStartLocation( endPosition );
                
            } else {// If we ARE working on the base bone...

                // If the base location is fixed then snap the start location of the base bone back to the fixed base
                if ( this.fixedBaseMode ){

                    bone.setStartLocation( this.baseLocation );

                } else {// If the base location is not fixed...
                
                    // ...then set the new base bone start location to be its the end location minus the
                    // bone direction multiplied by the length of the bone (i.e. projected backwards).
                    startPosition = bone.end.minus( bone.getDirectionUV().multiplyScalar( boneLength ) );
                    bone.setStartLocation( startPosition );

                }

                // update directionUV
                directionUV = bone.getDirectionUV();
                
                // If the base bone is unconstrained then process it as usual...
                if ( this.baseboneConstraintType === NONE ){
    
                    // Calculate the new end location as the start location plus the direction multiplyScalar by the length of the bone
                    endPosition = bone.start.plus( directionUV.multiplyScalar( boneLength ) );
    
                    // Set the new end joint location
                    bone.setEndLocation( endPosition );
    
                    // Also, set the start location of the next bone to be the end location of this bone
                    if ( this.numBones > 1 ) this.bones[1].setStartLocation( endPosition );

                } else {

                    // ...otherwise we must constrain it to the basebone constraint unit vector

                    // LOCAL_ABSOLUTE? (i.e. local-space directional constraint) - then we must constraint about the relative basebone constraint UV...
                    baselineUV = this.baseboneConstraintType === LOCAL_ABSOLUTE ? this.baseboneRelativeConstraintUV : this.baseboneConstraintUV;
                    directionUV.constrainedUV( baselineUV, bone.joint.min, bone.joint.max );

                    //directionUV = bone.getDirectionUV();
                    
                    // At this stage we have an inner-to-outer unit vector for this bone which is within our constraints,
                    // so we can set the new end location to be the start location of this bone plus the constrained
                    // inner-to-outer direction unit vector multiplied by the length of the bone.
                    endPosition = bone.start.plus( directionUV.multiplyScalar( boneLength ) );

                    // Set the new end joint location for this bone
                    bone.setEndLocation( endPosition );

                    // If we are not working on the end bone, then we set the start joint location of
                    // the next bone in the chain (i.e. the bone closer to the end effector) to be the
                    // new end joint location of this bone.
                    if ( i < (this.numBones - 1) ) { this.bones[i+1].setStartLocation( endPosition ); }
                    
                
                } // End of basebone constraint enforcement section         

            } // End of base bone handling section

        } // End of backward-pass loop over all bones

        // Update our last target location
        this.lastTargetLocation.copy( target );
                
        // ...and calculate and return the distance between the current effector location and the target.
        return this.bones[this.numBones-1].end.distanceTo( target );

    },

    updateChainLength: function () {

        // Loop over all the bones in the chain, adding the length of each bone to the mChainLength property
        this.chainLength = 0;
        var i = this.numBones;
        while(i--) this.chainLength += this.bones[i].length;

    },

    cloneBones : function(){

        // Use clone to create a new Bone with the values from the source Bone.
        var chain = [];
        for ( var i = 0, n = this.bones.length; i < n; i++ ) chain.push( this.bones[i].clone() );
        return chain;

    }

} );

function Structure2D ( scene ) {

    this.fixedBaseMode = true;

    this.chains = [];
    this.meshChains = [];
    this.targets = [];
    this.numChains = 0;

    this.scene = scene;

    this.isWithMesh = false;

}

Object.assign( Structure2D.prototype, {

    isStructure2D: true,

    update: function () {

        //console.log('up')

        var chain, mesh, bone, target, tmp = new THREE.Vector3();
        var hostChainNumber;
        var hostBone, constraintType;

        for( var i = 0; i < this.numChains; i++ ){

            chain = this.chains[i];
            
            target = this.targets[i];

            hostChainNumber = chain.getConnectedChainNumber();

            // Get the basebone constraint type of the chain we're working on
            constraintType = chain.getBaseboneConstraintType();

            // If this chain is not connected to another chain and the basebone constraint type of this chain is not global absolute
            // then we must update the basebone constraint UV for LOCAL_RELATIVE and the basebone relative constraint UV for LOCAL_ABSOLUTE connection types.
            // Note: For NONE or GLOBAL_ABSOLUTE we don't need to update anything before calling solveForTarget().
            if ( hostChainNumber !== -1 && constraintType !== GLOBAL_ABSOLUTE ) {   
                // Get the bone which this chain is connected to in the 'host' chain
                var hostBone = this.chains[ hostChainNumber ].bones[ chain.getConnectedBoneNumber() ];

                chain.setBaseLocation( chain.getBoneConnectionPoint() === START ? hostBone.start : hostBone.end );
               
                
                // If the basebone is constrained to the direction of the bone it's connected to...
                var hostBoneUV = hostBone.getDirectionUV();

                if ( constraintType === LOCAL_RELATIVE ){   

                    // ...then set the basebone constraint UV to be the direction of the bone we're connected to.
                    chain.setBaseboneConstraintUV( hostBoneUV );

                } else if ( constraintType === LOCAL_ABSOLUTE ) {   

                    // Note: LOCAL_ABSOLUTE directions are directions which are in the local coordinate system of the host bone.
                    // For example, if the baseboneConstraintUV is Vec2f(-1.0f, 0.0f) [i.e. left], then the baseboneConnectionConstraintUV
                    // will be updated to be left with regard to the host bone.
                    
                    // Get the angle between UP and the hostbone direction
                    var angle = UP.getSignedAngle( hostBoneUV );

                    // ...then apply that same rotation to this chain's basebone constraint UV to get the relative constraint UV... 
                    var relativeConstraintUV = chain.getBaseboneConstraintUV().clone().rotate( angle );
                    
                    // ...which we then update.
                    chain.setBaseboneRelativeConstraintUV( relativeConstraintUV );      

                }
                
                // NOTE: If the basebone constraint type is NONE then we don't do anything with the basebone constraint of the connected chain.
                
            } // End of if chain is connected to another chain section

            // Finally, update the target and solve the chain

            if ( !chain.useEmbeddedTarget ) chain.solveForTarget( target );
            else chain.solveForEmbeddedTarget();


            // update 3d mesh

            if( this.isWithMesh ){

                mesh = this.meshChains[i];

                for ( var j = 0; j < chain.numBones; j++ ) {
                    bone = chain.bones[j];
                    mesh[j].position.set( bone.start.x, bone.start.y, 0 );
                    mesh[j].lookAt( tmp.set( bone.end.x, bone.end.y, 0 ) );
                }

            }


        }

    },

    setFixedBaseMode: function ( value ) {

        // Update our flag and set the fixed base mode on the first (i.e. 0th) chain in this structure.
        this.fixedBaseMode = value; 
        var i = this.numChains, host;
        while(i--){
            host = this.chains[i].getConnectedChainNumber();
            if(host===-1) this.chains[i].setFixedBaseMode( this.fixedBaseMode );
        }
        //this.chains[0].setFixedBaseMode( this.fixedBaseMode );

    },

    clear: function () {

        this.clearAllBoneMesh();

        var i;

        i = this.numChains;
        while(i--){
            this.remove(i);
        }

        this.chains = [];
        this.meshChains = [];
        this.targets = [];

    },

    add:function ( chain, target, meshBone ) {

        this.chains.push( chain );

        //if( target.isVector3 ) target = new V2(target.x, target.y);
         
        this.targets.push( target ); 
        this.numChains ++;

        if( meshBone ) this.addChainMeshs( chain );

    },

    remove:function( id ){

        this.chains[id].clear();
        this.chains.splice(id, 1);
        this.meshChains.splice(id, 1);
        this.targets.splice(id, 1);
        this.numChains --;

    },

    /*setFixedBaseMode:function( fixedBaseMode ){
        for ( var i = 0; i < this.numChains; i++) {
            this.chains[i].setFixedBaseMode( fixedBaseMode );
        }
    },*/

    getNumChains: function () {

        return this.numChains;

    },

    getChain: function ( id ) {

        return this.chains[id];

    },

    connectChain: function ( Chain, chainNumber, boneNumber, point, target, meshBone, color ) {

        var c = chainNumber;
        var n = boneNumber;

        point = point || 'end';

        if ( c > this.numChains ){ Tools.error('Chain not existe !'); return }        if ( n > this.chains[ c ].numBones ){ Tools.error('Bone not existe !'); return }
        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        var chain = Chain.clone();

        chain.setBoneConnectionPoint( point === 'end' ? END : START );
        chain.setConnectedChainNumber( c );
        chain.setConnectedBoneNumber( n );

        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start or end position of the given bone in the given chain.

        var position = point === 'end' ? this.chains[ c ].bones[ n ].end : this.chains[ c ].bones[ n ].start;

        //if ( connectionPoint === 'start' ) connectionLocation = this.chains[chainNumber].getBone(boneNumber).start;
        //else connectionLocation = this.chains[chainNumber].getBone(boneNumber).end;
         

        chain.setBaseLocation( position );

        // When we have a chain connected to a another 'host' chain, the chain is which is connecting in
        // MUST have a fixed base, even though that means the base location is 'fixed' to the connection
        // point on the host chain, rather than a static location.
        chain.setFixedBaseMode( true );

        // Translate the chain we're connecting to the connection point
        for ( var i = 0; i < chain.numBones; i++ ){

            chain.bones[i].start.add( position );
            chain.bones[i].end.add( position );

        }
        
        this.add( chain, target, meshBone );

    },

    // 3D THREE

    addChainMeshs: function ( chain, id ) {

        this.isWithMesh = true;

        var meshBone = [];

        var lng  = chain.bones.length;
        for(var i = 0; i<lng; i++ ){
            meshBone.push( this.addBoneMesh( chain.bones[i] ) );
        }

        this.meshChains.push( meshBone );

    },

    addBoneMesh:function( bone ){

        var size = bone.length;
        var color = bone.color;
        //console.log(bone.color)
        var g = new THREE.CylinderBufferGeometry ( 1, 0.5, size, 4 );
       //g.applyMatrix( new THREE.Matrix4().makeTranslation( 0, size*0.5, 0 ) );
        g.applyMatrix( new THREE.Matrix4().makeRotationX( -_Math.pi90 ) );
        g.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, size*0.5 ) );
        //var m = new THREE.MeshStandardMaterial({ color:color });
        var m = new THREE.MeshStandardMaterial({ color:color, wireframe:false, shadowSide:false });
        //m.color.setHex( color );

        var m2 = new THREE.MeshBasicMaterial({ wireframe : true });

        var extraMesh;

        /*var type = bone.getJoint().type;
        switch(type){
            case J_BALL :
                m2.color.setHex(0xFF6600);
                var angle  = bone.getJoint().mRotorConstraintDegs;
                if(angle === 180) break;
                var s = size/4;
                var r = 2;//

                extraGeo = new THREE.CylinderBufferGeometry ( 0, r, s, 6 );
                extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) )
                extraGeo.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, s*0.5 ) );
                extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case J_GLOBAL_HINGE :
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * _Math.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * _Math.torad;
            var r = 2;
            m2.color.setHex(0xFFFF00);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case J_LOCAL_HINGE :
            var r = 2;
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * _Math.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * _Math.torad;
            m2.color.setHex(0x00FFFF);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
        }*/




        var b = new THREE.Mesh( g,  m );

        b.castShadow = true;
        b.receiveShadow = true;
        
        this.scene.add( b );
        if( extraMesh ) b.add( extraMesh );
        return b;

    },

    clearAllBoneMesh:function(){

        if(!this.isWithMesh) return;

        var i, j, b;

        i = this.meshChains.length;
        while(i--){
            j = this.meshChains[i].length;
            while(j--){
                b = this.meshChains[i][j];
                this.scene.remove( b );
                b.geometry.dispose();
                b.material.dispose();
            }
            this.meshChains[i] = [];
        }
        this.meshChains = [];

    }

} );

//import { NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, J_BALL, J_GLOBAL, J_LOCAL } from '../constants.js';


function IKSolver(){

	this.startBones = null;
	this.endBones = null;

    this.target = null;
    this.goal = null;
    this.swivelAngle = 0;

    this.iteration = 40;

    this.thresholds = { position:0.1, rotation:0.1 };

    this.solver = null;
    this.chain = null;

}

Object.assign( IKSolver.prototype, {

	isIKSolver: true,

} );

//import { NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, J_BALL, J_GLOBAL, J_LOCAL } from '../constants.js';


function HISolver(){

	this.startBones = null;
	this.endBones = null;

    this.target = null;
    this.goal = null;
    this.swivelAngle = 0;

    this.iteration = 40;

    this.thresholds = { position:0.1, rotation:0.1 };

    this.solver = null;
    this.chain = null;

}

Object.assign( HISolver.prototype, {

	isIKSolver: true,

} );

export { _Math, V2, V3, M3, Q, Joint3D, Bone3D, Chain3D, Structure3D, Joint2D, Bone2D, Chain2D, Structure2D, IKSolver, HISolver, REVISION, PRECISION, PRECISION_DEG, MAX_VALUE, PI, TORAD, TODEG, NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, GLOBAL_ABSOLUTE, LOCAL_RELATIVE, LOCAL_ABSOLUTE, J_BALL, J_LOCAL, J_GLOBAL, START, END, X_AXE, Y_AXE, Z_AXE, X_NEG, Y_NEG, Z_NEG, UP, DOWN, LEFT, RIGHT };

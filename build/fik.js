(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.FIK = {})));
}(this, (function (exports) { 'use strict';

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

	//import { V3 } from './V3.js';

	var _Math = {

		MIN_ANGLE_DEGS: 0,
		MAX_ANGLE_DEGS: 180,

		MAX_VALUE: Infinity,

		PRECISION: 0.001,
		PRECISION_DEG: 0.01,

		toRad: Math.PI / 180,
		toDeg: 180 / Math.PI,

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

		sign: function ( v ) {

			return v >= 0 ? 1 : -1; 

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

		    return _Math.nearEquals( _Math.dotProduct(a, b), 0.0, 0.01 ) ? true : false;

		},

		scalarProduct: function ( v1, v2 ) { 

			return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; 

		},
		

		crossProduct: function ( v1, v2 ) { 

		    return v1.clone().set( 
		    	v1.y * v2.z - v1.z * v2.y, 
		    	v1.z * v2.x - v1.x * v2.z, 
		    	v1.x * v2.y - v1.y * v2.x
		    );

		},

		genPerpendicularVectorQuick: function ( v ) {

		    var perp = v.clone();
		    //                            cross(v, UP)                         : cross(v, RIGHT)
		    return Math.abs( v.y ) < 0.99 ? perp.set( -v.z, 0, v.x ).normalize() : perp.set( 0, v.z, -v.y ).normalize();

		},

		genPerpendicularVectorHM: function ( v ) { 

		    var a = v.abs();
		    var b = v.clone();
		    if (a.x <= a.y && a.x <= a.z) return b.set(0, -v.z, v.y).normalize();
		    else if (a.y <= a.x && a.y <= a.z) return b.set(-v.z, 0, v.x).normalize();
		    else return b.set(-v.y, v.x, 0).normalize();

		},

		genPerpendicularVectorFrisvad: function ( v ) { 

			var nv = v.clone();
		    if ( v.z < -0.9999999 ) return nv.set(0., -1, 0);// Handle the singularity
		    var a = 1/(1 + v.z);
		    return nv.set( 1 - v.x * v.x * a, -v.x * v.y * a, -v.x ).normalize();

		},

		getUvBetween: function ( v1, v2 ) {

		     return v2.minus(v1).normalize();

		},

		dotProduct: function ( v1, v2 ) { 

		    var v1Norm = v1.normalised();
		    var v2Norm = v2.normalised();
		    return v1Norm.x * v2Norm.x + v1Norm.y * v2Norm.y + v1Norm.z * v2Norm.z;

		},

		getAngleBetweenRads: function ( v1, v2 ){ 

		    return Math.acos( _Math.dotProduct( v1,  v2 ) );

		},

		getAngleBetweenDegs: function( v1, v2 ){

			var a = _Math.getAngleBetweenRads( v1, v2 ) * _Math.toDeg;
			//console.log(a)
		    return a;

		},

		getDirectionUV: function ( v1, v2 ) {

		    return v2.minus( v1 ).normalize();

		},

		getSignedAngleBetweenDegs: function ( referenceVector, otherVector, normalVector ) {

		    var unsignedAngle = _Math.getAngleBetweenDegs( referenceVector, otherVector );
		    var sign          = _Math.sign( _Math.dotProduct( _Math.crossProduct( referenceVector, otherVector ), normalVector ) ); 

		    return unsignedAngle * sign;

		},


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

		getUnsignedAngleBetweenVectorsDegs: function ( a, b ) {

		    Math.acos( a.normalised().dot( b.normalised() ) ) * this.toDeg;

		},

		zcross: function( a, b ) { //  Method to determine the sign of the angle between two V2 objects.

		    var p = a.x * b.y - b.x * a.y;
			if      ( p > 0 ) return 1; 
			else if ( p < 0 ) return -1;	
			return 0;

		},

		getConstrainedUV: function( directionUV, baselineUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs ) {

		    // Get the signed angle from the baseline UV to the direction UV.
			// Note: In our signed angle ranges:
			//       0...180 degrees represents anti-clockwise rotation, and
			//       0..-180 degrees represents clockwise rotation
			var signedAngleDegs = baselineUV.getSignedAngleDegsTo( directionUV );

			// If we've exceeded the anti-clockwise (positive) constraint angle...
			// ...then our constrained unit vector is the baseline rotated by the anti-clockwise constraint angle.
			// Note: We could do this by calculating a correction angle to apply to the directionUV, but it's simpler to work from the baseline.
			if ( signedAngleDegs > antiClockwiseConstraintDegs ) return this.rotateDegs( baselineUV, antiClockwiseConstraintDegs );
			
			
			// If we've exceeded the clockwise (negative) constraint angle...
			// ...then our constrained unit vector is the baseline rotated by the clockwise constraint angle.
			// Note: Again, we could do this by calculating a correction angle to apply to the directionUV, but it's simpler to work from the baseline.
			if ( signedAngleDegs < -clockwiseConstraintDegs ) return this.rotateDegs( baselineUV, -clockwiseConstraintDegs );
			
			// If we have not exceeded any constraint then we simply return the original direction unit vector
			return directionUV;

		},

		rotateRads: function( v, angleRads ) {

			var cosTheta = Math.cos(angleRads);
			var sinTheta = Math.sin(angleRads);
			return v.clone().set( v.x * cosTheta - v.y * sinTheta,  v.x * sinTheta + v.y * cosTheta );

		},

		rotateDegs: function( v, angleDegs ) {

			return this.rotateRads( v, angleDegs * this.toRad );
	 
		},


		validateDirectionUV: function( directionUV ) {

			if( directionUV.length() < 0) Tools.error("vector direction unit vector cannot be zero.");
	 
		},

		validateLength: function( length ) {

			if(length < 0) Tools.error("Length must be a greater than or equal to zero.");
	 
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

		approximatelyEquals: function ( v, t ) {

		    if ( t < 0 ) return;
		    var xDiff = Math.abs(this.x - v.x);
		    var yDiff = Math.abs(this.y - v.y);
		    return ( xDiff < t && yDiff < t );

		},

		getSignedAngleDegsTo: function ( otherVector ) { // 2D

		    // Normalise the vectors that we're going to use
			var thisVectorUV  = this.normalised();
			var otherVectorUV = otherVector.normalised();
			// Calculate the unsigned angle between the vectors as the arc-cosine of their dot product
			var unsignedAngleDegs = Math.acos( thisVectorUV.dot(otherVectorUV) ) * _Math.toDeg;
			// Calculate and return the signed angle between the two vectors using the zcross method
			if ( _Math.zcross( thisVectorUV, otherVectorUV ) === 1 ) return unsignedAngleDegs;
			else return -unsignedAngleDegs;
			
		},

	} );

	function V3( x, y, z ){

	    this.x = x || 0;
	    this.y = y || 0;
	    this.z = z || 0;

	}

	Object.assign( V3.prototype, {

		isVector3: true,

		abs: function () {

			return new V3( 
				this.x < 0 ? -this.x : this.x, 
				this.y < 0 ? -this.y : this.y, 
				this.z < 0 ? -this.z : this.z
			);

		},

		set: function( x, y, z ){

		    this.x = x || 0;
		    this.y = y || 0;
		    this.z = z || 0;
		    return this;

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

		length: function () {

			return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

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

		},

		projectOnPlane: function ( planeNormal ) {

		    if ( planeNormal.length() <= 0 ){ Tools.error("Plane normal cannot be a zero vector."); return; }
		        
	        // Projection of vector b onto plane with normal n is defined as: b - ( b.n / ( |n| squared )) * n
	        // Note: |n| is length or magnitude of the vector n, NOT its (component-wise) absolute value        
	        var b = this.normalised();
	        var n = planeNormal.normalised();   

	        return b.minus( n.times( _Math.dotProduct( b, planeNormal ) ) ).normalize();

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

		    if ( t < 0 ) return;
		    var xDiff = Math.abs(this.x - v.x);
		    var yDiff = Math.abs(this.y - v.y);
		    var zDiff = Math.abs(this.z - v.z);
		    return (xDiff < t && yDiff < t && zDiff < t);

		},

		zero: function () {

		    this.x = 0;
		    this.y = 0;
		    this.z = 0;
		    return this;

		},


	} );

	function M3( m00, m01, m02, m10, m11, m12, m20, m21, m22 ){

	    this.m00 = m00 || 1;
	    this.m01 = m01 || 0; 
	    this.m02 = m02 || 0;
	        
	    this.m10 = m10 || 0;
	    this.m11 = m11 || 1; 
	    this.m12 = m12 || 0;
	        
	    this.m20 = m20 || 0;
	    this.m21 = m21 || 0; 
	    this.m22 = m22 || 1;

	}

	Object.assign( M3.prototype, {

		isMatrix3: true,

		setV3: function ( xAxis, yAxis, zAxis ) {

		    this.m00 = xAxis.x;
		    this.m01 = xAxis.y; 
		    this.m02 = xAxis.z;
		        
		    this.m10 = yAxis.x;
		    this.m11 = yAxis.y; 
		    this.m12 = yAxis.z;
		        
		    this.m20 = zAxis.x;
		    this.m21 = zAxis.y; 
		    this.m22 = zAxis.z;

		    return this;

		},

		createRotationMatrix: function ( referenceDirection ) {
	  
		    var zAxis = referenceDirection.normalised();
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

		rotateAboutAxisDegs: function ( v, angleDegs, axis ) {

		    return this.rotateAboutAxisRads( v, angleDegs * _Math.toRad, axis ); 

		},

		rotateAboutAxisRads: function ( v, angleRads, rotationAxis ){

		    var sinTheta = Math.sin( angleRads );
		    var cosTheta = Math.cos( angleRads );
		    var oneMinusCosTheta = 1.0 - cosTheta;
		    
		    // It's quicker to pre-calc these and reuse than calculate x * y, then y * x later (same thing).
		    var xyOne = rotationAxis.x * rotationAxis.y * oneMinusCosTheta;
		    var xzOne = rotationAxis.x * rotationAxis.z * oneMinusCosTheta;
		    var yzOne = rotationAxis.y * rotationAxis.z * oneMinusCosTheta;

		    // Calculate rotated x-axis
		    this.m00 = rotationAxis.x * rotationAxis.x * oneMinusCosTheta + cosTheta;
		    this.m01 = xyOne + rotationAxis.z * sinTheta;
		    this.m02 = xzOne - rotationAxis.y * sinTheta;

		    // Calculate rotated y-axis
		    this.m10 = xyOne - rotationAxis.z * sinTheta;
		    this.m11 = rotationAxis.y * rotationAxis.y * oneMinusCosTheta + cosTheta;
		    this.m12 = yzOne + rotationAxis.x * sinTheta;

		    // Calculate rotated z-axis
		    this.m20 = xzOne + rotationAxis.y * sinTheta;
		    this.m21 = yzOne - rotationAxis.x * sinTheta;
		    this.m22 = rotationAxis.z * rotationAxis.z * oneMinusCosTheta + cosTheta;

		    // Multiply the source by the rotation matrix we just created to perform the rotation
		    return this.times( v );

		},

		getAngleLimitedUnitVectorDegs: function ( vecToLimit, vecBaseline, angleLimitDegs ) {

		    // Get the angle between the two vectors
		    // Note: This will ALWAYS be a positive value between 0 and 180 degrees.
		    var angleBetweenVectorsDegs = _Math.getAngleBetweenDegs( vecBaseline, vecToLimit );
		    
		    if ( angleBetweenVectorsDegs > angleLimitDegs ) {           
		        // The axis which we need to rotate around is the one perpendicular to the two vectors - so we're
		        // rotating around the vector which is the cross-product of our two vectors.
		        // Note: We do not have to worry about both vectors being the same or pointing in opposite directions
		        // because if they bones are the same direction they will not have an angle greater than the angle limit,
		        // and if they point opposite directions we will approach but not quite reach the precise max angle
		        // limit of 180.0f (I believe).
		        var correctionAxis = _Math.crossProduct( vecBaseline.normalised(), vecToLimit.normalised() ).normalize();
		        
		        // Our new vector is the baseline vector rotated by the max allowable angle about the correction axis
		        return this.rotateAboutAxisDegs( vecBaseline, angleLimitDegs, correctionAxis ).normalize();
		    }
		    else // Angle not greater than limit? Just return a normalised version of the vecToLimit
		    {
		        // This may already BE normalised, but we have no way of knowing without calcing the length, so best be safe and normalise.
		        // TODO: If performance is an issue, then I could get the length, and if it's not approx. 1.0f THEN normalise otherwise just return as is.
		        return vecToLimit.normalised();
		    }


		},

		transpose: function ( m ) {

		    return new M3( m.m00, m.m10, m.m20,   m.m01, m.m11, m.m21,   m.m02, m.m12, m.m22 );

		},

		zero: function () {

		    this.m00 = this.m01 = this.m02 = this.m10 = this.m11 = this.m12 = this.m20 = this.m21 = this.m22 = 0;
		    return this;

		},

		setIdentity: function () {

		    this.m00 = this.m11 = this.m22 = 1;
		    this.m01 = this.m02 = this.m10 = this.m12 = this.m20 = this.m21 = 0;
		    return this;

		},

		determinant: function(){

		    return this.m20 * this.m01 * this.m12 - this.m20  * this.m02 * this.m11 - this.m10 * this.m01 * this.m22 + this.m10 * this.m02 * this.m21 + this.m00 * this.m11 * this.m22 - this.m00 * this.m12 * this.m21;

		},

		times: function ( m ) {

			if( m.isVector3 ){

				return new V3(
			        this.m00 * m.x + this.m10 * m.y + this.m20 * m.z,
			        this.m01 * m.x + this.m11 * m.y + this.m21 * m.z,
			        this.m02 * m.x + this.m12 * m.y + this.m22 * m.z
			    );

			} else if( m.isMatrix3 ){

				var temp = new M3();

			    temp.m00 = this.m00 * m.m00 + this.m10 * m.m01 + this.m20 * m.m02;
			    temp.m01 = this.m01 * m.m00 + this.m11 * m.m01 + this.m21 * m.m02;
			    temp.m02 = this.m02 * m.m00 + this.m12 * m.m01 + this.m22 * m.m02;

			    temp.m10 = this.m00 * m.m10 + this.m10 * m.m11 + this.m20 * m.m12;
			    temp.m11 = this.m01 * m.m10 + this.m11 * m.m11 + this.m21 * m.m12;
			    temp.m12 = this.m02 * m.m10 + this.m12 * m.m11 + this.m22 * m.m12;

			    temp.m20 = this.m00 * m.m20 + this.m10 * m.m21 + this.m20 * m.m22;
			    temp.m21 = this.m01 * m.m20 + this.m11 * m.m21 + this.m21 * m.m22;
			    temp.m22 = this.m02 * m.m20 + this.m12 * m.m21 + this.m22 * m.m22;

			    return temp;

			}

		},

		isOrthogonal: function () {

		    var xCrossYDot = _Math.dotProduct( this.getXBasis(), this.getYBasis() );
		    var xCrossZDot = _Math.dotProduct( this.getXBasis(), this.getZBasis() );
		    var yCrossZDot = _Math.dotProduct( this.getYBasis(), this.getZBasis() );
		    
		    if ( _Math.nearEquals(xCrossYDot, 0,  0.01) && _Math.nearEquals(xCrossZDot, 0,  0.01) && _Math.nearEquals(yCrossZDot, 0,  0.01) ) return true;
		    return false;

		},

		inverse: function ( m ) {

		    var d = 1 / m.determinant();
		        
		    var temp = new M3();
		    
		    temp.m00 =  (m.m11  * m.m22 - m.m12 * m.m21) * d;
		    temp.m01 = -(m.m01  * m.m22 - m.m02 * m.m21) * d;
		    temp.m02 =  (m.m01  * m.m12 - m.m02 * m.m11) * d;
		    temp.m10 = -(-m.m20 * m.m12 + m.m10 * m.m22) * d;
		    temp.m11 =  (-m.m20 * m.m02 + m.m00 * m.m22) * d;
		    temp.m12 = -(-m.m10 * m.m02 + m.m00 * m.m12) * d;
		    temp.m20 =  (-m.m20 * m.m11 + m.m10 * m.m21) * d;
		    temp.m21 = -(-m.m20 * m.m01 + m.m00 * m.m21) * d;
		    temp.m22 =  (-m.m10 * m.m02 + m.m00 * m.m11) * d;

		    return temp;

		},

		rotateRads: function ( rotationAxis, angleRads ) {

		    var dest = new M3();

		    var sin         =  Math.sin( angleRads );
		    var cos         =  Math.cos( angleRads );     
		    var oneMinusCos = 1 - cos;

		    var xy = rotationAxis.x * rotationAxis.y;
		    var yz = rotationAxis.y * rotationAxis.z;
		    var xz = rotationAxis.x * rotationAxis.z;
		    var xs = rotationAxis.x * sin;
		    var ys = rotationAxis.y * sin;
		    var zs = rotationAxis.z * sin;

		    var f00 = rotationAxis.x * rotationAxis.x * oneMinusCos + cos;
		    var f01 = xy * oneMinusCos + zs;
		    var f02 = xz * oneMinusCos - ys;

		    var f10 = xy * oneMinusCos - zs;
		    var f11 = rotationAxis.y * rotationAxis.y * oneMinusCos + cos;
		    var f12 = yz * oneMinusCos + xs;

		    var f20 = xz * oneMinusCos + ys;
		    var f21 = yz * oneMinusCos - xs;
		    var f22 = rotationAxis.z * rotationAxis.z * oneMinusCos + cos;

		    var t00 = this.m00 * f00 + this.m10 * f01 + this.m20 * f02;
		    var t01 = this.m01 * f00 + this.m11 * f01 + this.m21 * f02;
		    var t02 = this.m02 * f00 + this.m12 * f01 + this.m22 * f02;

		    var t10 = this.m00 * f10 + this.m10 * f11 + this.m20 * f12;
		    var t11 = this.m01 * f10 + this.m11 * f11 + this.m21 * f12;
		    var t12 = this.m02 * f10 + this.m12 * f11 + this.m22 * f12;

		    // Construct and return rotation matrix
		    dest.m20 = this.m00 * f20 + this.m10 * f21 + this.m20 * f22;
		    dest.m21 = this.m01 * f20 + this.m11 * f21 + this.m21 * f22;
		    dest.m22 = this.m02 * f20 + this.m12 * f21 + this.m22 * f22;

		    dest.m00 = t00;
		    dest.m01 = t01;
		    dest.m02 = t02;

		    dest.m10 = t10;
		    dest.m11 = t11;
		    dest.m12 = t12;

		    return dest;

		},

		rotateDegs: function ( angleDegs, localAxis ) {

		    return this.rotateRads( localAxis, angleDegs * _Math.toRad ); 

		},

		setXBasis: function ( v ) {

		    this.m00 = v.x; this.m01 = v.y; this.m02 = v.z;

		},

		setYBasis: function ( v ) {

		    this.m10 = v.x; this.m11 = v.y; this.m12 = v.z;

		},

		setZBasis: function ( v ) {
		    
		    this.m20 = v.x; this.m21 = v.y; this.m22 = v.z;

		},

		getXBasis: function() {

		    return new V3( this.m00, this.m01, this.m02 );
		    
		},

		getYBasis: function(){

		    return new V3( this.m10, this.m11, this.m12 );

		},

		getZBasis: function () {

		    return new V3( this.m20, this.m21, this.m22 );

		}


	} );

	/*
	 * A list of constants built-in for
	 * the Fik engine.
	 */

	var REVISION = '1.3.3';



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

	var MTX = new M3();

	function Joint3D(){

	    this.mRotorConstraintDegs = _Math.MAX_ANGLE_DEGS;
	    this.mHingeClockwiseConstraintDegs = _Math.MAX_ANGLE_DEGS;
	    this.mHingeAnticlockwiseConstraintDegs = _Math.MAX_ANGLE_DEGS;

	    this.mRotationAxisUV = new V3();
	    this.mReferenceAxisUV = new V3();
	    this.type = J_BALL;

	}

	Object.assign( Joint3D.prototype, {

	    clone:function(){

	        var j = new Joint3D();
	        j.mRotorConstraintDegs = this.mRotorConstraintDegs;
	        j.mHingeClockwiseConstraintDegs = this.mHingeClockwiseConstraintDegs;
	        j.mHingeAnticlockwiseConstraintDegs = this.mHingeAnticlockwiseConstraintDegs;
	        j.type = this.type;
	        j.mRotationAxisUV.copy( this.mRotationAxisUV );
	        j.mReferenceAxisUV.copy( this.mReferenceAxisUV );
	        return j;

	    },

	    validateAngle:function( angle ){

	        if( angle < _Math.MIN_ANGLE_DEGS ){ angle = _Math.MIN_ANGLE_DEGS; console.log( '! min angle is '+ _Math.MIN_ANGLE_DEGS ); }
	        if( angle > _Math.MAX_ANGLE_DEGS ){ angle = _Math.MAX_ANGLE_DEGS; console.log( '! max angle is '+ _Math.MAX_ANGLE_DEGS ); }

	        return angle;

	    },

	    setAsBallJoint:function( angleDegs ){

	        this.mRotorConstraintDegs = this.validateAngle( angleDegs );
	        this.type = J_BALL;
	        
	    },

	    // Specify this joint to be a hinge with the provided settings.
	    setHinge: function( type, rotationAxis, clockwiseConstraintDegs, anticlockwiseConstraintDegs, referenceAxis ){

	        // Set paramsgetHingeReferenceAxis
	        this.type = type;
	        this.mHingeClockwiseConstraintDegs     = this.validateAngle( clockwiseConstraintDegs );
	        this.mHingeAnticlockwiseConstraintDegs = this.validateAngle( anticlockwiseConstraintDegs );
	        this.mRotationAxisUV.copy( rotationAxis.normalised() );
	        this.mReferenceAxisUV.copy( referenceAxis.normalised() );

	    },

	    // GET

	    getJointType:function(){
	        return this.type; 
	    },

	    getHingeClockwiseConstraintDegs:function(){
	        if ( !(this.type === J_BALL) ) return this.mHingeClockwiseConstraintDegs;
	    },

	    getHingeAnticlockwiseConstraintDegs:function(){
	        if ( !(this.type === J_BALL) ) return this.mHingeAnticlockwiseConstraintDegs;
	    },

	    getHingeReferenceAxis:function(){
	        if ( !(this.type === J_BALL) ) return this.mReferenceAxisUV; 
	    },

	    getHingeRotationAxis:function(){
	        if ( !(this.type === J_BALL) ) return this.mRotationAxisUV; 
	    },

	    getBallJointConstraintDegs:function(){
	        if ( this.type === J_BALL ) return this.mRotorConstraintDegs; 
	    },

	    // SET

	    setAsGlobalHinge:function( globalRotationAxis, cwConstraintDegs, acwConstraintDegs, globalReferenceAxis ){
	        this.setHinge( J_GLOBAL, globalRotationAxis, cwConstraintDegs, acwConstraintDegs, globalReferenceAxis );
	    },

	    setAsLocalHinge:function( localRotationAxis, cwConstraintDegs, acwConstraintDegs, localReferenceAxis ){
	        this.setHinge( J_LOCAL, localRotationAxis, cwConstraintDegs, acwConstraintDegs, localReferenceAxis );
	    },

	    setBallJointConstraintDegs:function( angleDegs ){
	        if ( this.type === J_BALL ) this.mRotorConstraintDegs = this.validateAngle( angleDegs );
	    },

	    setHingeJointClockwiseConstraintDegs:function( angleDegs ){
	        if ( !(this.type === J_BALL) ) this.mHingeClockwiseConstraintDegs = this.validateAngle( angleDegs ); 
	    },

	    setHingeJointAnticlockwiseConstraintDegs:function( angleDegs ){
	        if ( !(this.type === J_BALL) ) this.mHingeAnticlockwiseConstraintDegs = this.validateAngle( angleDegs ); 
	    },

	    setHingeRotationAxis:function( axis ){
	        if ( !(this.type === J_BALL) ) this.mRotationAxisUV.copy( axis.normalised() ); 
	    },

	    setHingeReferenceAxis:function( referenceAxis ){
	        if ( !(this.type === J_BALL) ) this.mReferenceAxisUV.copy( referenceAxis.normalised() ); 
	    },

	    
	    
	} );

	function Bone3D ( startLocation, endLocation, directionUV, length, color ){

	    this.mJoint = new Joint3D();
	    this.mStartLocation = new V3();
	    this.mEndLocation = new V3();
	    
	    this.mBoneConnectionPoint = 'end';
	    this.mLength = 0;

	    this.color = color || 0xFFFFFF;
	    this.name = '';

	    this.init( startLocation, endLocation, directionUV, length );

	}
	Object.assign( Bone3D.prototype, {

	    init:function( startLocation, endLocation, directionUV, length ){

	        this.setStartLocation( startLocation );
	        if( endLocation !== undefined ){ 
	            this.setEndLocation( endLocation );
	            this.setLength( _Math.distanceBetween( this.mStartLocation, this.mEndLocation ) );
	        } else {
	            this.setLength( length );
	            this.setEndLocation( this.mStartLocation.plus( directionUV.normalised().times( length ) ) );
	        }

	    },

	    clone:function(){
	        var b = new Bone3D( this.mStartLocation, this.mEndLocation );
	        b.mJoint = this.mJoint.clone();
	        return b;
	    },

	    length : function(){
	        return this.mLength;
	    },

	    liveLength :function(){
	        return _Math.distanceBetween( this.mStartLocation, this.mEndLocation );
	    },
	    

	    // SET

	    setName:function( name ){
	        this.name = name;
	    },

	    setColor:function( c ){
	        this.color = c;
	    },

	    setBoneConnectionPoint:function( bcp ){
	        this.mBoneConnectionPoint = bcp;
	    },

	    setHingeJointClockwiseConstraintDegs:function( angleDegs ){
	        this.mJoint.setHingeJointClockwiseConstraintDegs( angleDegs );
	    },

	    setHingeJointAnticlockwiseConstraintDegs:function( angleDegs ){
	        this.mJoint.setHingeJointAnticlockwiseConstraintDegs( angleDegs );
	    },

	    setBallJointConstraintDegs:function( angleDegs ){
	        if (angleDegs < 0 ) angleDegs = 0;
	        if (angleDegs > 180 ) angleDegs = 180;
	        this.mJoint.setBallJointConstraintDegs( angleDegs );
	    },

	    setStartLocation:function( location ){
	        this.mStartLocation.copy( location );
	    },

	    setEndLocation:function( location ){
	        this.mEndLocation.copy( location );
	    },

	    setLength:function( lng ){
	        if ( lng > 0 ) this.mLength = lng;
	    },

	    setJoint:function( joint ){
	        this.mJoint = joint;
	    },


	    // GET

	    getHingeJointClockwiseConstraintDegs: function(){
	        return this.mJoint.getHingeClockwiseConstraintDegs();
	    },

	    
	    getHingeJointAnticlockwiseConstraintDegs: function(){
	        return this.mJoint.getHingeAnticlockwiseConstraintDegs();
	    },

	    
	    getBallJointConstraintDegs : function(){
	        return this.mJoint.getBallJointConstraintDegs();
	    },

	    getBoneConnectionPoint:function(){
	        return this.mBoneConnectionPoint;
	    },

	    getDirectionUV:function(){
	        return _Math.getDirectionUV( this.mStartLocation, this.mEndLocation );
	    },
	    getStartLocation : function(){
	        return this.mStartLocation;
	    },
	    getEndLocation : function(){
	        return this.mEndLocation;
	    },

	    getJointType : function(){
	        return this.mJoint.getJointType();
	    },

	    getLength : function(){
	        return this.mLength;
	    },

	    getJoint : function(){
	        return this.mJoint;
	    },

	} );

	function Chain3D ( color ){

	    this.bones = [];
	    this.name = '';
	    this.color = color || 0xFFFFFF;

	    this.mSolveDistanceThreshold = 1.0;
	    this.mMaxIterationAttempts = 20;
	    this.mMinIterationChange = 0.01;

	    this.mChainLength = 0;

	    this.bonesLength = 0;
	    this.mNumBones = 0;

	    this.mFixedBaseLocation = new V3();
	    this.mFixedBaseMode = true;

	    this.mBaseboneConstraintType = NONE;

	    this.mBaseboneConstraintUV = new V3();
	    this.mBaseboneRelativeConstraintUV = new V3();
	    this.mBaseboneRelativeReferenceConstraintUV = new V3();
	    this.mLastTargetLocation = new V3( _Math.MAX_VALUE, _Math.MAX_VALUE, _Math.MAX_VALUE );

	    this.mLastBaseLocation =  new V3( _Math.MAX_VALUE, _Math.MAX_VALUE, _Math.MAX_VALUE );
	    this.mCurrentSolveDistance = _Math.MAX_VALUE;
	    this.mConnectedChainNumber = -1;
	    this.mConnectedBoneNumber = -1;

	    

	    this.mEmbeddedTarget = new V3();
	    this.mUseEmbeddedTarget = false;

	}

	Object.assign( Chain3D.prototype, {

	    clone:function(){

	        var c = new Chain3D();

	        c.bones = this.cloneIkChain();
	        c.mFixedBaseLocation.copy( this.mFixedBaseLocation );
	        c.mLastTargetLocation.copy( this.mLastTargetLocation );
	        c.mLastBaseLocation.copy( this.mLastBaseLocation );
	                
	        // Copy the basebone constraint UV if there is one to copy
	        if ( !(this.mBaseboneConstraintType === NONE) ){
	            c.mBaseboneConstraintUV.copy( this.mBaseboneConstraintUV );
	            c.mBaseboneRelativeConstraintUV.copy( this.mBaseboneRelativeConstraintUV );
	        }       
	        
	        // Native copy by value for primitive members
	        c.bonesLength             = this.bonesLength;
	        c.mNumBones               = this.mNumBones;
	        c.mCurrentSolveDistance   = this.mCurrentSolveDistance;
	        c.mConnectedChainNumber   = this.mConnectedChainNumber;
	        c.mConnectedBoneNumber    = this.mConnectedBoneNumber;
	        c.mBaseboneConstraintType = this.mBaseboneConstraintType;

	        c.color = this.color;

	        return c;

	    },

	    clear:function(){

	        var i = this.mNumBones;
	        while(i--){
	            this.removeBone(i);
	        }

	        this.mNumBones = 0;

	    },

	    addBone: function( bone ){

	        bone.setColor( this.color );

	        // Add the new bone to the end of the ArrayList of bones
	        this.bones.push( bone );
	        // Increment the number of bones in the chain and update the chain length
	        this.mNumBones ++;

	        // If this is the basebone...
	        if ( this.mNumBones === 1 ){
	            // ...then keep a copy of the fixed start location...
	            this.mFixedBaseLocation.copy( bone.getStartLocation() );//.clone();
	            
	            // ...and set the basebone constraint UV to be around the initial bone direction
	            this.mBaseboneConstraintUV.copy( bone.getDirectionUV() );
	        }
	        
	        // Increment the number of bones in the chain and update the chain length
	        this.updateChainLength();

	    },

	    removeBone:function( id ){
	        if ( id < this.mNumBones ){   
	            // ...then remove the bone, decrease the bone count and update the chain length.
	            this.bones.splice(id, 1);
	            this.mNumBones --;
	            this.updateChainLength();
	        }
	    },

	    addConsecutiveBone : function( directionUV, length ){
	         //this.addConsecutiveBone( directionUV, length )
	         if (this.mNumBones > 0) {               
	            // Get the end location of the last bone, which will be used as the start location of the new bone
	            var prevBoneEnd = this.bones[this.mNumBones-1].getEndLocation();//.clone();
	                
	            // Add a bone to the end of this IK chain
	            // Note: We use a normalised version of the bone direction
	            this.addBone( new Bone3D( prevBoneEnd, undefined, directionUV.normalised(), length ) );
	        }

	    },

	    addConsecutiveFreelyRotatingHingedBone : function ( directionUV, length, type, hingeRotationAxis ){

	        this.addConsecutiveHingedBone( directionUV, length, type, hingeRotationAxis, 180.0, 180.0, _Math.genPerpendicularVectorQuick( hingeRotationAxis ) );

	    },

	    addConsecutiveHingedBone: function( DirectionUV, length, type, HingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis ){
	        // Cannot add a consectuive bone of any kind if the there is no basebone
	        if ( this.mNumBones === 0 ) return;

	        // Normalise the direction and hinge rotation axis 
	        var directionUV = DirectionUV.normalised();
	        var hingeRotationAxis = HingeRotationAxis.normalised();
	            
	        // Get the end location of the last bone, which will be used as the start location of the new bone
	        var prevBoneEnd = this.bones[this.mNumBones-1].getEndLocation().clone();
	            
	        // Create a bone
	        var bone = new Bone3D( prevBoneEnd, undefined, directionUV, length, this.color );

	        type = type || 'global';
	        
	        // ...then create and set up a joint which we'll apply to that bone.
	        var joint = new Joint3D();
	        switch (type){
	            case 'global':
	                joint.setAsGlobalHinge( hingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis );
	                break;
	            case 'local':
	                joint.setAsLocalHinge( hingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis );
	                break;

	        }
	        
	        // Set the joint we just set up on the the new bone we just created
	        bone.setJoint( joint );
	        
	        // Finally, add the bone to this chain
	        this.addBone( bone );

	    },

	    addConsecutiveRotorConstrainedBone:function( boneDirectionUV, length, constraintAngleDegs ){

	        if (this.mNumBones === 0) return;

	        // Create the bone starting at the end of the previous bone, set its direction, constraint angle and colour
	        // then add it to the chain. Note: The default joint type of a new Bone is J_BALL.
	        boneDirectionUV = boneDirectionUV.normalised();
	        var bone = new Bone3D( this.bones[ this.mNumBones-1 ].getEndLocation(), undefined , boneDirectionUV, length );
	        bone.setBallJointConstraintDegs( constraintAngleDegs );
	        this.addBone( bone );

	    },

	    // Connect this chain to the specified bone in the specified chain in the provided structure.

	    connectToStructure : function( structure, chainNumber, boneNumber ){

	        // Sanity check chain exists
	        var numChains = structure.getNumChains();
	        if (chainNumber > numChains) return;//{ throw new IllegalArgumentException("Structure does not contain a chain " + chainNumber + " - it has " + numChains + " chains."); }
	        
	        // Sanity check bone exists
	        var numBones = structure.getChain( chainNumber ).getNumBones();
	        if ( boneNumber > numBones ) return;//{ throw new IllegalArgumentException("Chain does not contain a bone " + boneNumber + " - it has " + numBones + " bones."); }
	        
	        // All good? Set the connection details
	        this.mConnectedChainNumber = chainNumber;
	        this.mConnectedBoneNumber  = boneNumber; 

	    },

	    // -------------------------------
	    //      GET
	    // -------------------------------

	    getBaseboneConstraintType:function(){
	        return this.mBaseboneConstraintType;
	    },
	    getBaseboneConstraintUV:function(){
	        if ( !(this.mBaseboneConstraintType === NONE) ) return this.mBaseboneConstraintUV;
	    },
	    getBaseLocation:function(){
	        return this.bones[0].getStartLocation();
	    },
	    getBone:function(id){
	        return this.bones[id];
	    },
	    getChain:function(){
	        return this.bones;
	    },
	    getChainLength:function(){
	        return this.bonesLength;
	    },
	    getConnectedBoneNumber:function(){
	        return this.mConnectedBoneNumber;
	    },
	    getConnectedChainNumber:function(){
	        return this.mConnectedChainNumber;
	    },
	    getEffectorLocation:function(){
	        return this.bones[this.mNumBones-1].getEndLocation();
	    },
	    getLastTargetLocation:function(){
	        return this.mLastTargetLocation;
	    },
	    getLiveChainLength:function(){
	        var lng = 0;        
	        for (var i = 0; i < this.mNumBones; i++){  
	            lng += this.bones[i].liveLength();
	        }       
	        return lng;
	    },
	    getName:function(){
	        return this.name;
	    },
	    getNumBones:function(){
	        return this.mNumBones;
	    },

	    getBaseboneRelativeReferenceConstraintUV:function(){
	        return this.mBaseboneRelativeReferenceConstraintUV;
	    },

	    // -------------------------------
	    //      SET
	    // -------------------------------

	    setColor:function(c){
	        this.color = c;
	        for (var i = 0; i < this.mNumBones; i++){  
	            this.bones[i].setColor( c );
	        }
	        
	    },

	    setBaseboneRelativeConstraintUV: function( constraintUV ){ this.mBaseboneRelativeConstraintUV = constraintUV; },
	    setBaseboneRelativeReferenceConstraintUV: function( constraintUV ){ this.mBaseboneRelativeReferenceConstraintUV = constraintUV; },

	    setRotorBaseboneConstraint : function( type, constraintAxis, angleDegs ){

	        // Sanity checking
	        if (this.mNumBones === 0) return;// throw new RuntimeException("Chain must contain a basebone before we can specify the basebone constraint type.");       
	        if ( !(constraintAxis.length() > 0) ) return;//  throw new IllegalArgumentException("Constraint axis cannot be zero.");
	        _Math.clamp( angleDegs, 0, 180 );
	        //if (angleDegs < 0  ) angleDegs = 0;                                                                                                  
	        //if (angleDegs > 180) angleDegs = 180; 
	        //if(type !== GLOBAL_ROTOR || type !== LOCAL_ROTOR ) console.log                                                                                                  
	        //if ( !(rotorType === GLOBAL_ROTOR || rotorType === LOCAL_ROTOR) ) return;//throw new IllegalArgumentException("The only valid rotor types for this method are GLOBAL_ROTOR and LOCAL_ROTOR.");
	        type = type || 'global';       
	        // Set the constraint type, axis and angle
	        this.mBaseboneConstraintType = type === 'global' ? GLOBAL_ROTOR : LOCAL_ROTOR;
	        this.mBaseboneConstraintUV = constraintAxis.normalised();
	        this.mBaseboneRelativeConstraintUV.copy( this.mBaseboneConstraintUV );
	        this.getBone(0).getJoint().setAsBallJoint( angleDegs );

	        //console.log('base bone is rotor');

	    },

	    setHingeBaseboneConstraint : function( type, hingeRotationAxis, cwConstraintDegs, acwConstraintDegs, hingeReferenceAxis ){

	        // Sanity checking
	        if ( this.mNumBones === 0) Tools.error("Chain must contain a basebone before we can specify the basebone constraint type."); return;    
	        if ( hingeRotationAxis.length() <= 0 ) Tools.error("Hinge rotation axis cannot be zero."); return;            
	        if ( hingeReferenceAxis.length() <= 0 ) Tools.error("Hinge reference axis cannot be zero."); return;      
	        if ( !( _Math.perpendicular( hingeRotationAxis, hingeReferenceAxis ) ) ) Tools.error("The hinge reference axis must be in the plane of the hinge rotation axis, that is, they must be perpendicular."); return;
	        //if ( !(hingeType === GLOBAL_HINGE || hingeType === LOCAL_HINGE) ) return;//throw new IllegalArgumentException("The only valid hinge types for this method are GLOBAL_HINGE and LOCAL_HINGE.");
	        
	        type = type || 'global';  

	        // Set the constraint type, axis and angle
	        this.mBaseboneConstraintType = type === 'global' ? GLOBAL_HINGE : LOCAL_HINGE;
	        this.mBaseboneConstraintUV.copy( hingeRotationAxis.normalised() );
	        
	        var hinge = new Joint3D();
	        
	        if ( type === 'global' ) hinge.setHinge( J_GLOBAL, hingeRotationAxis, cwConstraintDegs, acwConstraintDegs, hingeReferenceAxis );
	        else hinge.setHinge( J_LOCAL, hingeRotationAxis, cwConstraintDegs, acwConstraintDegs, hingeReferenceAxis );
	        
	        this.getBone(0).setJoint( hinge );

	    },

	    setFreelyRotatingGlobalHingedBasebone : function( hingeRotationAxis ){

	        this.setHingeBaseboneConstraint( GLOBAL_HINGE, hingeRotationAxis, 180, 180, _Math.genPerpendicularVectorQuick( hingeRotationAxis ) );
	    },

	    setFreelyRotatingLocalHingedBasebone : function( hingeRotationAxis ){

	        this.setHingeBaseboneConstraint( LOCAL_HINGE, hingeRotationAxis, 180, 180, _Math.genPerpendicularVectorQuick( hingeRotationAxis ) );
	    },

	    setLocalHingedBasebone : function( hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis ){

	        this.setHingeBaseboneConstraint( LOCAL_HINGE, hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );
	    },

	    setGlobalHingedBasebone : function( hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis ){

	        this.setHingeBaseboneConstraint( GLOBAL_HINGE, hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );
	    },

	    setBaseboneConstraintUV : function( constraintUV ){

	        if ( this.mBaseboneConstraintType === NONE ) return;

	        this.constraintUV.normalize();
	        this.mBaseboneConstraintUV.copy( constraintUV );

	    },

	    setBaseLocation : function( baseLocation ){

	        this.mFixedBaseLocation.copy( baseLocation );
	    },

	    setChain : function( bones ){

	        //this.bones = bones;

	        this.bones = [];
	        var lng = bones.length;
	        for(var i = 0; i< lng; i++){
	            this.bones[i] = bones[i];
	        }

	    },

	    

	    setFixedBaseMode : function( value ){

	        // Enforce that a chain connected to another chain stays in fixed base mode (i.e. it moves with the chain it's connected to instead of independently)
	        if ( !value && this.mConnectedChainNumber !== -1) return;
	        if ( this.mBaseboneConstraintType === GLOBAL_ROTOR && !value ) return;
	        // Above conditions met? Set the fixedBaseMode
	        this.mFixedBaseMode = value;
	    },

	    setMaxIterationAttempts : function( maxIterations ){

	        if (maxIterations < 1) return;
	        this.mMaxIterationAttempts = maxIterations;

	    },

	    setMinIterationChange : function( minIterationChange ){

	        if (minIterationChange < 0) return;
	        this.mMinIterationChange = minIterationChange;

	    },

	    setSolveDistanceThreshold : function( solveDistance ){

	        if (solveDistance < 0) return;
	        this.mSolveDistanceThreshold = solveDistance;

	    },



	    // -------------------------------
	    //
	    //      UPDATE TARGET
	    //
	    // -------------------------------

	    resetTarget : function( ){
	        this.mLastBaseLocation = new V3( _Math.MAX_VALUE, _Math.MAX_VALUE, _Math.MAX_VALUE );
	        this.mCurrentSolveDistance = _Math.MAX_VALUE;
	    },


	    // Method to solve this IK chain for the given target location.
	    // The end result of running this method is that the IK chain configuration is updated.

	    // To minimuse CPU usage, this method dynamically aborts if:
	    // - The solve distance (i.e. distance between the end effector and the target) is below the mSolveDistanceThreshold,
	    // - A solution incrementally improves on the previous solution by less than the mMinIterationChange, or
	    // - The number of attempts to solve the IK chain exceeds the mMaxIterationAttempts.

	    updateTarget : function( t ){

	        var newTarget = new V3( t.x, t.y, t.z );//.copy(t);//( newTarget.x, newTarget.y, newTarget.z );
	        // If we have both the same target and base location as the last run then do not solve
	        if ( this.mLastTargetLocation.approximatelyEquals( newTarget, 0.001) && this.mLastBaseLocation.approximatelyEquals( this.getBaseLocation(), 0.001) ) return this.mCurrentSolveDistance;
	        
	        /*
	         * NOTE: We must allow the best solution of THIS run to be used for a new target or base location - we cannot
	         * just use the last solution (even if it's better) - because that solution was for a different target / base
	         * location combination and NOT for the current setup.
	         */
	                        
	        // Declare a list of bones to use to store our best solution
	        var bestSolution = [];
	        
	        // We start with a best solve distance that can be easily beaten
	        var bestSolveDistance = _Math.MAX_VALUE;
	        
	        // We'll also keep track of the solve distance from the last pass
	        var lastPassSolveDistance = _Math.MAX_VALUE;
	        
	        // Allow up to our iteration limit attempts at solving the chain
	        var solveDistance;
	        //var i = this.mMaxIterationAttempts;
	        //while( i-- ){
	        for ( var i = 0; i < this.mMaxIterationAttempts; i++ ){   

	            // Solve the chain for this target
	            solveDistance = this.solveIK( newTarget );

	            //console.log(solveDistance)
	            
	            // Did we solve it for distance? If so, update our best distance and best solution, and also
	            // update our last pass solve distance. Note: We will ALWAYS beat our last solve distance on the first run. 
	            if ( solveDistance < bestSolveDistance ) {   

	                bestSolveDistance = solveDistance;
	                bestSolution = this.cloneIkChain();
	                
	                // If we are happy that this solution meets our distance requirements then we can exit the loop now
	                if ( solveDistance <= this.mSolveDistanceThreshold ) break;
	                
	            } else {// Did not solve to our satisfaction? Okay...
	            
	                // Did we grind to a halt? If so break out of loop to set the best distance and solution that we have
	                if ( Math.abs( solveDistance - lastPassSolveDistance ) < this.mMinIterationChange )  break; //System.out.println("Ground to halt on iteration: " + loop);

	            }
	            
	            // Update the last pass solve distance
	            lastPassSolveDistance = solveDistance;
	            
	        } // End of loop
	        
	        // Update our solve distance and chain configuration to the best solution found
	        this.mCurrentSolveDistance = bestSolveDistance;
	        this.bones = bestSolution;

	        //console.log('dddddd' , this.bones )
	        
	        // Update our base and target locations
	        this.mLastBaseLocation.copy( this.getBaseLocation() );
	        this.mLastTargetLocation.copy( newTarget );
	        
	        return this.mCurrentSolveDistance;
	        
	    },

	    // -------------------------------
	    //
	    //      SOLVE IK
	    //
	    // -------------------------------

	    // Solve the IK chain for the given target using the FABRIK algorithm.
	    // retun the best solve distance found between the end-effector of this chain and the provided target.

	    solveIK : function( target ){

	        if ( this.mNumBones === 0 ) return;

	        var bone, lng, joint, jointType;
	        var tmpMtx = new FIK.M3();
	        
	        // ---------- Forward pass from end effector to base -----------

	        // Loop over all bones in the chain, from the end effector (numBones-1) back to the basebone (0) 
	        var i = this.mNumBones;
	        while( i-- ){
	            // Get the length of the bone we're working on
	            bone = this.bones[i];
	            lng  = bone.getLength();
	            joint = bone.getJoint();
	            jointType = bone.getJointType();

	            // If we are NOT working on the end effector bone
	            if ( i !== this.mNumBones - 1 ) {
	                // Get the outer-to-inner unit vector of the bone further out
	                var outerBoneOuterToInnerUV = this.bones[ i+1 ].getDirectionUV().negated();

	                // Get the outer-to-inner unit vector of this bone
	                var boneOuterToInnerUV = bone.getDirectionUV().negated();
	                
	                // Get the joint type for this bone and handle constraints on boneInnerToOuterUV
	                
	                if ( jointType === J_BALL ) { 

	                    // Constrain to relative angle between this bone and the outer bone if required
	                    var angleBetweenDegs    = _Math.getAngleBetweenDegs( outerBoneOuterToInnerUV, boneOuterToInnerUV );
	                    var constraintAngleDegs = joint.getBallJointConstraintDegs();
	                    if ( angleBetweenDegs > constraintAngleDegs ){   
	                        boneOuterToInnerUV = tmpMtx.getAngleLimitedUnitVectorDegs( boneOuterToInnerUV, outerBoneOuterToInnerUV, constraintAngleDegs );
	                    }
	                }
	                else if ( jointType === J_GLOBAL ) {  

	                    // Project this bone outer-to-inner direction onto the hinge rotation axis
	                    // Note: The returned vector is normalised.
	                    boneOuterToInnerUV = boneOuterToInnerUV.projectOnPlane( joint.getHingeRotationAxis() );//.normalize(); 
	                    
	                    // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
	                }
	                else if ( jointType === J_LOCAL ) {   
	                    // Not a basebone? Then construct a rotation matrix based on the previous bones inner-to-to-inner direction...
	                    
	                    var relativeHingeRotationAxis; // V3
	                    if ( i > 0 ) {
	                        tmpMtx.createRotationMatrix( this.bones[i-1].getDirectionUV() );
	                        relativeHingeRotationAxis = tmpMtx.times( joint.getHingeRotationAxis() ).normalize();
	                    } else {// ...basebone? Need to construct matrix from the relative constraint UV.
	                        relativeHingeRotationAxis = this.mBaseboneRelativeConstraintUV.clone();
	                    }
	                    
	                    // ...and transform the hinge rotation axis into the previous bones frame of reference.
	                                        
	                    // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
	                    // Note: The returned vector is normalised.                 
	                    boneOuterToInnerUV = boneOuterToInnerUV.projectOnPlane( relativeHingeRotationAxis );//.normalize();
	                                        
	                    // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.                                       
	                }
	                    
	                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
	                // so we can set the new inner joint location to be the end joint location of this bone plus the
	                // outer-to-inner direction unit vector multiplied by the length of the bone.
	                var newStartLocation = bone.getEndLocation().plus( boneOuterToInnerUV.times( lng ) );

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
	                        // Global hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane

	                        boneOuterToInnerUV = boneOuterToInnerUV.projectOnPlane( joint.getHingeRotationAxis() );//.normalize();
	                    break;
	                    case J_LOCAL:
	                        // Local hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane
	                        
	                        // Construct a rotation matrix based on the previous bones inner-to-to-inner direction...
	                        tmpMtx.createRotationMatrix( this.bones[i-1].getDirectionUV() );
	                        
	                        // ...and transform the hinge rotation axis into the previous bones frame of reference.
	                        var relativeHingeRotationAxis = tmpMtx.times( joint.getHingeRotationAxis() ).normalize();
	                                            
	                        // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
	                        // Note: The returned vector is normalised.                 
	                        boneOuterToInnerUV = boneOuterToInnerUV.projectOnPlane( relativeHingeRotationAxis );//.normalize();
	                    break;
	                }

	                ///console.log(boneOuterToInnerUV)
	                                                
	                // Calculate the new start joint location as the end joint location plus the outer-to-inner direction UV
	                // multiplied by the length of the bone.
	                var newStartLocation = target.plus( boneOuterToInnerUV.times( lng ) );
	                
	                // Set the new start joint location for this bone to be new start location...
	                bone.setStartLocation( newStartLocation );

	                // ...and set the end joint location of the bone further in to also be at the new start location (if there IS a bone
	                // further in - this may be a single bone chain)
	                if (i > 0) this.bones[i-1].setEndLocation( newStartLocation );
	                
	            }
	            
	        } // End of forward pass

	        // ---------- Backward pass from base to end effector -----------
	 
	        for ( i = 0; i < this.mNumBones; i++ ){

	            bone = this.bones[i];
	            lng  = bone.getLength();

	            // If we are not working on the basebone
	            if ( i !== 0 ){
	                // Get the inner-to-outer direction of this bone as well as the previous bone to use as a baseline
	                var boneInnerToOuterUV = bone.getDirectionUV();
	                var prevBoneInnerToOuterUV = this.bones[i-1].getDirectionUV();
	                
	                // Dealing with a ball joint?
	                joint = bone.getJoint();
	                jointType = joint.getJointType();

	                if ( jointType === J_BALL ){                   
	                    var angleBetweenDegs    = _Math.getAngleBetweenDegs( prevBoneInnerToOuterUV, boneInnerToOuterUV );
	                    var constraintAngleDegs = joint.getBallJointConstraintDegs(); 
	                    
	                    // Keep this bone direction constrained within the rotor about the previous bone direction
	                    if (angleBetweenDegs > constraintAngleDegs){
	                        boneInnerToOuterUV = tmpMtx.getAngleLimitedUnitVectorDegs( boneInnerToOuterUV, prevBoneInnerToOuterUV, constraintAngleDegs );
	                    }
	                }
	                else if ( jointType === J_GLOBAL ) {                   
	                    // Get the hinge rotation axis and project our inner-to-outer UV onto it
	                    var hingeRotationAxis  = joint.getHingeRotationAxis();
	                    boneInnerToOuterUV = boneInnerToOuterUV.projectOnPlane(hingeRotationAxis).normalize();
	                    
	                    // If there are joint constraints, then we must honour them...
	                    var cwConstraintDegs   = -joint.getHingeClockwiseConstraintDegs();
	                    var acwConstraintDegs  =  joint.getHingeAnticlockwiseConstraintDegs();

	                    if ( !( _Math.nearEquals( cwConstraintDegs, -_Math.MAX_ANGLE_DEGS, _Math.PRECISION ) ) && !( _Math.nearEquals( acwConstraintDegs, _Math.MAX_ANGLE_DEGS, _Math.PRECISION ) ) ) {

	                        var hingeReferenceAxis = joint.getHingeReferenceAxis();
	                        
	                        // Get the signed angle (about the hinge rotation axis) between the hinge reference axis and the hinge-rotation aligned bone UV
	                        // Note: ACW rotation is positive, CW rotation is negative.
	                        var signedAngleDegs = _Math.getSignedAngleBetweenDegs( hingeReferenceAxis, boneInnerToOuterUV, hingeRotationAxis );
	                        
	                        // Make our bone inner-to-outer UV the hinge reference axis rotated by its maximum clockwise or anticlockwise rotation as required
	                        if (signedAngleDegs > acwConstraintDegs) boneInnerToOuterUV = tmpMtx.rotateAboutAxisDegs( hingeReferenceAxis, acwConstraintDegs, hingeRotationAxis ).normalised();
	                        else if (signedAngleDegs < cwConstraintDegs) boneInnerToOuterUV = tmpMtx.rotateAboutAxisDegs( hingeReferenceAxis, cwConstraintDegs, hingeRotationAxis ).normalised();
	                        
	                    }
	                }
	                else if ( jointType === J_LOCAL ){   
	                    // Transform the hinge rotation axis to be relative to the previous bone in the chain
	                    var hingeRotationAxis  = joint.getHingeRotationAxis();
	                    
	                    // Construct a rotation matrix based on the previous bone's direction
	                    tmpMtx.createRotationMatrix( prevBoneInnerToOuterUV );
	                    
	                    // Transform the hinge rotation axis into the previous bone's frame of reference
	                    var relativeHingeRotationAxis  = tmpMtx.times( hingeRotationAxis ).normalize();
	                    
	                    
	                    // Project this bone direction onto the plane described by the hinge rotation axis
	                    // Note: The returned vector is normalised.
	                    boneInnerToOuterUV = boneInnerToOuterUV.projectOnPlane( relativeHingeRotationAxis );
	                    
	                    // Constrain rotation about reference axis if required
	                    var cwConstraintDegs  = -joint.getHingeClockwiseConstraintDegs();
	                    var acwConstraintDegs =  joint.getHingeAnticlockwiseConstraintDegs();
	                    if ( !( _Math.nearEquals( cwConstraintDegs, -_Math.MAX_ANGLE_DEGS, _Math.PRECISION ) ) && !( _Math.nearEquals( acwConstraintDegs, _Math.MAX_ANGLE_DEGS, _Math.PRECISION ) ) ) {

	                        // Calc. the reference axis in local space
	                        //Vec3f relativeHingeReferenceAxis = mBaseboneRelativeReferenceConstraintUV;//m.times( joint.getHingeReferenceAxis() ).normalise();
	                        var relativeHingeReferenceAxis = tmpMtx.times( joint.getHingeReferenceAxis() ).normalize();
	                        
	                        // Get the signed angle (about the hinge rotation axis) between the hinge reference axis and the hinge-rotation aligned bone UV
	                        // Note: ACW rotation is positive, CW rotation is negative.
	                        var signedAngleDegs = _Math.getSignedAngleBetweenDegs( relativeHingeReferenceAxis, boneInnerToOuterUV, relativeHingeRotationAxis );
	                        
	                        // Make our bone inner-to-outer UV the hinge reference axis rotated by its maximum clockwise or anticlockwise rotation as required
	                        if (signedAngleDegs > acwConstraintDegs) boneInnerToOuterUV = tmpMtx.rotateAboutAxisDegs( relativeHingeReferenceAxis, acwConstraintDegs, relativeHingeRotationAxis ).normalize();
	                        else if (signedAngleDegs < cwConstraintDegs) boneInnerToOuterUV = tmpMtx.rotateAboutAxisDegs( relativeHingeReferenceAxis, cwConstraintDegs, relativeHingeRotationAxis ).normalize();                            
	                        
	                    }
	                    
	                } // End of local hinge section
	                
	                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
	                // so we can set the new inner joint location to be the end joint location of this bone plus the
	                // outer-to-inner direction unit vector multiplied by the length of the bone.
	                var newEndLocation = bone.getStartLocation().plus( boneInnerToOuterUV.times( lng ) );

	                // Set the new start joint location for this bone
	                bone.setEndLocation( newEndLocation );

	                // If we are not working on the end effector bone, then we set the start joint location of the next bone in
	                // the chain (i.e. the bone closer to the target) to be the new end joint location of this bone.
	                if (i < (this.mNumBones - 1)) { this.bones[i+1].setStartLocation( newEndLocation ); }

	            } else { // If we ARE working on the basebone...
	               
	                // If the base location is fixed then snap the start location of the basebone back to the fixed base...
	                if ( this.mFixedBaseMode ){
	                    bone.setStartLocation( this.mFixedBaseLocation );
	                } else { // ...otherwise project it backwards from the end to the start by its length.
	                
	                    bone.setStartLocation( bone.getEndLocation().minus( bone.getDirectionUV().times( lng ) ) );
	                }
	                
	                // If the basebone is unconstrained then process it as usual...
	                if ( this.mBaseboneConstraintType === NONE ) {
	                    // Set the new end location of this bone, and if there are more bones,
	                    // then set the start location of the next bone to be the end location of this bone
	                    var newEndLocation = bone.getStartLocation().plus( bone.getDirectionUV().times( lng ) );
	                    bone.setEndLocation( newEndLocation );    
	                    
	                    if ( this.mNumBones > 1 ) { this.bones[1].setStartLocation( newEndLocation ); }
	                } else {// ...otherwise we must constrain it to the basebone constraint unit vector
	                  
	                    if ( this.mBaseboneConstraintType === GLOBAL_ROTOR ){   
	                        // Get the inner-to-outer direction of this bone
	                        var boneInnerToOuterUV = bone.getDirectionUV();
	                                
	                        var angleBetweenDegs    = _Math.getAngleBetweenDegs( this.mBaseboneConstraintUV, boneInnerToOuterUV );
	                        var constraintAngleDegs = bone.getBallJointConstraintDegs(); 
	                    
	                        if ( angleBetweenDegs > constraintAngleDegs ){
	                            boneInnerToOuterUV = tmpMtx.getAngleLimitedUnitVectorDegs( boneInnerToOuterUV, this.mBaseboneConstraintUV, constraintAngleDegs );
	                        }
	                        
	                        var newEndLocation = bone.getStartLocation().plus( boneInnerToOuterUV.times( lng ) );
	                        
	                        bone.setEndLocation( newEndLocation );
	                        
	                        // Also, set the start location of the next bone to be the end location of this bone
	                        if ( this.mNumBones > 1 ) { this.bones[1].setStartLocation( newEndLocation ); }
	                    }
	                    else if ( this.mBaseboneConstraintType === LOCAL_ROTOR ){
	                        // Note: The mBaseboneRelativeConstraintUV is updated in the Structure.updateTarget()
	                        // method BEFORE this Chain.updateTarget() method is called. We no knowledge of the
	                        // direction of the bone we're connected to in another chain and so cannot calculate this 
	                        // relative basebone constraint direction on our own, but the Structure does it for
	                        // us so we are now free to use it here.
	                        
	                        // Get the inner-to-outer direction of this bone
	                        var boneInnerToOuterUV = bone.getDirectionUV();
	                                
	                        // Constrain about the relative basebone constraint unit vector as neccessary
	                        var angleBetweenDegs    = _Math.getAngleBetweenDegs( this.mBaseboneRelativeConstraintUV, boneInnerToOuterUV);
	                        var constraintAngleDegs = bone.getBallJointConstraintDegs();
	                        if ( angleBetweenDegs > constraintAngleDegs ){
	                            boneInnerToOuterUV = tmpMtx.getAngleLimitedUnitVectorDegs(boneInnerToOuterUV, this.mBaseboneRelativeConstraintUV, constraintAngleDegs);
	                        }
	                        
	                        // Set the end location
	                        var newEndLocation = bone.getStartLocation().plus( boneInnerToOuterUV.times( lng ) );                        
	                        bone.setEndLocation( newEndLocation );
	                        
	                        // Also, set the start location of the next bone to be the end location of this bone
	                        if ( this.mNumBones > 1 ) { this.bones[1].setStartLocation(newEndLocation); }

	                    } else if ( this.mBaseboneConstraintType === GLOBAL_HINGE ) {

	                        joint = bone.getJoint();
	                        var hingeRotationAxis  =  joint.getHingeRotationAxis();
	                        var cwConstraintDegs   = - joint.getHingeClockwiseConstraintDegs(); // Clockwise rotation is negative!
	                        var acwConstraintDegs  =  joint.getHingeAnticlockwiseConstraintDegs();
	                        
	                        // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
	                        var boneInnerToOuterUV = bone.getDirectionUV().projectOnPlane( hingeRotationAxis ).normalize();
	                                
	                        // If we have a global hinge which is not freely rotating then we must constrain about the reference axis
	                        if ( !( _Math.nearEquals( cwConstraintDegs, _Math.MAX_ANGLE_DEGS, _Math.PRECISION_DEG ) ) && !( _Math.nearEquals( acwConstraintDegs, _Math.MAX_ANGLE_DEGS, _Math.PRECISION_DEG ) ) ) {

	                            // Grab the hinge reference axis and calculate the current signed angle between it and our bone direction (about the hinge
	                            // rotation axis). Note: ACW rotation is positive, CW rotation is negative.
	                            var hingeReferenceAxis = joint.getHingeReferenceAxis();
	                            var signedAngleDegs    = _Math.getSignedAngleBetweenDegs(hingeReferenceAxis, boneInnerToOuterUV, hingeRotationAxis);
	                            
	                            // Constrain as necessary
	                            if (signedAngleDegs > acwConstraintDegs) boneInnerToOuterUV = tmpMtx.rotateAboutAxisDegs( hingeReferenceAxis, acwConstraintDegs, hingeRotationAxis ).normalize();
	                            else if (signedAngleDegs < cwConstraintDegs) boneInnerToOuterUV = tmpMtx.rotateAboutAxisDegs(hingeReferenceAxis, cwConstraintDegs, hingeRotationAxis).normalize();                            
	                            
	                        }
	                        
	                        // Calc and set the end location of this bone
	                        var newEndLocation = bone.getStartLocation().plus( boneInnerToOuterUV.times( lng ) );                        
	                        bone.setEndLocation( newEndLocation );
	                        
	                        // Also, set the start location of the next bone to be the end location of this bone
	                        if ( this.mNumBones > 1 ) { this.bones[1].setStartLocation(newEndLocation); }

	                    } else if ( this.mBaseboneConstraintType === LOCAL_HINGE ){

	                        joint = bone.getJoint();
	                        var hingeRotationAxis  =  this.mBaseboneRelativeConstraintUV;          // Basebone relative constraint is our hinge rotation axis!
	                        var cwConstraintDegs   = - joint.getHingeClockwiseConstraintDegs();    // Clockwise rotation is negative!
	                        var acwConstraintDegs  =  joint.getHingeAnticlockwiseConstraintDegs();
	                        
	                        // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
	                        var boneInnerToOuterUV = bone.getDirectionUV().projectOnPlane(hingeRotationAxis);
	                        
	                        //If we have a local hinge which is not freely rotating then we must constrain about the reference axis
	                        if ( !( _Math.nearEquals( cwConstraintDegs, _Math.MAX_ANGLE_DEGS, _Math.PRECISION_DEG ) ) && !( _Math.nearEquals( acwConstraintDegs, _Math.MAX_ANGLE_DEGS, _Math.PRECISION_DEG ) ) ) {
	        
	                            // Grab the hinge reference axis and calculate the current signed angle between it and our bone direction (about the hinge
	                            // rotation axis). Note: ACW rotation is positive, CW rotation is negative.
	                            var hingeReferenceAxis = this.mBaseboneRelativeReferenceConstraintUV; //joint.getHingeReferenceAxis();
	                            var signedAngleDegs    = _Math.getSignedAngleBetweenDegs( hingeReferenceAxis, boneInnerToOuterUV, hingeRotationAxis );
	                            
	                            // Constrain as necessary
	                            if ( signedAngleDegs > acwConstraintDegs ) boneInnerToOuterUV = tmpMtx.rotateAboutAxisDegs( hingeReferenceAxis, acwConstraintDegs, hingeRotationAxis ).normalize();
	                            else if (signedAngleDegs < cwConstraintDegs) boneInnerToOuterUV = tmpMtx.rotateAboutAxisDegs( hingeReferenceAxis, cwConstraintDegs, hingeRotationAxis ).normalize();   

	                        }
	                        
	                        // Calc and set the end location of this bone
	                        var newEndLocation = bone.getStartLocation().plus( boneInnerToOuterUV.times( lng ) );                        
	                        bone.setEndLocation( newEndLocation );
	                        
	                        // Also, set the start location of the next bone to be the end location of this bone
	                        if ( this.mNumBones > 1 ) { this.bones[1].setStartLocation( newEndLocation ); }
	                    }
	                    
	                } // End of basebone constraint handling section

	            } // End of basebone handling section

	        } // End of backward-pass i over all bones

	        // Update our last target location
	        this.mLastTargetLocation.copy( target );
	                
	        // DEBUG - check the live chain length and the originally calculated chain length are the same
	        /*
	        if (Math.abs( this.getLiveChainLength() - mChainLength) > 0.01f)
	        {
	            System.out.println("Chain length off by > 0.01f");
	        }
	        */

	        
	        // Finally, calculate and return the distance between the current effector location and the target.
	        return _Math.distanceBetween( this.bones[this.mNumBones-1].getEndLocation(), target );
	    },

	    updateChainLength : function(){

	        // Loop over all the bones in the chain, adding the length of each bone to the mChainLength property
	        this.bonesLength = 0;
	        var i = this.mNumBones;
	        while(i--) this.bonesLength += this.bones[i].getLength();

	    },

	    cloneIkChain : function(){

	        // How many bones are in this chain?
	        var numBones = this.bones.length;
	        
	        // Create a new Array
	        var clonedChain = [];

	        // For each bone in the chain being cloned...       
	        for (var i = 0; i < numBones; i++){
	            // Use the copy constructor to create a new Bone with the values set from the source Bone.
	            // and add it to the cloned chain.
	            clonedChain.push( this.bones[i].clone() );
	        }
	        
	        return clonedChain;

	    }


	// end

	} );

	function Structure3D ( scene ) {

	    this.chains = [];
	    this.meshChains = [];
	    this.targets = [];
	    this.mNumChains = 0;

	    this.scene = scene;

	    this.isWithMesh = false;

	}

	Object.assign( Structure3D.prototype, {

	    update:function(){

	        var c, m, b, t;
	        var connectedChainNumber;
	        var hostChain, hostBone, constraintType;

	        //var i =  this.mNumChains;

	        //while(i--){

	        for( var i = 0; i < this.mNumChains; i++ ){

	            c = this.chains[i];
	            m = this.meshChains[i];
	            t = this.targets[i];

	            connectedChainNumber = c.getConnectedChainNumber();

	            //this.chains[0].updateTarget( this.targets[0] );

	            if (connectedChainNumber === -1) c.updateTarget( t );
	            else{
	                hostChain = this.chains[connectedChainNumber];
	                hostBone  = hostChain.getBone( c.getConnectedBoneNumber() );

	                c.setBaseLocation( hostBone.getBoneConnectionPoint() === 'start' ? hostBone.getStartLocation() : hostBone.getEndLocation() );

	                // Now that we've clamped the base location of this chain to the start or end point of the bone in the chain we are connected to, it's
	                // time to deal with any base bone constraints...

	                constraintType = c.getBaseboneConstraintType();
	                switch (constraintType){
	                    case NONE:         // Nothing to do because there's no basebone constraint
	                    case GLOBAL_ROTOR: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
	                    case GLOBAL_HINGE: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
	                        break;
	                        
	                    // If we have a local rotor or hinge constraint then we must calculate the relative basebone constraint before calling updateTarget
	                    case LOCAL_ROTOR:
	                    case LOCAL_HINGE:

	                    // Get the direction of the bone this chain is connected to and create a rotation matrix from it.
	                    var connectionBoneMatrix = new FIK.M3().createRotationMatrix( hostBone.getDirectionUV() );
	                        
	                    // We'll then get the basebone constraint UV and multiply it by the rotation matrix of the connected bone 
	                    // to make the basebone constraint UV relative to the direction of bone it's connected to.
	                    var relativeBaseboneConstraintUV = connectionBoneMatrix.times( c.getBaseboneConstraintUV() ).normalize();
	                            
	                    // Update our basebone relative constraint UV property
	                    c.setBaseboneRelativeConstraintUV( relativeBaseboneConstraintUV );
	                        
	                    // Updat the relative reference constraint UV if we hav a local hinge
	                    if (constraintType === LOCAL_HINGE )
	                        c.setBaseboneRelativeReferenceConstraintUV( connectionBoneMatrix.times( c.getBone(0).getJoint().getHingeReferenceAxis() ) );
	                        
	                    break;

	                }

	                // NOTE: If the base bone constraint type is NONE then we don't do anything with the base bone constraint of the connected chain.
	                
	                // Finally, update the target and solve the chain
	                // Update the target and solve the chain

	                //if ( !c.getEmbeddedTargetMode() ) c.solveForTarget(newTargetLocation);
	                //else c.solveForEmbeddedTarget();

	                
	                c.resetTarget();//
	                //hostChain.updateTarget( this.targets[connectedChainNumber] );

	                c.updateTarget( t );


	            }

	            // update 3d mesh

	           // var m1 = new THREE.Matrix4();
	           // var vector = new THREE.Vector3();

	            if( this.isWithMesh ){
	                for ( var j = 0; j < c.mNumBones; j++ ) {
	                    b = c.getBone(j);
	                    m[j].position.copy( b.getStartLocation() );
	                    m[j].lookAt( b.getEndLocation() );
	                }

	            }

	        }

	    },

	    clear:function(){

	        this.clearAllBoneMesh();

	        var i;

	        i = this.mNumChains;
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
	        this.mNumChains ++;

	        if( meshBone ) this.addChainMeshs( chain );
	    },

	    

	    remove:function( id ){

	        this.chains[id].clear();
	        this.chains.splice(id, 1);
	        this.meshChains.splice(id, 1);
	        this.targets.splice(id, 1);
	        this.mNumChains --;

	    },

	    setFixedBaseMode:function( fixedBaseMode ){
	        for ( var i = 0; i < this.mNumChains; i++) {
	            this.chains[i].setFixedBaseMode( fixedBaseMode );
	        }
	    },

	    getNumChains:function(){

	        return this.mNumChains;

	    },

	    getChain:function(id){

	        return this.chains[id];

	    },

	    connectChain : function( newChain, existingChainNumber, existingBoneNumber, boneConnectionPoint, target, meshBone, color ){

	        if ( existingChainNumber > this.mNumChains ) return;
	        if ( existingBoneNumber > this.chains[existingChainNumber].getNumBones() ) return;

	        // Make a copy of the provided chain so any changes made to the original do not affect this chain
	        var relativeChain = newChain.clone();//new Fullik.Chain( newChain );
	        if( color !== undefined ) relativeChain.setColor( color );

	        // Connect the copy of the provided chain to the specified chain and bone in this structure
	        relativeChain.connectToStructure( this, existingChainNumber, existingBoneNumber );

	        // The chain as we were provided should be centred on the origin, so we must now make it
	        // relative to the start location of the given bone in the given chain.

	        var connectionPoint = boneConnectionPoint || this.getChain( existingChainNumber ).getBone( existingBoneNumber ).getBoneConnectionPoint();
	        var connectionLocation;

	        if ( connectionPoint === 'start' ) connectionLocation = this.chains[existingChainNumber].getBone(existingBoneNumber).getStartLocation();
	        else connectionLocation = this.chains[existingChainNumber].getBone(existingBoneNumber).getEndLocation();
	         

	        relativeChain.setBaseLocation( connectionLocation );
	        // When we have a chain connected to a another 'host' chain, the chain is which is connecting in
	        // MUST have a fixed base, even though that means the base location is 'fixed' to the connection
	        // point on the host chain, rather than a static location.
	        relativeChain.setFixedBaseMode( true );

	        // Translate the chain we're connecting to the connection point
	        for ( var i = 0; i < relativeChain.getNumBones(); i++ ){

	            var origStart = relativeChain.getBone(i).getStartLocation();
	            var origEnd   = relativeChain.getBone(i).getEndLocation();
	            
	            var translatedStart = origStart.plus(connectionLocation);
	            var translatedEnd   = origEnd.plus(connectionLocation);
	            
	            relativeChain.getBone(i).setStartLocation(translatedStart);
	            relativeChain.getBone(i).setEndLocation(translatedEnd);
	        }
	        
	        this.add( relativeChain, target, meshBone );

	    },


	    // 3D THREE

	    addChainMeshs:function( chain, id ){

	        this.isWithMesh = true;

	        var meshBone = [];
	        var lng  = chain.bones.length;
	        for(var i = 0; i<lng; i++ ){
	            meshBone.push( this.addBoneMesh( chain.bones[i] ) );
	        }

	        this.meshChains.push( meshBone );

	    },

	    addBoneMesh:function( bone ){

	        var size = bone.mLength;
	        var color = bone.color;
	        var g = new THREE.CylinderBufferGeometry ( 1, 0.5, size, 4 );
	        g.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
	        g.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, size*0.5 ) );
	        var m = new THREE.MeshStandardMaterial({ color:color, wireframe:false, shadowSide:false });

	        var m2 = new THREE.MeshBasicMaterial({ wireframe : true, transparent:true, opacity:0.3 });
	        //var m4 = new THREE.MeshBasicMaterial({ wireframe : true, color:color, transparent:true, opacity:0.3 });

	        var extraMesh = null;
	        var extraGeo;

	        var type = bone.getJoint().type;
	        switch(type){
	            case J_BALL :
	                m2.color.setHex(0xFF6600);
	                var angle  = bone.getJoint().mRotorConstraintDegs;
	                if(angle === 180) break;
	                var s = size/4;
	                var r = 2;//
	                extraGeo = new THREE.CylinderBufferGeometry ( 0, r, s, 6 );
	                extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
	                extraGeo.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, s*0.5 ) );
	                extraMesh = new THREE.Mesh( extraGeo,  m2 );
	            break;
	            case J_GLOBAL :
	            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * _Math.toRad;
	            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * _Math.toRad;
	            var r = 2;
	            //console.log('global', a1, a2)
	            m2.color.setHex(0xFFFF00);
	            extraGeo = new THREE.CircleBufferGeometry( r, 12, a1, a1+a2 );
	            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
	            extraMesh = new THREE.Mesh( extraGeo,  m2 );
	            break;
	            case J_LOCAL :
	            var r = 2;
	            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * _Math.toRad;
	            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * _Math.toRad;
	            //console.log('local', a1, a2)
	            m2.color.setHex(0x00FFFF);
	            extraGeo = new THREE.CircleBufferGeometry( r, 12, a1, a1+a2 );
	            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
	            extraMesh = new THREE.Mesh( extraGeo,  m2 );
	            break;
	        }

	        var axe = new THREE.AxesHelper(1);
	        //var bw = new THREE.Mesh( g,  m4 );

	        var b = new THREE.Mesh( g,  m );
	        b.add(axe);
	        //b.add(bw);
	        this.scene.add( b );

	        b.castShadow = true;
	        b.receiveShadow = true;

	        //console.log(b)
	        if( extraMesh !== null ) b.add( extraMesh );
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

	function Joint2D( clockwiseConstraintDegs, antiClockwiseConstraintDegs, constraintCoordSystem ){

	    this.mClockwiseConstraintDegs = clockwiseConstraintDegs || _Math.MAX_ANGLE_DEGS;
	    this.mAnticlockwiseConstraintDegs = antiClockwiseConstraintDegs || _Math.MAX_ANGLE_DEGS;
	    this.mConstraintCoordinateSystem = constraintCoordSystem || J_LOCAL;

	}

	Object.assign( Joint2D.prototype, {

	    isJoint2D: true,

	    clone:function(){

	        var j = new Joint2D();
	        j.mClockwiseConstraintDegs = this.mClockwiseConstraintDegs;
	        j.mAnticlockwiseConstraintDegs = this.mAnticlockwiseConstraintDegs;
	        j.mConstraintCoordinateSystem = this.mConstraintCoordinateSystem;
	        return j;

	    },

	    validateAngle:function( angle ){

	        angle = _Math.clamp( angle, _Math.MIN_ANGLE_DEGS, _Math.MAX_ANGLE_DEGS );

	        //if( angle < _Math.MIN_ANGLE_DEGS ){ angle = _Math.MIN_ANGLE_DEGS; console.log( '! min angle is '+ _Math.MIN_ANGLE_DEGS ); }
	        //if( angle > _Math.MAX_ANGLE_DEGS ){ angle = _Math.MAX_ANGLE_DEGS; console.log( '! max angle is '+ _Math.MAX_ANGLE_DEGS ); }
	        return angle;

	    },

	    // SET

	    set: function ( sourceJoint ) {

	        //this.setClockwiseConstraintDegs(sourceJoint.mClockwiseConstraintDegs);
	        //this.setAnticlockwiseConstraintDegs(sourceJoint.mAnticlockwiseConstraintDegs);
	        this.mClockwiseConstraintDegs = sourceJoint.mClockwiseConstraintDegs;
	        this.mAnticlockwiseConstraintDegs = sourceJoint.mAnticlockwiseConstraintDegs;
	        this.mConstraintCoordinateSystem = sourceJoint.mConstraintCoordinateSystem;

	    },

	    setClockwiseConstraintDegs:function( angleDegs ){

	        this.mClockwiseConstraintDegs = this.validateAngle( angleDegs );
	        
	    },

	    setAnticlockwiseConstraintDegs:function( angleDegs ){

	        this.mAnticlockwiseConstraintDegs = this.validateAngle( angleDegs );
	        
	    },

	    setConstraintCoordinateSystem:function( coordSystem ){

	        this.mConstraintCoordinateSystem = coordSystem;

	    },


	    // GET

	    getClockwiseConstraintDegs:function(){

	        return this.mClockwiseConstraintDegs;

	    },

	    getAnticlockwiseConstraintDegs:function(){

	        return this.mAnticlockwiseConstraintDegs;

	    },

	    getConstraintCoordinateSystem:function(){

	        return this.mConstraintCoordinateSystem;

	    },

	} );

	function Bone2D ( startLocation, endLocation, directionUV, length, clockwiseDegs, anticlockwiseDegs, color ){

	    this.mJoint = new Joint2D( clockwiseDegs, anticlockwiseDegs );
	    this.mStartLocation = new V2();
	    this.mEndLocation = new V2();

	    this.mGlobalConstraintUV = new V2(1, 0);
	    
	    this.mBoneConnectionPoint = END;
	    this.mLength = 0;

	    this.color = color || null;
	    this.name = '';

	    this.init( startLocation, endLocation, directionUV, length );

	}
	Object.assign( Bone2D.prototype, {

	    isBone2D: true,

	    init:function( startLocation, endLocation, directionUV, length ){

	        this.setStartLocation( startLocation );
	        //if( endLocation !== undefined ){ 
	        if( endLocation ){ 

	            this.setEndLocation( endLocation );
	            this.setLength( _Math.distanceBetween( this.mStartLocation, this.mEndLocation ) );

	        } else {

	            this.setLength( length );
	            this.setEndLocation( this.mStartLocation.plus( directionUV.normalised().times( length ) ) );
	            
	        }

	    },

	    clone:function(){
	        var b = new Bone2D( this.mStartLocation, this.mEndLocation );
	        b.mGlobalConstraintUV = this.mGlobalConstraintUV;
	        b.mBoneConnectionPoint = this.mBoneConnectionPoint;
	        b.color = this.color;
	        b.mJoint = this.mJoint.clone();
	        return b;
	    },

	    length : function(){
	        return this.mLength;
	    },

	    liveLength :function(){
	        return _Math.distanceBetween( this.mStartLocation, this.mEndLocation );
	    },
	    

	    // SET

	    setName:function( name ){
	        this.name = name;
	    },

	    setColor:function( c ){
	        this.color = c;
	    },

	    setBoneConnectionPoint:function( bcp ){
	        this.mBoneConnectionPoint = bcp;
	    },


	    setClockwiseConstraintDegs:function( angleDegs ){
	        this.mJoint.setClockwiseConstraintDegs( angleDegs );
	    },

	    setAnticlockwiseConstraintDegs:function( angleDegs ){
	        this.mJoint.setAnticlockwiseConstraintDegs( angleDegs );
	    },

	    setStartLocation:function( v ){
	        this.mStartLocation.copy( v );
	    },

	    setEndLocation:function( v ){
	        this.mEndLocation.copy( v );
	    },

	    setLength:function( lng ){
	        if ( lng > 0 ) this.mLength = lng;
	    },

	    setJoint:function( joint ){
	        this.mJoint = joint;
	    },

	    setGlobalConstraintUV:function( v ){
	        this.mGlobalConstraintUV = v;
	    },

	    setJointConstraintCoordinateSystem:function( coordSystem ){
	        this.mJoint.setConstraintCoordinateSystem( coordSystem );
	    },


	    // GET

	    getGlobalConstraintUV: function(){
	        return this.mGlobalConstraintUV;
	    },

	    getClockwiseConstraintDegs: function(){
	        return this.mJoint.getClockwiseConstraintDegs();
	    },

	    
	    getAnticlockwiseConstraintDegs: function(){
	        return this.mJoint.getAnticlockwiseConstraintDegs();
	    },

	    getJointConstraintCoordinateSystem: function () {
	        return this.mJoint.getConstraintCoordinateSystem();
	    },

	    
	    getBoneConnectionPoint:function(){
	        return this.mBoneConnectionPoint;
	    },

	    getDirectionUV:function(){
	        return _Math.getDirectionUV( this.mStartLocation, this.mEndLocation );
	    },

	    getStartLocation : function(){
	        return this.mStartLocation;
	    },
	    getEndLocation : function(){
	        return this.mEndLocation;
	    },

	    /*getJointType : function(){
	        return this.mJoint.getJointType();
	    },*/

	    getLength : function(){
	        return this.mLength;
	    },

	    getJoint : function(){
	        return this.mJoint;
	    },

	    

	} );

	function Chain2D ( color ){

	    this.bones = [];
	    this.name = '';

	    this.mSolveDistanceThreshold = 1.0;
	    this.mMaxIterationAttempts = 15;
	    this.mMinIterationChange = 0.01;

	    this.bonesLength = 0;
	    this.mNumBones = 0;

	    this.mBaseLocation = new V2();
	    this.mFixedBaseMode = true;

	    this.mBaseboneConstraintType = NONE;


	    this.mBaseboneConstraintUV = new V2();
	    this.mBaseboneRelativeConstraintUV = new V2();
	    //this.mBaseboneRelativeReferenceConstraintUV = new V2();
	    this.mLastTargetLocation = new V2( _Math.MAX_VALUE, _Math.MAX_VALUE );

	    this.mLastBaseLocation =  new V2( _Math.MAX_VALUE, _Math.MAX_VALUE );

	    this.mBoneConnectionPoint = END;
	    
	    this.mCurrentSolveDistance = _Math.MAX_VALUE;
	    this.mConnectedChainNumber = -1;
	    this.mConnectedBoneNumber = -1;

	    this.color = color || 0xFFFFFF;

	    this.mEmbeddedTarget = new V2();
	    this.mUseEmbeddedTarget = false;

	}

	Object.assign( Chain2D.prototype, {

	    isChain2D: true,

	    clone:function(){

	        var c = new Chain2D();

	        c.bones = this.cloneIkChain();
	        c.mBaseLocation.copy( this.mBaseLocation );
	        c.mLastTargetLocation.copy( this.mLastTargetLocation );
	        c.mLastBaseLocation.copy( this.mLastBaseLocation );
	                
	        // Copy the basebone constraint UV if there is one to copy
	        //if ( !(this.mBaseboneConstraintType === NONE) ){
	            c.mBaseboneConstraintUV.copy( this.mBaseboneConstraintUV );
	            c.mBaseboneRelativeConstraintUV.copy( this.mBaseboneRelativeConstraintUV );
	            //c.mBaseboneRelativeReferenceConstraintUV.copy( this.mBaseboneRelativeReferenceConstraintUV );
	        //}       
	        
	        // Native copy by value for primitive members
	        c.mBoneConnectionPoint    = this.mBoneConnectionPoint;
	        c.bonesLength             = this.bonesLength;
	        c.mNumBones               = this.mNumBones;
	        c.mCurrentSolveDistance   = this.mCurrentSolveDistance;
	        c.mConnectedChainNumber   = this.mConnectedChainNumber;
	        c.mConnectedBoneNumber    = this.mConnectedBoneNumber;
	        c.mBaseboneConstraintType = this.mBaseboneConstraintType;

	        c.color = this.color;

	        c.mEmbeddedTarget    = this.mEmbeddedTarget.clone();
	        c.mUseEmbeddedTarget = this.mUseEmbeddedTarget;

	        return c;

	    },

	    

	    clear:function(){

	        var i = this.mNumBones;
	        while(i--){
	            this.removeBone(i);
	        }

	    },

	    addBone: function( bone ){

	        if( bone.color === null )bone.setColor( this.color );

	        // Add the new bone to the end of the ArrayList of bones
	        this.bones.push( bone );
	        // Increment the number of bones in the chain and update the chain length
	        this.mNumBones ++;

	        // If this is the basebone...
	        if ( this.mNumBones === 1 ){
	            // ...then keep a copy of the fixed start location...
	            this.mBaseLocation.copy( bone.getStartLocation() );
	            
	            // ...and set the basebone constraint UV to be around the initial bone direction
	            this.mBaseboneConstraintUV.copy( bone.getDirectionUV() );

	        }
	        
	        // Increment the number of bones in the chain and update the chain length
	        this.updateChainLength();

	    },

	    removeBone:function( id ){
	        if ( id < this.mNumBones ){   
	            // ...then remove the bone, decrease the bone count and update the chain length.
	            this.bones.splice(id, 1);
	            this.mNumBones --;
	            this.updateChainLength();
	        }
	    },


	    addConsecutiveBone : function( directionUV, length, clockwiseDegs, anticlockwiseDegs, color ){

	        if (this.mNumBones === 0){ Tools.error('Chain is empty ! need first bone'); return }
	        if(directionUV.isBone2D){ // first argument is bone

	            var bone = directionUV;

	            // Validate the direction unit vector - throws an IllegalArgumentException if it has a magnitude of zero
	            var dir = bone.getDirectionUV();
	            _Math.validateDirectionUV( dir );
	            
	            // Validate the length of the bone - throws an IllegalArgumentException if it is not a positive value
	            var len = bone.length();
	            _Math.validateLength( len );

	            var prevBoneEnd = this.bones[ this.mNumBones-1 ].getEndLocation();

	            bone.setStartLocation( prevBoneEnd );
	            bone.setEndLocation( prevBoneEnd.plus(dir.times(len)) );
	            
	            // Add a bone to the end of this IK chain
	            this.addBone( bone );

	        } else {
	            
	            color = color || this.color;
	             
	            // Validate the direction unit vector - throws an IllegalArgumentException if it has a magnitude of zero
	            _Math.validateDirectionUV( directionUV );
	            
	            // Validate the length of the bone - throws an IllegalArgumentException if it is not a positive value
	            _Math.validateLength( length );
	                    
	            // Get the end location of the last bone, which will be used as the start location of the new bone
	            var prevBoneEnd = this.bones[ this.mNumBones-1 ].getEndLocation();
	                    
	            // Add a bone to the end of this IK chain
	            this.addBone( new Bone2D( prevBoneEnd, undefined, directionUV.normalised(), length, clockwiseDegs, anticlockwiseDegs, color ) );
	            

	        }
	        
	    },


	    // Connect this chain to the specified bone in the specified chain in the provided structure.

	    connectToStructure : function( structure, chainNumber, boneNumber ){

	        // Sanity check chain exists
	        var numChains = structure.getNumChains();
	        if (chainNumber > numChains) return;//{ throw new IllegalArgumentException("Structure does not contain a chain " + chainNumber + " - it has " + numChains + " chains."); }
	        
	        // Sanity check bone exists
	        var numBones = structure.getChain( chainNumber ).getNumBones();
	        if ( boneNumber > numBones ) return;//{ throw new IllegalArgumentException("Chain does not contain a bone " + boneNumber + " - it has " + numBones + " bones."); }
	        
	        // All good? Set the connection details
	        this.mConnectedChainNumber = chainNumber;
	        this.mConnectedBoneNumber  = boneNumber; 

	    },

	    // -------------------------------
	    //      GET
	    // -------------------------------

	    getBoneConnectionPoint:function(){

	        return this.mBoneConnectionPoint;

	    },

	    

	    getEmbeddedTarget:function(){

	        return this.mEmbeddedTarget;

	    },


	    getEmbeddedTargetMode:function(){

	        return this.mUseEmbeddedTarget;

	    },

	    getBaseboneConstraintType:function(){
	        return this.mBaseboneConstraintType;
	    },
	    getBaseboneConstraintUV:function(){
	        if ( !(this.mBaseboneConstraintType === NONE) ) return this.mBaseboneConstraintUV;
	    },
	    getBaseLocation:function(){
	        return this.bones[0].getStartLocation();
	    },
	    getBone:function(id){
	        return this.bones[id];
	    },
	    getChain:function(){
	        return this.bones;
	    },
	    getChainLength:function(){
	        return this.bonesLength;
	    },
	    getConnectedBoneNumber:function(){
	        return this.mConnectedBoneNumber;
	    },
	    getConnectedChainNumber:function(){
	        return this.mConnectedChainNumber;
	    },
	    getEffectorLocation:function(){
	        return this.bones[this.mNumBones-1].getEndLocation();
	    },
	    getLastTargetLocation:function(){
	        return this.mLastTargetLocation;
	    },
	    getLiveChainLength:function(){
	        var lng = 0;        
	        for (var i = 0; i < this.mNumBones; i++){  
	            lng += this.bones[i].liveLength();
	        }       
	        return lng;
	    },
	    getName:function(){
	        return this.name;
	    },
	    getNumBones:function(){
	        return this.mNumBones;
	    },

	    /*getBaseboneRelativeReferenceConstraintUV:function(){
	        return this.mBaseboneRelativeReferenceConstraintUV;
	    },*/

	    // -------------------------------
	    //      SET
	    // -------------------------------

	    setColor:function(c){

	        this.color = c;
	        for (var i = 0; i < this.mNumBones; i++){  
	            this.bones[i].setColor( c );
	        }
	        
	    },

	    setBaseboneRelativeConstraintUV: function( constraintUV ){ this.mBaseboneRelativeConstraintUV = constraintUV; },
	    //setBaseboneRelativeReferenceConstraintUV: function( constraintUV ){ this.mBaseboneRelativeReferenceConstraintUV = constraintUV; },

	    setConnectedBoneNumber: function( boneNumber ){

	        this.mConnectedBoneNumber = boneNumber;

	    },

	    setConnectedChainNumber: function( chainNumber ){

	        this.mConnectedChainNumber = chainNumber;

	    },

	    setBoneConnectionPoint: function( point ){

	        this.mBoneConnectionPoint = point;

	    },

	    setBaseboneConstraintUV: function( constraintUV ){

	        //if ( this.mBaseboneConstraintType === NONE ) return;
	        _Math.validateDirectionUV(constraintUV);

	        this.mBaseboneConstraintUV.copy( constraintUV.normalised() );

	    },

	    setBaseLocation : function( baseLocation ){

	        this.mBaseLocation.copy( baseLocation );

	    },

	    setChain : function( bones ){

	        //this.bones = bones;

	        this.bones = [];
	        var lng = bones.length;
	        for(var i = 0; i< lng; i++){
	            this.bones[i] = bones[i];
	        }

	    },

	    setBaseboneConstraintType: function( value ){

	        this.mBaseboneConstraintType = value;

	    },

	    setFixedBaseMode: function( value ){

	        // Enforce that a chain connected to another chain stays in fixed base mode (i.e. it moves with the chain it's connected to instead of independently)
	        if ( !value && this.mConnectedChainNumber !== -1) return;
	        if ( this.mBaseboneConstraintType === GLOBAL_ABSOLUTE && !value ) return;
	        // Above conditions met? Set the fixedBaseMode
	        this.mFixedBaseMode = value;
	    },

	    setMaxIterationAttempts: function( maxIterations ){

	        if (maxIterations < 1) return;
	        this.mMaxIterationAttempts = maxIterations;

	    },

	    setMinIterationChange: function( minIterationChange ){

	        if (minIterationChange < 0) return;
	        this.mMinIterationChange = minIterationChange;

	    },

	    setSolveDistanceThreshold: function( solveDistance ){

	        if (solveDistance < 0) return;
	        this.mSolveDistanceThreshold = solveDistance;

	    },



	    // -------------------------------
	    //
	    //      UPDATE TARGET
	    //
	    // -------------------------------

	    solveForEmbeddedTarget : function( ){
	        if ( this.mUseEmbeddedTarget ) return this.updateTarget(this.mEmbeddedTarget);
	    },

	    resetTarget : function( ){
	        this.mLastBaseLocation = new V2( _Math.MAX_VALUE, _Math.MAX_VALUE );
	        this.mCurrentSolveDistance = _Math.MAX_VALUE;
	    },


	    // Solve the IK chain for this target to the best of our ability.
	    // The end result of running this method is that the IK chain configuration is updated.

	    // To minimuse CPU usage, this method dynamically aborts if:
	    // - The solve distance (i.e. distance between the end effector and the target) is below the mSolveDistanceThreshold,
	    // - A solution incrementally improves on the previous solution by less than the mMinIterationChange, or
	    // - The number of attempts to solve the IK chain exceeds the mMaxIterationAttempts.

	    updateTarget : function( t ){

	        var newTarget = new V2( t.x, t.y );
	        // If we have both the same target and base location as the last run then do not solve
	        if ( this.mLastTargetLocation.approximatelyEquals( newTarget, 0.001 ) && this.mLastBaseLocation.approximatelyEquals( this.mBaseLocation, 0.001) ) return this.mCurrentSolveDistance;
	        
	        // Keep starting solutions and distance
	        var startingDistance;
	        var startingSolution = null;

	        // If the base location of a chain hasn't moved then we may opt to keep the current solution if our 
	        // best new solution is worse...
	        if ( this.mLastBaseLocation.approximatelyEquals( this.mBaseLocation, 0.001) ) {           
	            startingDistance  = _Math.distanceBetween( this.bones[this.mNumBones-1].getEndLocation(), newTarget );
	            startingSolution = this.cloneIkChain();
	        } else {
	            // Base has changed? Then we have little choice but to recalc the solution and take that new solution.
	            startingDistance = _Math.MAX_VALUE;
	        }
	                        
	        // Not the same target? Then we must solve the chain for the new target.
			// We'll start by creating a list of bones to store our best solution
	        var bestSolution = [];
	        
	        // We'll keep track of our best solve distance, starting it at a huge value which will be beaten on first attempt
	        var bestSolveDistance = _Math.MAX_VALUE;
	        var lastPassSolveDistance = _Math.MAX_VALUE;
	        
	        // Allow up to our iteration limit attempts at solving the chain
	        var solveDistance;
	        //var i = this.mMaxIterationAttempts;
	        //while( i-- ){
	        for ( var i = 0; i < this.mMaxIterationAttempts; i++ ){   

	            // Solve the chain for this target
	            solveDistance = this.solveIK( newTarget );
	            
	            // Did we solve it for distance? If so, update our best distance and best solution, and also
	            // update our last pass solve distance. Note: We will ALWAYS beat our last solve distance on the first run. 
	            if ( solveDistance < bestSolveDistance ) {   

	                bestSolveDistance = solveDistance;
	                bestSolution = this.cloneIkChain();
	                
	                // If we are happy that this solution meets our distance requirements then we can exit the loop now
	                if ( solveDistance <= this.mSolveDistanceThreshold ) break;
	                
	            } else {

	                // Did not solve to our satisfaction? Okay...
	                // Did we grind to a halt? If so break out of loop to set the best distance and solution that we have
	                if ( Math.abs( solveDistance - lastPassSolveDistance ) < this.mMinIterationChange )  break; //System.out.println("Ground to halt on iteration: " + loop);

	            }
	            
	            // Update the last pass solve distance
	            lastPassSolveDistance = solveDistance;
	            
	        }


	        // Did we get a solution that's better than the starting solution's to the new target location?
	        if ( bestSolveDistance < startingDistance ){
	            // If so, set the newly found solve distance and solution as the best found.
	            this.mCurrentSolveDistance = bestSolveDistance;
	            this.bones = bestSolution;
	        } else {
	            // Did we make things worse? Then we keep our starting distance and solution!
	            this.mCurrentSolveDistance = startingDistance;
	            this.bones = startingSolution; 
	        }
	        
	        // Update our last base and target locations so we know whether we need to solve for this start/end configuration next time
	        this.mLastBaseLocation.copy( this.mBaseLocation );
	        this.mLastTargetLocation.copy( newTarget );
	        
	        return this.mCurrentSolveDistance;
	    },

	    // -------------------------------
	    //
	    //      SOLVE IK
	    //
	    // -------------------------------

	    // Solve the IK chain for the given target using the FABRIK algorithm.
	    // retun the best solve distance found between the end-effector of this chain and the provided target.

	    solveIK : function( target ){

	        if ( this.mNumBones === 0 ) return;

	        var bone, boneLength, outerBone;
	        
	        // ---------- Forward pass from end effector to base -----------

	        // Loop over all bones in the chain, from the end effector (numBones-1) back to the basebone (0) 
	        var i = this.mNumBones;
	        while( i-- ){
	            // Get the length of the bone we're working on
	            bone = this.bones[i];
	            boneLength  = bone.getLength();
	            //joint = bone.getJoint();
	            //jointType = bone.getJointType();

	            // If we are NOT working on the end effector bone
	            if ( i != this.mNumBones - 1 ) {

	                outerBone = this.bones[ i+1 ];
	                // Get the outer-to-inner unit vector of the bone further out
	                var outerBoneOuterToInnerUV = outerBone.getDirectionUV().negated();

	                // Get the outer-to-inner unit vector of this bone
	                var boneOuterToInnerUV = bone.getDirectionUV().negated();

	                // Constrain the angle between the outer bone and this bone.
	                // Note: On the forward pass we constrain to the limits imposed by joint of the outer bone.
	                var clockwiseConstraintDegs     = outerBone.getJoint().getClockwiseConstraintDegs();
	                var antiClockwiseConstraintDegs = outerBone.getJoint().getAnticlockwiseConstraintDegs();

	                var constrainedUV;
	                if ( bone.getJointConstraintCoordinateSystem() === J_LOCAL ){
	                    constrainedUV = _Math.getConstrainedUV( boneOuterToInnerUV, outerBoneOuterToInnerUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs);
	                } else {// Constraint is in global coordinate system
	                    constrainedUV = _Math.getConstrainedUV( boneOuterToInnerUV, bone.getGlobalConstraintUV().negated(), clockwiseConstraintDegs, antiClockwiseConstraintDegs);
	                }
	                
	                
	                    
	                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
	                // so we can set the new inner joint location to be the end joint location of this bone plus the
	                // outer-to-inner direction unit vector multiplied by the length of the bone.
	                var newStartLocation = bone.getEndLocation().plus( constrainedUV.times( boneLength ) );

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

	                var constrainedUV;
	                if (i > 0) {
	                    // The end-effector bone is NOT the basebone as well
	                    // Get the outer-to-inner unit vector of the bone further in
	                    var innerBoneOuterToInnerUV = this.bones[i-1].getDirectionUV().negated();
	              
	                    // Constrain the angle between the this bone and the inner bone
	                    // Note: On the forward pass we constrain to the limits imposed by the first joint of the inner bone.
	                    var clockwiseConstraintDegs     = bone.getJoint().getClockwiseConstraintDegs();
	                    var antiClockwiseConstraintDegs = bone.getJoint().getAnticlockwiseConstraintDegs();

	                    if ( bone.getJointConstraintCoordinateSystem() === J_LOCAL ){
	                        // If this bone is locally constrained...
	                        constrainedUV = _Math.getConstrainedUV(boneOuterToInnerUV, innerBoneOuterToInnerUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs);
	                    } else {
	                        // End effector bone is globally constrained
	                        constrainedUV = _Math.getConstrainedUV(boneOuterToInnerUV, bone.getGlobalConstraintUV().negated(), clockwiseConstraintDegs, antiClockwiseConstraintDegs);
	                    }
	                } else {
	                    if ( bone.getJointConstraintCoordinateSystem() === J_LOCAL ){
	                        // Don't constraint (nothing to constraint against) if constraint is in local coordinate system
	                        constrainedUV = boneOuterToInnerUV;
	                    } else {
	                        // Can constrain if constraining against global coordinate system
	                        constrainedUV = _Math.getConstrainedUV(boneOuterToInnerUV, bone.getGlobalConstraintUV().negated(), clockwiseConstraintDegs, antiClockwiseConstraintDegs);
	                    }
	                }
	                
	              
	                                                
	                // Calculate the new start joint location as the end joint location plus the outer-to-inner direction UV
	                // multiplied by the length of the bone.
	                var newStartLocation = bone.getEndLocation().plus( constrainedUV.times(boneLength) );
	                
	                // Set the new start joint location for this bone to be new start location...
	                bone.setStartLocation( newStartLocation );

	                // ...and set the end joint location of the bone further in to also be at the new start location.
	                if (i > 0) this.bones[i-1].setEndLocation( newStartLocation );
	                
	            }
	            
	        } // End of forward pass loop over all bones

	        // ---------- Step 2 of 2 - Backward pass from base to end effector -----------
	 
	        for ( i = 0; i < this.mNumBones; i++ ){

	            bone = this.bones[i];
	            boneLength  = bone.getLength();

	            // If we are not working on the basebone
	            if ( i !== 0 ){

	                var previousBone = this.bones[i-1];
	                
	                // Get the inner-to-outer direction of this bone as well as the previous bone to use as a baseline
	                var BoneInnerToOuterUV = bone.getDirectionUV();
	                var prevBoneInnerToOuterUV = previousBone.getDirectionUV();
	                
	                // Constrain the angle between this bone and the inner bone.
	                // Note: On the backward pass we constrain to the limits imposed by the first joint of this bone.
	                var clockwiseConstraintDegs     = bone.getJoint().getClockwiseConstraintDegs();
	                var antiClockwiseConstraintDegs = bone.getJoint().getAnticlockwiseConstraintDegs();
	                
	                var constrainedUV;
	                if (bone.getJointConstraintCoordinateSystem() === J_LOCAL){
	                    constrainedUV = _Math.getConstrainedUV(BoneInnerToOuterUV, prevBoneInnerToOuterUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs);
	                } else {
	                    // Bone is constrained in global coordinate system
	                    constrainedUV = _Math.getConstrainedUV(BoneInnerToOuterUV, bone.getGlobalConstraintUV(), clockwiseConstraintDegs, antiClockwiseConstraintDegs);
	                }

	                // At this stage we have an inner-to-outer unit vector for this bone which is within our constraints,
	                // so we can set the new end location to be the start location of this bone plus the constrained
	                // inner-to-outer direction unit vector multiplied by the length of this bone.
	                var newEndLocation = bone.getStartLocation().plus( constrainedUV.times(boneLength) );

	                // Set the new end joint location for this bone
	                bone.setEndLocation(newEndLocation);

	                // If we are not working on the end bone, then we set the start joint location of
	                // the next bone in the chain (i.e. the bone closer to the end effector) to be the
	                // new end joint location of this bone also.
	                if (i < this.mNumBones-1) this.bones[i+1].setStartLocation(newEndLocation);
	                
	            } else {// If we ARE working on the base bone...
	               
	                // If the base location is fixed then snap the start location of the base bone back to the fixed base
	                if (this.mFixedBaseMode){
	                    bone.setStartLocation(this.mBaseLocation);
	                } else {// If the base location is not fixed...
	                
	                    // ...then set the new base bone start location to be its the end location minus the
	                    // bone direction multiplied by the length of the bone (i.e. projected backwards).
	                    //float boneZeroLength = this.bones[0].length();
	                    var boneZeroUV = this.bones[0].getDirectionUV();
	                    var boneZeroEndLocation = this.bones[0].getEndLocation();
	                    var newBoneZeroStartLocation = boneZeroEndLocation.minus( boneZeroUV.times(boneLength) );
	                    bone.setStartLocation(newBoneZeroStartLocation);
	                }
	                
	                // If the base bone is unconstrained then process it as usual...
	                if ( this.mBaseboneConstraintType === NONE){
	                    // Get the inner to outer direction of this bone
	                    var BoneInnerToOuterUV = bone.getDirectionUV();
	    
	                    // Calculate the new end location as the start location plus the direction times the length of the bone
	                    var newEndLocation = bone.getStartLocation().plus( BoneInnerToOuterUV.times(boneLength) );
	    
	                    // Set the new end joint location
	                    bone.setEndLocation(newEndLocation);
	    
	                    // Also, set the start location of the next bone to be the end location of this bone
	                    if (this.mNumBones > 1) this.bones[1].setStartLocation(newEndLocation);

	                } else {

	                    // ...otherwise we must constrain it to the basebone constraint unit vector
	                   
	                    // Note: The mBaseBoneConstraintUV is either fixed, or it may be dynamically updated from
	                    // a FabrikStructure2D if this chain is connected to another chain.
	                    
	                    // Get the inner-to-outer direction of this bone
	                    var BoneInnerToOuterUV = bone.getDirectionUV();

	                    // Get the constrained direction unit vector between the base bone and the base bone constraint unit vector
	                    // Note: On the backward pass we constrain to the limits imposed by the first joint of this bone.
	                    var clockwiseConstraintDegs     = bone.getJoint().getClockwiseConstraintDegs();
	                    var antiClockwiseConstraintDegs = bone.getJoint().getAnticlockwiseConstraintDegs();
	                    
	                    // LOCAL_ABSOLUTE? (i.e. local-space directional constraint) - then we must constraint about the relative basebone constraint UV...
	                    var constrainedUV;

	                    if ( this.mBaseboneConstraintType === LOCAL_ABSOLUTE ){
	                        constrainedUV = _Math.getConstrainedUV( BoneInnerToOuterUV, this.mBaseboneRelativeConstraintUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs);
	                        
	                    } else {
	                        // ...otherwise we're free to use the standard basebone constraint UV.
	                        constrainedUV = _Math.getConstrainedUV( BoneInnerToOuterUV, this.mBaseboneConstraintUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs );
	                    }
	                    
	                    // At this stage we have an inner-to-outer unit vector for this bone which is within our constraints,
	                    // so we can set the new end location to be the start location of this bone plus the constrained
	                    // inner-to-outer direction unit vector multiplied by the length of the bone.
	                    var newEndLocation = bone.getStartLocation().plus( constrainedUV.times(boneLength) );

	                    // Set the new end joint location for this bone
	                    bone.setEndLocation( newEndLocation );

	                    // If we are not working on the end bone, then we set the start joint location of
	                    // the next bone in the chain (i.e. the bone closer to the end effector) to be the
	                    // new end joint location of this bone.
	                    if (i < (this.mNumBones - 1)) { this.bones[i+1].setStartLocation( newEndLocation ); }
	                    
	                
	                } // End of basebone constraint enforcement section         

	            } // End of base bone handling section

	        } // End of backward-pass loop over all bones

	        // Update our last target location
	        this.mLastTargetLocation.copy( target );
	                
	        // Finally, get the current effector location...
	        var currentEffectorLocation = this.bones[this.mNumBones-1].getEndLocation();
	                
	        // ...and calculate and return the distance between the current effector location and the target.
	        return _Math.distanceBetween( currentEffectorLocation, target );
	    },

	    updateChainLength : function(){

	        // Loop over all the bones in the chain, adding the length of each bone to the mChainLength property
	        this.bonesLength = 0;
	        var i = this.mNumBones;
	        while(i--) this.bonesLength += this.bones[i].getLength();

	    },

	    cloneIkChain : function(){

	        // How many bones are in this chain?
	        var numBones = this.bones.length;
	        
	        // Create a new Array
	        var clonedChain = [];

	        // For each bone in the chain being cloned...       
	        for (var i = 0; i < numBones; i++){
	            // Use the copy constructor to create a new Bone with the values set from the source Bone.
	            // and add it to the cloned chain.
	            clonedChain.push( this.bones[i].clone() );
	        }
	        
	        return clonedChain;

	    }


	// end

	} );

	function Structure2D ( scene ) {

	    //this.UP = new V2( 0, 1 );
	    this.mFixedBaseMode = true;

	    this.chains = [];
	    this.meshChains = [];
	    this.targets = [];
	    this.mNumChains = 0;

	    this.scene = scene;

	    this.isWithMesh = false;

	}

	Object.assign( Structure2D.prototype, {

	    isStructure2D: true,

	    update:function(){

	        var c, m, b, t, pos, pos2, tmp = new THREE.Vector3( );
	        var hostChainNumber;
	        var hostBone, constraintType;

	        for( var i = 0; i < this.mNumChains; i++ ){

	            c = this.chains[i];
	            m = this.meshChains[i];
	            t = this.targets[i];

	            //console.log(t)

	            hostChainNumber = c.getConnectedChainNumber();

	            // Get the basebone constraint type of the chain we're working on
	            constraintType = c.getBaseboneConstraintType();

	            // If this chain is not connected to another chain and the basebone constraint type of this chain is not global absolute
	            // then we must update the basebone constraint UV for LOCAL_RELATIVE and the basebone relative constraint UV for LOCAL_ABSOLUTE connection types.
	            // Note: For NONE or GLOBAL_ABSOLUTE we don't need to update anything before calling updateTarget().
	            if (hostChainNumber !== -1 && constraintType !== GLOBAL_ABSOLUTE) {   
	                // Get the bone which this chain is connected to in the 'host' chain
	                var hostBone = this.chains[hostChainNumber].getBone( c.getConnectedBoneNumber() );
	                
	                // If we're connecting this chain to the start location of the bone in the 'host' chain...
	                if( c.getBoneConnectionPoint() === START ){
	                    // ...set the base location of this bone to be the start location of the bone it's connected to.
	                    c.setBaseLocation( hostBone.getStartLocation() );
	                } else {
	                    // If the bone connection point is BoneConnectionPoint.END...
	                   
	                    // ...set the base location of the chain to be the end location of the bone we're connecting to.
	                    c.setBaseLocation( hostBone.getEndLocation() );
	                }
	                
	                // If the basebone is constrained to the direction of the bone it's connected to...
	                var hostBoneUV = hostBone.getDirectionUV();

	                if (constraintType === LOCAL_RELATIVE){   

	                    // ...then set the basebone constraint UV to be the direction of the bone we're connected to.
	                    c.setBaseboneConstraintUV(hostBoneUV);

	                } else if (constraintType === LOCAL_ABSOLUTE) {   

	                    // Note: LOCAL_ABSOLUTE directions are directions which are in the local coordinate system of the host bone.
	                    // For example, if the baseboneConstraintUV is Vec2f(-1.0f, 0.0f) [i.e. left], then the baseboneConnectionConstraintUV
	                    // will be updated to be left with regard to the host bone.
	                    
	                    // Get the angle between UP and the hostbone direction
	                    var angleDegs = UP.getSignedAngleDegsTo(hostBoneUV);


	                    
	                    // ...then apply that same rotation to this chain's basebone constraint UV to get the relative constraint UV... 
	                    var relativeConstraintUV = _Math.rotateDegs( c.getBaseboneConstraintUV(), angleDegs );
	                    
	                    // ...which we then update.
	                    c.setBaseboneRelativeConstraintUV(relativeConstraintUV);      

	                }
	                
	                // NOTE: If the basebone constraint type is NONE then we don't do anything with the basebone constraint of the connected chain.
	                
	            } // End of if chain is connected to another chain section

	            //this.chains[0].updateTarget( this.targets[0] );

	            /*if (hostChainNumber === -1) c.updateTarget( t );
	            else{
	                hostChain = this.chains[hostChainNumber];
	                hostBone  = hostChain.getBone( c.getConnectedBoneNumber() );
	                if( hostBone.getBoneConnectionPoint() === START ) c.setBaseLocation( hostBone.getStartLocation() );
	                else c.setBaseLocation( hostBone.getEndLocation() );

	                constraintType = c.getBaseboneConstraintType();
	                var hostBoneUV = hostBone.getDirectionUV();
	                switch (constraintType){
	                    case NONE:         // Nothing to do because there's no basebone constraint
	                    break;
	                        
	                    // If we have a local rotor or hinge constraint then we must calculate the relative basebone constraint before calling updateTarget
	                    case LOCAL_RELATIVE:

	                        c.setBaseboneConstraintUV( hostBoneUV );

	                    break;
	                    case LOCAL_ABSOLUTE:
	                    // Note: LOCAL_ABSOLUTE directions are directions which are in the local coordinate system of the host bone.
	                    // For example, if the baseboneConstraintUV is Vec2f(-1.0f, 0.0f) [i.e. left], then the baseboneConnectionConstraintUV
	                    // will be updated to be left with regard to the host bone.

	                    // Get the angle between UP and the hostbone direction
	                    var angleDegs = UP.getSignedAngleDegsTo( hostBoneUV );

	                    // ...then apply that same rotation to this chain's basebone constraint UV to get the relative constraint UV... 
	                    var relativeConstraintUV = _Math.rotateDegs( thisChain.getBaseboneConstraintUV(), angleDegs);
	                        
	                    // ...which we then update.
	                    c.setBaseboneRelativeConstraintUV( relativeConstraintUV );

	                    break;

	                }*/

	                
	            //c.resetTarget();//
	                //hostChain.updateTarget( this.targets[hostChainNumber] );

	            //c.updateTarget( t );

	            if ( !c.mUseEmbeddedTarget ) c.updateTarget( t );
	            else c.solveForEmbeddedTarget();


	            // update 3d mesh

	            if( this.isWithMesh ){
	                for ( var j = 0; j < c.mNumBones; j++ ) {
	                    b = c.getBone(j);
	                    pos = b.getStartLocation();
	                    pos2 = b.getEndLocation();
	                    m[j].position.set( pos.x, pos.y, 0 );
	                    m[j].lookAt( tmp.set( pos2.x, pos2.y, 0 ) );
	                }

	            }


	        }

	                

	       // }

	    },

	    setFixedBaseMode: function( b ){

	        // Update our flag and set the fixed base mode on the first (i.e. 0th) chain in this structure.
	        this.mFixedBaseMode = b; 
	        this.chains[0].setFixedBaseMode(this.mFixedBaseMode);

	    },

	    clear:function(){

	        this.clearAllBoneMesh();

	        var i;

	        i = this.mNumChains;
	        while(i--){
	            this.remove(i);
	        }

	        this.chains = [];
	        this.meshChains = [];
	        this.targets = [];

	    },

	    add:function( chain, target, meshBone ){

	        this.chains.push( chain );

	        //if( target.isVector3 ) target = new V2(target.x, target.y);
	         
	        this.targets.push( target ); 
	        this.mNumChains ++;

	        if( meshBone ) this.addChainMeshs( chain );
	    },

	    remove:function( id ){

	        this.chains[id].clear();
	        this.chains.splice(id, 1);
	        this.meshChains.splice(id, 1);
	        this.targets.splice(id, 1);
	        this.mNumChains --;

	    },

	    /*setFixedBaseMode:function( fixedBaseMode ){
	        for ( var i = 0; i < this.mNumChains; i++) {
	            this.chains[i].setFixedBaseMode( fixedBaseMode );
	        }
	    },*/

	    getNumChains:function(){

	        return this.mNumChains;

	    },

	    getChain:function(id){

	        return this.chains[id];

	    },

	    connectChain : function( newChain, existingChainNumber, existingBoneNumber, boneConnectionPoint, target, meshBone, color ){

	        if ( existingChainNumber > this.mNumChains ) return;
	        if ( existingBoneNumber > this.chains[existingChainNumber].getNumBones() ) return;

	        newChain.setBoneConnectionPoint( boneConnectionPoint === 'end' ? END : START );

	        // Make a copy of the provided chain so any changes made to the original do not affect this chain
	        var relativeChain = newChain.clone();//new Fullik.Chain( newChain );

	        relativeChain.setConnectedChainNumber(existingChainNumber);
	        relativeChain.setConnectedBoneNumber(existingBoneNumber);
	        //if( color !== undefined ) relativeChain.setColor( color );
	        //else color = newChain.color;

	        // Connect the copy of the provided chain to the specified chain and bone in this structure
	        //relativeChain.connectToStructure( this, existingChainNumber, existingBoneNumber );

	        // The chain as we were provided should be centred on the origin, so we must now make it
	        // relative to the start location of the given bone in the given chain.

	        var connectionPoint = boneConnectionPoint || this.getChain( existingChainNumber ).getBone( existingBoneNumber ).getBoneConnectionPoint();
	        var connectionLocation;

	        if ( connectionPoint === 'start' ) connectionLocation = this.chains[existingChainNumber].getBone(existingBoneNumber).getStartLocation();
	        else connectionLocation = this.chains[existingChainNumber].getBone(existingBoneNumber).getEndLocation();
	         

	        relativeChain.setBaseLocation( connectionLocation );
	        // When we have a chain connected to a another 'host' chain, the chain is which is connecting in
	        // MUST have a fixed base, even though that means the base location is 'fixed' to the connection
	        // point on the host chain, rather than a static location.
	        relativeChain.setFixedBaseMode( true );

	        // Translate the chain we're connecting to the connection point
	        for ( var i = 0; i < relativeChain.getNumBones(); i++ ){

	            var origStart = relativeChain.getBone(i).getStartLocation();
	            var origEnd   = relativeChain.getBone(i).getEndLocation();
	            
	            var translatedStart = origStart.plus(connectionLocation);
	            var translatedEnd   = origEnd.plus(connectionLocation);
	            
	            relativeChain.getBone(i).setStartLocation(translatedStart);
	            relativeChain.getBone(i).setEndLocation(translatedEnd);
	        }
	        
	        this.add( relativeChain, target, meshBone );

	    },


	    // 3D THREE

	    addChainMeshs:function( chain, id ){

	        this.isWithMesh = true;

	        var meshBone = [];

	        var lng  = chain.bones.length;
	        for(var i = 0; i<lng; i++ ){
	            meshBone.push( this.addBoneMesh( chain.bones[i] ) );
	        }

	        this.meshChains.push( meshBone );

	    },

	    addBoneMesh:function( bone ){

	        var size = bone.mLength;
	        var color = bone.color;
	        //console.log(bone.color)
	        var g = new THREE.CylinderBufferGeometry ( 1, 0.5, size, 4 );
	        g.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
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

	exports._Math = _Math;
	exports.V2 = V2;
	exports.V3 = V3;
	exports.M3 = M3;
	exports.Joint3D = Joint3D;
	exports.Bone3D = Bone3D;
	exports.Chain3D = Chain3D;
	exports.Structure3D = Structure3D;
	exports.Joint2D = Joint2D;
	exports.Bone2D = Bone2D;
	exports.Chain2D = Chain2D;
	exports.Structure2D = Structure2D;
	exports.REVISION = REVISION;
	exports.NONE = NONE;
	exports.GLOBAL_ROTOR = GLOBAL_ROTOR;
	exports.GLOBAL_HINGE = GLOBAL_HINGE;
	exports.LOCAL_ROTOR = LOCAL_ROTOR;
	exports.LOCAL_HINGE = LOCAL_HINGE;
	exports.GLOBAL_ABSOLUTE = GLOBAL_ABSOLUTE;
	exports.LOCAL_RELATIVE = LOCAL_RELATIVE;
	exports.LOCAL_ABSOLUTE = LOCAL_ABSOLUTE;
	exports.J_BALL = J_BALL;
	exports.J_LOCAL = J_LOCAL;
	exports.J_GLOBAL = J_GLOBAL;
	exports.START = START;
	exports.END = END;
	exports.X_AXE = X_AXE;
	exports.Y_AXE = Y_AXE;
	exports.Z_AXE = Z_AXE;
	exports.X_NEG = X_NEG;
	exports.Y_NEG = Y_NEG;
	exports.Z_NEG = Z_NEG;
	exports.UP = UP;
	exports.DOWN = DOWN;
	exports.LEFT = LEFT;
	exports.RIGHT = RIGHT;
	exports.MTX = MTX;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

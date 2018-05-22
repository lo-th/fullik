import { _Math } from './Math.js';
import { V3 } from './V3.js';


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
	    //return this.times( v );
	    return v.clone().applyM3( this );

	},

	/*times: function ( v ) {

		if( v.isVector3 ){

			var te = this.elements;

			return new V3(
		        te[ 0 ] * v.x + te[ 1 ] * v.y + te[ 2 ] * v.z,
		        te[ 3 ] * v.x + te[ 4 ] * v.y + te[ 5 ] * v.z,
		        te[ 6 ] * v.x + te[ 7 ] * v.y + te[ 8 ] * v.z
		    );

		}

	},*/

	/*getAngleLimitedUnitVectorDegs: function ( vecToLimit, vecBaseline, angleLimitDegs ) {

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


	},*/

	/*transpose: function ( m ) {

	    return new M3( m.m11, m.m21, m.m31,   m.m12, m.m22, m.m32,   m.m13, m.m23, m.m33 );

	},

	zero: function () {

	    te[ 0 ] = te[ 3 ] = te[ 6 ] = te[ 1 ] = te[ 4 ] = te[ 7 ] = te[ 2 ] = te[ 5 ] = te[ 8 ] = 0;
	    return this;

	},

	setIdentity: function () {

	    te[ 0 ] = te[ 4 ] = te[ 8 ] = 1;
	    te[ 3 ] = te[ 6 ] = te[ 1 ] = te[ 7 ] = te[ 2 ] = te[ 5 ] = 0;
	    return this;

	},

	determinant: function(){

	    return te[ 2 ] * te[ 3 ] * te[ 7 ] - te[ 2 ]  * te[ 6 ] * te[ 4 ] - te[ 1 ] * te[ 3 ] * te[ 8 ] + te[ 1 ] * te[ 6 ] * te[ 5 ] + te[ 0 ] * te[ 4 ] * te[ 8 ] - te[ 0 ] * te[ 7 ] * te[ 5 ];

	},*/

	

	/*isOrthogonal: function () {

	    var xCrossYDot = _Math.dotProduct( this.getXBasis(), this.getYBasis() );
	    var xCrossZDot = _Math.dotProduct( this.getXBasis(), this.getZBasis() );
	    var yCrossZDot = _Math.dotProduct( this.getYBasis(), this.getZBasis() );
	    
	    if ( _Math.nearEquals(xCrossYDot, 0,  0.01) && _Math.nearEquals(xCrossZDot, 0,  0.01) && _Math.nearEquals(yCrossZDot, 0,  0.01) ) return true;
	    return false;

	},

	inverse: function ( m ) {

	    var d = 1 / m.determinant();
	        
	    var temp = new M3();
	    
	    temp.m11 =  (m.m22  * m.m33 - m.m23 * m.m32) * d;
	    temp.m12 = -(m.m12  * m.m33 - m.m13 * m.m32) * d;
	    temp.m13 =  (m.m12  * m.m23 - m.m13 * m.m22) * d;
	    temp.m21 = -(-m.m31 * m.m23 + m.m21 * m.m33) * d;
	    temp.m22 =  (-m.m31 * m.m13 + m.m11 * m.m33) * d;
	    temp.m23 = -(-m.m21 * m.m13 + m.m11 * m.m23) * d;
	    temp.m31 =  (-m.m31 * m.m22 + m.m21 * m.m32) * d;
	    temp.m32 = -(-m.m31 * m.m12 + m.m11 * m.m32) * d;
	    temp.m33 =  (-m.m21 * m.m13 + m.m11 * m.m22) * d;

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

	    var t00 = te[ 0 ] * f00 + te[ 1 ] * f01 + te[ 2 ] * f02;
	    var t01 = te[ 3 ] * f00 + te[ 4 ] * f01 + te[ 5 ] * f02;
	    var t02 = te[ 6 ] * f00 + te[ 7 ] * f01 + te[ 8 ] * f02;

	    var t10 = te[ 0 ] * f10 + te[ 1 ] * f11 + te[ 2 ] * f12;
	    var t11 = te[ 3 ] * f10 + te[ 4 ] * f11 + te[ 5 ] * f12;
	    var t12 = te[ 6 ] * f10 + te[ 7 ] * f11 + te[ 8 ] * f12;

	    // Construct and return rotation matrix
	    dest.m31 = te[ 0 ] * f20 + te[ 1 ] * f21 + te[ 2 ] * f22;
	    dest.m32 = te[ 3 ] * f20 + te[ 4 ] * f21 + te[ 5 ] * f22;
	    dest.m33 = te[ 6 ] * f20 + te[ 7 ] * f21 + te[ 8 ] * f22;

	    dest.m11 = t00;
	    dest.m12 = t01;
	    dest.m13 = t02;

	    dest.m21 = t10;
	    dest.m22 = t11;
	    dest.m23 = t12;

	    return dest;

	},

	rotateDegs: function ( angleDegs, localAxis ) {

	    return this.rotateRads( localAxis, angleDegs * _Math.toRad ); 

	},

	setXBasis: function ( v ) {

	    te[ 0 ] = v.x; te[ 3 ] = v.y; te[ 6 ] = v.z;

	},

	setYBasis: function ( v ) {

	    te[ 1 ] = v.x; te[ 4 ] = v.y; te[ 7 ] = v.z;

	},

	setZBasis: function ( v ) {
	    
	    te[ 2 ] = v.x; te[ 5 ] = v.y; te[ 8 ] = v.z;

	},

	getXBasis: function() {

	    return new V3( te[ 0 ], te[ 3 ], te[ 6 ] );
	    
	},

	getYBasis: function(){

	    return new V3( te[ 1 ], te[ 4 ], te[ 7 ] );

	},

	getZBasis: function () {

	    return new V3( te[ 2 ], te[ 5 ], te[ 8 ] );

	}*/


} );

export { M3 };
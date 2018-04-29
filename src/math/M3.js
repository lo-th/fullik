import { _Math } from './Math.js';
import { V3 } from './V3.js';


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

	    return this.setV3( xAxis, yAxis, zAxis );;

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

export { M3 };
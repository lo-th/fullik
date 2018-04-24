import { V3 } from './V3.js';
import { V2 } from './V2.js';
import { M3 } from './M3.js';


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

	dotProduct: function ( v1, v2 ) { 

	    var v1Norm = v1.normalised();
	    var v2Norm = v2.normalised();
	    return v1Norm.x * v2Norm.x + v1Norm.y * v2Norm.y + v1Norm.z * v2Norm.z;

	},

	crossProduct: function ( v1, v2 ) { 

	    return new V3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);

	},

	genPerpendicularVectorQuick: function ( v ) {

	    var perp;
	    if ( Math.abs(v.y) < 0.99 ) perp = new V3( -v.z, 0, v.x ); // cross(v, UP)
	    else perp = new V3( 0, v.z, -v.y ); // cross(v, RIGHT)
	    return perp.normalize();

	},

	genPerpendicularVectorHM: function ( v ) { 

	    var a = _Math.absV3( v );
	    if (a.x <= a.y && a.x <= a.z) return new V3(0, -v.z, v.y).normalize();
	    else if (a.y <= a.x && a.y <= a.z) return new V3(-v.z, 0, v.x).normalize();
	    else return new V3(-v.y, v.x, 0).normalize();

	},

	genPerpendicularVectorFrisvad: function ( v ) { 

	    if ( v.z < -0.9999999 ) return new V3(0., -1, 0);// Handle the singularity
	    var a = 1/(1 + v.z);
	    return new V3(1 - v.x * v.x * a, -v.x * v.y * a, -v.x).normalize();

	},

	getUvBetween: function ( v1, v2 ) {

	     return new V3().copy( v2.minus(v1) ).normalize();

	},

	/*timesV3: function ( v, scale ) {

		if( v.isVector3 ) v.multiplyScalar( scale );

	    //v.x *= scale; v.y *= scale; v.z *= scale;

	},*/

	absV3: function ( v ) { 

	    return new V3( v.x < 0 ? -v.x : v.x, v.y < 0 ? -v.y : v.y, v.z < 0 ? -v.z : v.z);

	},

	getAngleBetweenRads: function ( v1, v2 ){ 

	    return Math.acos( _Math.dotProduct( v1,  v2 ) );

	},

	getAngleBetweenDegs: function( v1, v2 ){

	    return _Math.getAngleBetweenRads( v1, v2 ) * _Math.toDeg;

	},

	getSignedAngleBetweenDegs: function ( referenceVector, otherVector, normalVector ) {

	    var unsignedAngle = _Math.getAngleBetweenDegs( referenceVector, otherVector );
	    var sign          = _Math.sign( _Math.dotProduct( _Math.crossProduct( referenceVector, otherVector ), normalVector ) );        
	    return unsignedAngle * sign;

	},

	getDirectionUV: function ( a, b ) {

	    return b.minus( a ).normalize();

	},

	rotateAboutAxisDegs: function ( v, angleDegs, axis ) {

	    return _Math.rotateAboutAxisRads( v, angleDegs * _Math.toRad, axis ); 

	},

	rotateAboutAxisRads: function ( v, angleRads, rotationAxis ){

	    var rotationMatrix = new M3();

	    var sinTheta = Math.sin( angleRads );
	    var cosTheta = Math.cos( angleRads );
	    var oneMinusCosTheta = 1.0 - cosTheta;
	    
	    // It's quicker to pre-calc these and reuse than calculate x * y, then y * x later (same thing).
	    var xyOne = rotationAxis.x * rotationAxis.y * oneMinusCosTheta;
	    var xzOne = rotationAxis.x * rotationAxis.z * oneMinusCosTheta;
	    var yzOne = rotationAxis.y * rotationAxis.z * oneMinusCosTheta;

	    //var te = rotationMatrix.elements;
	    
	    // Calculate rotated x-axis
	    rotationMatrix.m00 = rotationAxis.x * rotationAxis.x * oneMinusCosTheta + cosTheta;
	    rotationMatrix.m01 = xyOne + rotationAxis.z * sinTheta;
	    rotationMatrix.m02 = xzOne - rotationAxis.y * sinTheta;

	    // Calculate rotated y-axis
	    rotationMatrix.m10 = xyOne - rotationAxis.z * sinTheta;
	    rotationMatrix.m11 = rotationAxis.y * rotationAxis.y * oneMinusCosTheta + cosTheta;
	    rotationMatrix.m12 = yzOne + rotationAxis.x * sinTheta;

	    // Calculate rotated z-axis
	    rotationMatrix.m20 = xzOne + rotationAxis.y * sinTheta;
	    rotationMatrix.m21 = yzOne - rotationAxis.x * sinTheta;
	    rotationMatrix.m22 = rotationAxis.z * rotationAxis.z * oneMinusCosTheta + cosTheta;

	    // Multiply the source by the rotation matrix we just created to perform the rotation
	    return rotationMatrix.times( v );

	},

	// rotation

	rotateXDegs: function ( v, angleDegs ) { return _Math.rotateXRads( v, angleDegs * _Math.toRad ); },
	rotateYDegs: function ( v, angleDegs ) { return _Math.rotateYRads( v, angleDegs * _Math.toRad ); },
	rotateZDegs: function ( v, angleDegs ) { return _Math.rotateZRads( v, angleDegs * _Math.toRad ); },

	rotateXRads: function ( v, angleRads ) {

	    var cosTheta = Math.cos( angleRads );
	    var sinTheta = Math.sin( angleRads );
	    return new V3( v.x, v.y * cosTheta - v.z * sinTheta, v.y * sinTheta + v.z * cosTheta );

	},

	rotateYRads: function ( v, angleRads ) {

	    var cosTheta = Math.cos( angleRads );
	    var sinTheta = Math.sin( angleRads );
	    return new V3( v.z * sinTheta + v.x * cosTheta, v.y, v.z * cosTheta - v.x * sinTheta );

	},

	rotateZRads: function ( v, angleRads ) {

	    var cosTheta = Math.cos( angleRads );
	    var sinTheta = Math.sin( angleRads );
	    return new V3( v.x * cosTheta - v.y * sinTheta, v.x * sinTheta + v.y * cosTheta, v.z );

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
	        return _Math.rotateAboutAxisDegs( vecBaseline, angleLimitDegs, correctionAxis ).normalize();
	    }
	    else // Angle not greater than limit? Just return a normalised version of the vecToLimit
	    {
	        // This may already BE normalised, but we have no way of knowing without calcing the length, so best be safe and normalise.
	        // TODO: If performance is an issue, then I could get the length, and if it's not approx. 1.0f THEN normalise otherwise just return as is.
	        return vecToLimit.normalised();
	    }


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

	createRotationMatrix: function ( referenceDirection ) {

	    var xAxis, yAxis, zAxis = referenceDirection.normalised();
	            
	    // Handle the singularity (i.e. bone pointing along negative Z-Axis)...
	    if( referenceDirection.z < -0.9999999 ){
	        xAxis = new V3(1, 0, 0); // ...in which case positive X runs directly to the right...
	        yAxis = new V3(0, 1, 0); // ...and positive Y runs directly upwards.
	    } else {
	        var a = 1/(1 + zAxis.z);
	        var b = -zAxis.x * zAxis.y * a;           
	        xAxis = new V3( 1 - zAxis.x * zAxis.x * a, b, -zAxis.x ).normalize();
	        yAxis = new V3( b, 1 - zAxis.y * zAxis.y * a, -zAxis.y ).normalize();
	    }

	    var mtx = new M3();
	    mtx.setV3( xAxis, yAxis, zAxis );
	     
	    return mtx;

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
		if (signedAngleDegs > antiClockwiseConstraintDegs)
		{			
			// ...then our constrained unit vector is the baseline rotated by the anti-clockwise constraint angle.
			// Note: We could do this by calculating a correction angle to apply to the directionUV, but it's simpler to work from the baseline.
			return this.rotateDegs( baselineUV, antiClockwiseConstraintDegs );
		}
		
		// If we've exceeded the clockwise (negative) constraint angle...
		if (signedAngleDegs < -clockwiseConstraintDegs)
		{	
			// ...then our constrained unit vector is the baseline rotated by the clockwise constraint angle.
			// Note: Again, we could do this by calculating a correction angle to apply to the directionUV, but it's simpler to work from the baseline.
			return this.rotateDegs( baselineUV, -clockwiseConstraintDegs );
		}
		
		// If we have not exceeded any constraint then we simply return the original direction unit vector
		return directionUV;

	},

	rotateRads: function( v, angleRads ) {

		var cosTheta = Math.cos(angleRads);
		var sinTheta = Math.sin(angleRads);
		return new V2( v.x * cosTheta - v.y * sinTheta,  v.x * sinTheta + v.y * cosTheta );

	},

	rotateDegs: function( v, angleDegs ) {

		return this.rotateRads( v, angleDegs * this.toRad );
 
	},


	validateDirectionUV: function( directionUV ) {

		if( directionUV.length() < 0) throw new Error("vector direction unit vector cannot be zero.");
 
	},

	validateLength: function( length ) {

		if(length < 0) throw new Error("Length must be a greater than or equal to zero.");
 
	},



};

export { _Math };
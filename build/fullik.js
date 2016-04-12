
var THREE;

var Fullik = Fullik || {};

Fullik.torad = 0.0174532925199432957;
Fullik.todeg = 57.295779513082320876;

Fullik.MIN_ANGLE_DEGS = 0;
Fullik.MAX_ANGLE_DEGS = 180;


Fullik.MAX_VALUE = Infinity;//Number.MAX_VALUE;

Fullik.PRECISION = 0.001;
Fullik.PRECISION_DEG = 0.01;

// point position
//Fullik.START = 0; 
//Fullik.END = 1;

// joint Type
Fullik.J_BALL = 1;  // ball-joint constraint about the previous bone in the chain
Fullik.J_GLOBAL_HINGE = 4; //A world-space hinge constraint
Fullik.J_LOCAL_HINGE = 5; // A hinge constraint relative to the previous bone in the chain.

// chain Basebone Constraint Type 
Fullik.BB_NONE = 1; // No constraint - basebone may rotate freely
Fullik.BB_GLOBAL_ROTOR = 2; // World-space rotor constraint
Fullik.BB_GLOBAL_HINGE = 4; // World-space hinge constraint

Fullik.BB_LOCAL_ROTOR = 3;// Rotor constraint in the coordinate space of (i.e. relative to) the direction of the connected bone
Fullik.BB_LOCAL_HINGE = 5;// Hinge constraint in the coordinate space of (i.e. relative to) the direction of the connected bone

// the LOCAL_ROTOR and LOCAL_HINGE basebone constraint types are only available 
// to be used by chains which are connected to other chains. 
// In addition, hinge constraints may have an additional reference axis constraint which is the direction
// within the axis of the hinge about which clockwise/anticlockwise movement is allowed.

Fullik.lerp = function (a, b, percent) { return a + (b - a) * percent; };
Fullik.randRange = function (min, max) { return Fullik.lerp( min, max, Math.random()); };
Fullik.randRangeInt = function (min, max, n) { return Fullik.lerp( min, max, Math.random()).toFixed(n || 0)*1; };
Fullik.nearEquals = function (a, b, t) { return Math.abs(a - b) <= t ? true : false; };
Fullik.sign = function ( v ) { return v >= 0 ? 1 : -1; };

Fullik.radtodeg = function ( v ) { return v * Fullik.todeg; };
Fullik.degtorad = function ( v ) { return v * Fullik.torad; };
//Return the co-tangent of an angle specified in radians.
Fullik.cot = function ( a ) { return 1 / Math.tan( a ); };


// -------------------------------
//
//      Vector3 >> V3
//
// -------------------------------

Fullik.V3 = function( x, y, z ){
    THREE.Vector3.call( this, x, y, z );
}

Fullik.V3.prototype = Object.create( THREE.Vector3.prototype );
Fullik.V3.prototype.constructor = Fullik.V3;


Fullik.V3.prototype.lengthIsApproximately = function( t ){
    return Math.abs(this.length() - 1.0) < t ? true : false;
},

Fullik.V3.prototype.normalised = function(){
    return this.clone().normalize();
};

Fullik.V3.prototype.times = function( scale ){
    return this.clone().multiplyScalar(scale);
};

Fullik.V3.prototype.plus = function(v){
    return this.clone().add(v);
};

Fullik.V3.prototype.minus = function( v ){
    return this.clone().sub(v);
}

Fullik.V3.prototype.randomise = function( min, max ){
    this.x = Fullik.randRange( min, max );
    this.y = Fullik.randRange( min, max );
    this.z = Fullik.randRange( min, max );
};

Fullik.V3.prototype.negated = function() { 
    return this.clone().negate();
};

Fullik.V3.prototype.approximatelyEquals = function( v, t ){ 
    var xDiff = Math.abs(this.x - v.x);
    var yDiff = Math.abs(this.y - v.y);
    var zDiff = Math.abs(this.z - v.z);
    return (xDiff < t && yDiff < t && zDiff < t);
};

/*

Fullik.V3.prototype.length = function(  ){
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
},

Fullik.V3.prototype.divideBy = function( s ){
    return this.clone().divideScalar( s );
};

Fullik.V3.prototype.normalize = function( min, max ){
    var magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

    // As long as the magnitude is greater then zero, divide each element by the
    // magnitude to get the normalised value between -1 and +1.
    // Note: If the vector has a magnitude of zero we simply return it - we
    // could instead throw a RuntimeException here... but it's better to continue.
    if (magnitude > 0)
    {
        this.x /= magnitude;
        this.y /= magnitude;
        this.z /= magnitude;
    }
    
    // Return this for chaining
    return this;
};



Fullik.V3.prototype.projectOntoPlane = function( planeNormal ){
    if ( !(planeNormal.length() > 0) ) return; //{ throw new IllegalArgumentException("Plane normal cannot be a zero vector."); }
        
        // Projection of vector b onto plane with normal n is defined as: b - ( b.n / ( |n| squared )) * n
        // Note: |n| is length or magnitude of the vector n, NOT its (component-wise) absolute value        
        var b = this.normalised();
        var n = planeNormal.normalised();     
        return b.minus( n.times( Fullik.dotProduct(b, planeNormal) ) ).normalize();
};

Fullik.V3.prototype.cross = function( v ) { 
    return this.clone().cross();//new Fullik.V3(this.y * v.z - this.z * v.y,    this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
};

*/






Fullik.perpendicular = function( a, b ){
    return Fullik.nearEquals( Fullik.dotProduct(a, b), 0.0, 0.01 ) ? true : false;
};

Fullik.scalarProduct = function( v1, v2 ) { 
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z; 
};

Fullik.dotProduct = function(v1, v2) { 
    var v1Norm = v1.normalised();
    var v2Norm = v2.normalised();
    return v1Norm.x * v2Norm.x + v1Norm.y * v2Norm.y + v1Norm.z * v2Norm.z;
};

Fullik.crossProduct = function( v1, v2 ) { 
    return new Fullik.V3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
};

Fullik.genPerpendicularVectorQuick = function( v ) { 
    var perp = new Fullik.V3();
    if ( Math.abs( v.y ) < 0.99 ) perp.set( -v.z, 0, v.x ); // cross(v, UP)
    else perp.set( 0, v.z, -v.y ); // cross(v, RIGHT)
    return perp.normalize();
};

/*Fullik.genPerpendicularVectorHM = function( v ) { 
    var a = Fullik.absV3( v );
    if (a.x <= a.y && a.x <= a.z) return new Fullik.V3(0, -v.z, v.y).normalize();
    else if (a.y <= a.x && a.y <= a.z) return new Fullik.V3(-v.z, 0, v.x).normalize();
    else return new Fullik.V3(-v.y, v.x, 0).normalize();
};

Fullik.genPerpendicularVectorFrisvad = function( v ) { 
    if (v.z < -0.9999999) return new Fullik.V3(0, -1, 0);// Handle the singularity
    var a = 1/(1 + v.z);
    return new Fullik.V3(1 - v.x * v.x * a, -v.x * v.y * a, -v.x).normalize();
};*/

Fullik.getUvBetween = function( v1, v2 ) { 
     return v2.minus(v1).normalize();
};

/*Fullik.timesV3 = function( v, scale ) { 
    v.x *= scale; 
    v.y *= scale; 
    v.z *= scale;
};

Fullik.absV3 = function( v ) { 
    return new Fullik.V3( v.x < 0 ? -v.x : v.x, v.y < 0 ? -v.y : v.y, v.z < 0 ? -v.z : v.z );
};*/


Fullik.getAngleBetweenRads = function( v1, v2 ){ 
    return Math.acos( Fullik.dotProduct( v1,  v2 ) );
};

Fullik.getAngleBetweenDegs = function( v1, v2 ){ 
    return Fullik.getAngleBetweenRads( v1, v2 ) * Fullik.todeg;
};

Fullik.getSignedAngleBetweenDegs = function( referenceVector, otherVector, normalVector ){ 
    var unsignedAngle = Fullik.getAngleBetweenDegs( referenceVector, otherVector );
    var sign          = Fullik.sign( Fullik.dotProduct( Fullik.crossProduct( referenceVector, otherVector ), normalVector ) );        
    return unsignedAngle * sign;
};


Fullik.getDirectionUV = function( v1, v2 ){
    return v2.minus( v1 ).normalize();
};

Fullik.rotateAboutAxisDegs = function( v, angleDegs, axis ){ 
    return Fullik.rotateAboutAxisRads( v, angleDegs * Fullik.torad, axis ); 
};

Fullik.rotateAboutAxisRads = function( v, rad, rotationAxis ){

    var rotationMatrix = new Fullik.M3();

    var sinTheta         = Math.sin( rad );
    var cosTheta         = Math.cos( rad );
    var oneMinusCosTheta = 1.0 - cosTheta;
    
    // It's quicker to pre-calc these and reuse than calculate x * y, then y * x later (same thing).
    var xyOne = rotationAxis.x * rotationAxis.y * oneMinusCosTheta;
    var xzOne = rotationAxis.x * rotationAxis.z * oneMinusCosTheta;
    var yzOne = rotationAxis.y * rotationAxis.z * oneMinusCosTheta;

    var te = rotationMatrix.elements;
    
    // Calculate rotated x-axis
    te[0] = rotationAxis.x * rotationAxis.x * oneMinusCosTheta + cosTheta;
    te[3] = xyOne + rotationAxis.z * sinTheta;
    te[6] = xzOne - rotationAxis.y * sinTheta;

    // Calculate rotated y-axis
    te[1] = xyOne - rotationAxis.z * sinTheta;
    te[4] = rotationAxis.y * rotationAxis.y * oneMinusCosTheta + cosTheta;
    te[7] = yzOne + rotationAxis.x * sinTheta;

    // Calculate rotated z-axis
    te[2] = xzOne + rotationAxis.y * sinTheta;
    te[5] = yzOne - rotationAxis.x * sinTheta;
    te[8] = rotationAxis.z * rotationAxis.z * oneMinusCosTheta + cosTheta;

    // Multiply the source by the rotation matrix we just created to perform the rotation
    return rotationMatrix.timesV3( v );
};

// rotation

Fullik.rotateXDegs = function( v, angleDegs ){ return Fullik.rotateXRads( v, angleDegs * Fullik.torad ); };
Fullik.rotateYDegs = function( v, angleDegs ){ return Fullik.rotateYRads( v, angleDegs * Fullik.torad ); };
Fullik.rotateZDegs = function( v, angleDegs ){ return Fullik.rotateZRads( v, angleDegs * Fullik.torad ); };

Fullik.rotateXRads = function( v, rad ){ 
    var cosTheta = Math.cos( rad );
    var sinTheta = Math.sin( rad );
    return new Fullik.V3( v.x, v.y * cosTheta - v.z * sinTheta, v.y * sinTheta + v.z * cosTheta );
};

Fullik.rotateYRads = function( v, rad ){ 
    var cosTheta = Math.cos( rad );
    var sinTheta = Math.sin( rad );
    return new Fullik.V3( v.z * sinTheta + v.x * cosTheta, v.y, v.z * cosTheta - v.x * sinTheta );
};

Fullik.rotateZRads = function( v, rad ){ 
    var cosTheta = Math.cos( rad );
    var sinTheta = Math.sin( rad );
    return new Fullik.V3( v.x * cosTheta - v.y * sinTheta, v.x * sinTheta + v.y * cosTheta, v.z );
};


Fullik.getAngleLimitedUnitVectorDegs = function( vecToLimit, vecBaseline, angleLimitDegs ){

    // Get the angle between the two vectors
    // Note: This will ALWAYS be a positive value between 0 and 180 degrees.
    var angleBetweenVectorsDegs = Fullik.getAngleBetweenDegs( vecBaseline, vecToLimit );
    
    if ( angleBetweenVectorsDegs > angleLimitDegs ) {           
        // The axis which we need to rotate around is the one perpendicular to the two vectors - so we're
        // rotating around the vector which is the cross-product of our two vectors.
        // Note: We do not have to worry about both vectors being the same or pointing in opposite directions
        // because if they bones are the same direction they will not have an angle greater than the angle limit,
        // and if they point opposite directions we will approach but not quite reach the precise max angle
        // limit of 180.0f (I believe).
        var correctionAxis = Fullik.crossProduct( vecBaseline.normalised(), vecToLimit.normalised() ).normalize();
        
        // Our new vector is the baseline vector rotated by the max allowable angle about the correction axis
        return Fullik.rotateAboutAxisDegs( vecBaseline, angleLimitDegs, correctionAxis ).normalize();
    }
    else {// Angle not greater than limit? Just return a normalised version of the vecToLimit
    
        // This may already BE normalised, but we have no way of knowing without calcing the length, so best be safe and normalise.
        // TODO: If performance is an issue, then I could get the length, and if it's not approx. 1.0f THEN normalise otherwise just return as is.
        return vecToLimit.normalised();
    }


};

// distance

/*Fullik.withinManhattanDistance = function( v1, v2, distance ){
    if (Math.abs(v2.x - v1.x) > distance) return false; // Too far in x direction
    if (Math.abs(v2.y - v1.y) > distance) return false; // Too far in y direction
    if (Math.abs(v2.z - v1.z) > distance) return false; // Too far in z direction   
    return true;
};

Fullik.manhattanDistanceBetween = function( v1, v2 ){
    return Math.abs(v2.x - v1.x) + Math.abs(v2.x - v1.x) + Math.abs(v2.x - v1.x);
};*/

Fullik.distanceBetween = function( v1, v2 ){
    var d = v2.clone().sub(v1);
    //var dx = v2.x - v1.x;
    //var dy = v2.y - v1.y;
    //var dz = v2.z - v1.z;
    //return Math.sqrt( dx * dx + dy * dy + dz * dz );
    return Math.sqrt( d.x * d.x + d.y * d.y + d.z * d.z );
};





// -------------------------------
//
//      Matrix3 >> M3
//
// -------------------------------

Fullik.M3 = function(){
    THREE.Matrix3 .call( this );
}

Fullik.M3.prototype = Object.create( THREE.Matrix3.prototype );
Fullik.M3.prototype.constructor = Fullik.M3;

Fullik.M3.prototype.setV3 = function( vx, vy, vz ){

    var te = this.elements;
    te[0] = vx.x;  te[1] = vy.x; te[2] = vz.x;
    te[3] = vx.y;  te[4] = vy.y; te[5] = vz.y;
    te[6] = vx.z;  te[7] = vy.z; te[8] = vz.z;

    return this;

};

/*Fullik.M3.prototype.transpose = function( m ){

    var tm = m.elements;
    return new Fullik.M3().set( tm[0], tm[1], tm[2],  tm[3], tm[4], tm[5],  tm[6], tm[7], tm[8] );

};

Fullik.M3.prototype.zero = function(){

    var te = this.elements;
    te[0] = te[1] = te[2] = te[3] = te[4] = te[5] = te[6] = te[7] = te[8] = 0;

};

Fullik.M3.prototype.determinant = function(){

    var te = this.elements;
    return te[2] * te[3] * te[7] - te[2]  * te[6] * te[4] - te[1] * te[3] * te[8] + te[1] * te[6] * te[5] + te[0] * te[4] * te[8] - te[0] * te[7] * te[5];

};*/



/*Fullik.M3.prototype.timesM3 = function( m ){

    var temp = new Fullik.M3();

    var te = this.elements;
    var tt = temp.elements;
    var tm = m.elements;

    tt[0] = te[0] * tm[0] + te[1] * tm[3] + te[2] * tm[6];
    tt[3] = te[3] * tm[0] + te[4] * tm[3] + te[5] * tm[6];
    tt[6] = te[6] * tm[0] + te[7] * tm[3] + te[8] * tm[6];

    tt[1] = te[0] * tm[1] + te[1] * tm[4] + te[2] * tm[7];
    tt[4] = te[3] * tm[1] + te[4] * tm[4] + te[5] * tm[7];
    tt[7] = te[6] * tm[1] + te[7] * tm[4] + te[8] * tm[7];

    tt[2] = te[0] * tm[2] + te[1] * tm[5] + te[2] * tm[8];
    tt[5] = te[3] * tm[2] + te[4] * tm[5] + te[5] * tm[8];
    tt[8] = te[6] * tm[2] + te[7] * tm[5] + te[8] * tm[8];

    return temp;
};*/

Fullik.M3.prototype.timesV3 = function( v ){

    var te = this.clone().elements;

    //var te = this.elements;

    return new Fullik.V3(
        te[0] * v.x + te[1] * v.y + te[2] * v.z,
        te[3] * v.x + te[4] * v.y + te[5] * v.z,
        te[6] * v.x + te[7] * v.y + te[8] * v.z
    );

};

Fullik.M3.prototype.isOrthogonal = function(){
    var xCrossYDot = Fullik.dotProduct( this.getXBasis(), this.getYBasis() );
    var xCrossZDot = Fullik.dotProduct( this.getXBasis(), this.getZBasis() );
    var yCrossZDot = Fullik.dotProduct( this.getYBasis(), this.getZBasis() );
    
    if ( Fullik.nearEquals(xCrossYDot, 0,  0.01) && Fullik.nearEquals(xCrossZDot, 0,  0.01) && Fullik.nearEquals(yCrossZDot, 0,  0.01) ) return true;
    return false;
};


Fullik.M3.prototype.rotateDegs = function( angleDegs, localAxis ){
    return this.rotateRads( localAxis, angleDegs * Fullik.torad ); 
};

Fullik.M3.prototype.rotateRads = function( rotationAxis, rad ){

    var dest = new Fullik.M3();

    var sin         =  Math.sin( rad );
    var cos         =  Math.cos( rad );     
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

    var te = this.elements;

    var t00 = te[0] * f00 + te[1] * f01 + te[2] * f02;
    var t01 = te[3] * f00 + te[4] * f01 + te[5] * f02;
    var t02 = te[6] * f00 + te[7] * f01 + te[8] * f02;

    var t10 = te[0] * f10 + te[1] * f11 + te[2] * f12;
    var t11 = te[3] * f10 + te[4] * f11 + te[5] * f12;
    var t12 = te[6] * f10 + te[7] * f11 + te[8] * f12;

    // Construct and return rotation matrix
    var tx = dest.elements;
    tx[2] = te[0] * f20 + te[1] * f21 + te[2] * f22;
    tx[5] = te[3] * f20 + te[4] * f21 + te[5] * f22;
    tx[8] = te[6] * f20 + te[7] * f21 + te[8] * f22;

    tx[0] = t00;
    tx[3] = t01;
    tx[6] = t02;

    tx[1] = t10;
    tx[4] = t11;
    tx[7] = t12;

    return dest;

};



// get

Fullik.M3.prototype.getXBasis = function(){
    var te = this.elements;
    return new Fullik.V3( te[0], te[3], te[6] );
};
Fullik.M3.prototype.getYBasis = function(){
    var te = this.elements;
    return new Fullik.V3( te[1], te[4], te[7] );
};
Fullik.M3.prototype.getZBasis = function(){
    var te = this.elements;
    return new Fullik.V3( te[2], te[5], te[8] );
};

// set 

Fullik.M3.prototype.setXBasis = function( v ){
    var te = this.elements;
    te[0] = v.x; te[3] = v.y; te[6] = v.z;
};
Fullik.M3.prototype.setYBasis = function( v ){
    var te = this.elements;
    te[1] = v.x; te[4] = v.y; te[7] = v.z;
};
Fullik.M3.prototype.setZBasis = function( v ){
    var te = this.elements;
    te[2] = v.x; te[5] = v.y; te[8] = v.z;
};




/*Fullik.inverseM3 = function( m ){

    return new Fullik.M3().getInverse(m);

}*/


Fullik.createRotationMatrix = function( referenceDirection ){

    var xAxis;
    var yAxis;
    var zAxis = referenceDirection.normalised();
            
    // Handle the singularity (i.e. bone pointing along negative Z-Axis)...
    if( referenceDirection.z < -0.9999999 ){
        xAxis = new Fullik.V3(1, 0, 0); // ...in which case positive X runs directly to the right...
        yAxis = new Fullik.V3(0, 1, 0); // ...and positive Y runs directly upwards.
    } else {
        var a = 1/(1 + zAxis.z);
        var b = -zAxis.x * zAxis.y * a;           
        xAxis = new Fullik.V3( 1 - zAxis.x * zAxis.x * a, b, -zAxis.x ).normalize();
        yAxis = new Fullik.V3( b, 1 - zAxis.y * zAxis.y * a, -zAxis.y ).normalize();
    }
     
    return new Fullik.M3().setV3( xAxis, yAxis, zAxis );

};


Fullik.Joint = function(){

    this.mRotorConstraintDegs = Fullik.MAX_ANGLE_DEGS;
    this.mHingeClockwiseConstraintDegs = Fullik.MAX_ANGLE_DEGS;
    this.mHingeAnticlockwiseConstraintDegs = Fullik.MAX_ANGLE_DEGS;

    this.mRotationAxisUV = new Fullik.V3();
    this.mReferenceAxisUV = new Fullik.V3();
    this.type = Fullik.J_BALL;

}

Fullik.Joint.prototype = {

    constructor: Fullik.Joint,

    clone:function(){

        var j = new Fullik.Joint();
        j.mRotorConstraintDegs = this.mRotorConstraintDegs;
        j.mHingeClockwiseConstraintDegs = this.mHingeClockwiseConstraintDegs;
        j.mHingeAnticlockwiseConstraintDegs = this.mHingeAnticlockwiseConstraintDegs;
        j.type = this.type;
        j.mRotationAxisUV.copy( this.mRotationAxisUV );
        j.mReferenceAxisUV.copy( this.mReferenceAxisUV );

        return this;
    },

    validateAngle:function( angle ){

        if( angle < Fullik.MIN_ANGLE_DEGS ){ angle = Fullik.MIN_ANGLE_DEGS; console.log( '! min angle is '+ Fullik.MIN_ANGLE_DEGS ); }
        if( angle > Fullik.MAX_ANGLE_DEGS ){ angle = Fullik.MAX_ANGLE_DEGS; console.log( '! max angle is '+ Fullik.MAX_ANGLE_DEGS ); }

        return angle;

    },

    setAsBallJoint:function( constraintAngleDegs ){

        //this.validateConstraintAngleDegs(constraintAngleDegs);
        this.mRotorConstraintDegs = this.validateAngle( constraintAngleDegs );
        this.type = Fullik.J_BALL;
        
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
        if ( !(this.type === Fullik.J_BALL) ) return this.mHingeClockwiseConstraintDegs;
    },

    getHingeAnticlockwiseConstraintDegs:function(){
        if ( !(this.type === Fullik.J_BALL) ) return this.mHingeAnticlockwiseConstraintDegs;
    },

    getHingeReferenceAxis:function(){
        if ( !(this.type === Fullik.J_BALL) ) return this.mReferenceAxisUV; 
    },

    getHingeRotationAxis:function(){
        if ( !(this.type === Fullik.J_BALL) ) return this.mRotationAxisUV; 
    },

    getBallJointConstraintDegs:function(){
        if ( this.type === Fullik.J_BALL ) return this.mRotorConstraintDegs; 
    },

    // SET

    setAsGlobalHinge:function( globalRotationAxis, cwConstraintDegs, acwConstraintDegs, globalReferenceAxis ){
        this.setHinge( Fullik.J_GLOBAL_HINGE, globalRotationAxis, cwConstraintDegs, acwConstraintDegs, globalReferenceAxis );
    },

    setAsLocalHinge:function( localRotationAxis, cwConstraintDegs, acwConstraintDegs, localReferenceAxis ){
        this.setHinge( Fullik.J_LOCAL_HINGE, localRotationAxis, cwConstraintDegs, acwConstraintDegs, localReferenceAxis );
    },

    setBallJointConstraintDegs:function( angleDegs ){
        if ( this.type === Fullik.J_BALL ) this.mRotorConstraintDegs = this.validateAngle( angleDegs );
    },

    setHingeJointClockwiseConstraintDegs:function( angleDegs ){
        if ( !(this.type === Fullik.J_BALL) ) this.mHingeClockwiseConstraintDegs = this.validateAngle( angleDegs ); 
    },

    setHingeJointAnticlockwiseConstraintDegs:function( angleDegs ){
        if ( !(this.type === Fullik.J_BALL) ) this.mHingeAnticlockwiseConstraintDegs = this.validateAngle( angleDegs ); 
    },

    setHingeRotationAxis:function( axis ){
        if ( !(this.type === Fullik.J_BALL) ) this.mRotationAxisUV.copy( axis.normalised() ); 
    },

    setHingeReferenceAxis:function( referenceAxis ){
        if ( !(this.type === Fullik.J_BALL) ) this.mReferenceAxisUV.copy( referenceAxis.normalised() ); 
    },

    
    
}


Fullik.Bone = function( startLocation, endLocation, directionUV, length, color ){

    this.mJoint = new Fullik.Joint();
    this.mStartLocation = new Fullik.V3();
    this.mEndLocation = new Fullik.V3();
    
    this.mBoneConnectionPoint = 'end';
    this.mLength = 0;

    this.color = color || 0xFFFFFF;
    this.name = '';

    this.init( startLocation, endLocation, directionUV, length );

};

Fullik.Bone.prototype = {

    constructor: Fullik.Bone,

    init:function( startLocation, endLocation, directionUV, length ){

        this.setStartLocation( startLocation );
        if( endLocation !== undefined ){ 
            this.setEndLocation( endLocation );
            this.setLength( Fullik.distanceBetween( this.mStartLocation, this.mEndLocation ) );
        } else {
            this.setLength( length );
            this.setEndLocation( this.mStartLocation.plus( directionUV.normalised().times( length ) ) );
        }

    },

    clone:function(){
        var b = new Fullik.Bone( this.mStartLocation, this.mEndLocation );
        b.mJoint = this.mJoint.clone();
        return b;
    },

    length : function(){
        return this.mLength;
    },

    liveLength :function(){
        return Fullik.distanceBetween( this.mStartLocation, this.mEndLocation );
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

    getHingeJointClockwiseConstraintDegs : function(){
        return this.mJoint.getHingeClockwiseConstraintDegs();
    },

    
    getHingeJointAnticlockwiseConstraintDegs : function(){
        return this.mJoint.getHingeAnticlockwiseConstraintDegs();
    },

    
    getBallJointConstraintDegs : function(){
        return this.mJoint.getBallJointConstraintDegs();
    },

    getBoneConnectionPoint:function(){
        return this.mBoneConnectionPoint;
    },

    getDirectionUV:function(){
        return Fullik.getDirectionUV( this.mStartLocation, this.mEndLocation );
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

    

}


Fullik.Chain = function( color ){

    this.bones = [];
    this.name = '';

    this.mSolveDistanceThreshold = 0.1;
    this.mMaxIterationAttempts = 20;
    this.mMinIterationChange = 0.01;

    this.bonesLength = 0;
    this.mNumBones = 0;

    this.mFixedBaseLocation = new Fullik.V3();
    this.mFixedBaseMode = true;

    this.mBaseboneConstraintType = Fullik.BB_NONE;

    this.mBaseboneConstraintUV = new Fullik.V3();
    this.mBaseboneRelativeConstraintUV = new Fullik.V3();
    this.mBaseboneRelativeReferenceConstraintUV = new Fullik.V3();
    this.mLastTargetLocation = new Fullik.V3( Fullik.MAX_VALUE, Fullik.MAX_VALUE, Fullik.MAX_VALUE );

    this.mLastBaseLocation =  new Fullik.V3( Fullik.MAX_VALUE, Fullik.MAX_VALUE, Fullik.MAX_VALUE );
    this.mCurrentSolveDistance = Fullik.MAX_VALUE;
    this.mConnectedChainNumber = -1;
    this.mConnectedBoneNumber = -1;

    this.color = color || 0xFFFFFF;

}

Fullik.Chain.prototype = {

    constructor: Fullik.Chain,

    clone:function(){

        var c = new Fullik.Chain();

        c.bones = this.cloneIkChain();
        c.mFixedBaseLocation.copy( this.mFixedBaseLocation );
        c.mLastTargetLocation.copy( this.mLastTargetLocation );
        c.mLastBaseLocation.copy( this.mLastBaseLocation );
                
        // Copy the basebone constraint UV if there is one to copy
        if ( !(this.mBaseboneConstraintType === Fullik.BB_NONE) ){
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

    },

    addBone: function( bone ){

        bone.setColor( this.color );

        // Add the new bone to the end of the ArrayList of bones
        this.bones.push( bone );//.add( bone );

        // If this is the basebone...
        if ( this.mNumBones === 0 ){
            // ...then keep a copy of the fixed start location...
            this.mFixedBaseLocation.copy(bone.getStartLocation());//.clone();
            
            // ...and set the basebone constraint UV to be around the initial bone direction
            this.mBaseboneConstraintUV.copy(bone.getDirectionUV());
        }
        
        // Increment the number of bones in the chain and update the chain length
        this.mNumBones ++;
        this.updateChainLength();

    },

    removeBone:function( id ){
        if ( id < this.mNumBones ){   
            // ...then remove the bone, decrease the bone count and update the chain length.
            this.bones.splice(id, 1)
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
            this.addBone( new Fullik.Bone( prevBoneEnd, undefined, directionUV.normalised(), length ) );
        }

    },

    addConsecutiveFreelyRotatingHingedBone : function ( directionUV, length, type, hingeRotationAxis ){

        this.addConsecutiveHingedBone( directionUV, length, type, hingeRotationAxis, 180.0, 180.0, Fullik.genPerpendicularVectorQuick( hingeRotationAxis ) );

    },

    addConsecutiveHingedBone: function( directionUV, length, type, hingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis ){
        // Cannot add a consectuive bone of any kind if the there is no basebone
        if ( this.mNumBones === 0 ) return;

        // Normalise the direction and hinge rotation axis 
        directionUV = directionUV.normalised();
        hingeRotationAxis = hingeRotationAxis.normalised();
            
        // Get the end location of the last bone, which will be used as the start location of the new bone
        var prevBoneEnd = this.bones[this.mNumBones-1].getEndLocation();//.clone();
            
        // Create a bone
        var bone = new Fullik.Bone( prevBoneEnd, undefined, directionUV, length, this.color );

        type = type || 'global';
        
        // ...then create and set up a joint which we'll apply to that bone.
        var joint = new Fullik.Joint();
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
        // then add it to the chain. Note: The default joint type of a new FullikBone3D is Fullik.J_BALL.
        boneDirectionUV = boneDirectionUV.normalised();
        var bone = new Fullik.Bone( this.bones[ this.mNumBones-1 ].getEndLocation(), undefined , boneDirectionUV, length );
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
        if ( !(this.mBaseboneConstraintType === Fullik.BB_NONE) ) return this.mBaseboneConstraintUV;
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
        if (angleDegs < 0  ) angleDegs = 0;                                                                                                  
        if (angleDegs > 180) angleDegs = 180;                                                                                                    
        //if ( !(rotorType === Fullik.BB_GLOBAL_ROTOR || rotorType === Fullik.BB_LOCAL_ROTOR) ) return;//throw new IllegalArgumentException("The only valid rotor types for this method are GLOBAL_ROTOR and LOCAL_ROTOR.");
        type = type || 'global';       
        // Set the constraint type, axis and angle
        this.mBaseboneConstraintType = type === 'global' ? Fullik.BB_GLOBAL_ROTOR : Fullik.BB_LOCAL_ROTOR;
        this.mBaseboneConstraintUV   = constraintAxis.normalised();
        this.mBaseboneRelativeConstraintUV.copy( this.mBaseboneConstraintUV );
        this.getBone(0).getJoint().setAsBallJoint( angleDegs );

        //console.log('base bone is rotor');

    },

    setHingeBaseboneConstraint : function( type, hingeRotationAxis, cwConstraintDegs, acwConstraintDegs, hingeReferenceAxis ){

        // Sanity checking
        if ( this.mNumBones === 0)  return;// throw new RuntimeException("Chain must contain a basebone before we can specify the basebone constraint type.");       
        if ( !( hingeRotationAxis.length() > 0) ) return;// throw new IllegalArgumentException("Hinge rotation axis cannot be zero.");            
        if ( !( hingeReferenceAxis.length() > 0) ) return;// throw new IllegalArgumentException("Hinge reference axis cannot be zero.");            
       // if ( !( Fullik.perpendicular( hingeRotationAxis, hingeReferenceAxis ) ) ) return;// throw new IllegalArgumentException("The hinge reference axis must be in the plane of the hinge rotation axis, that is, they must be perpendicular."); 
        //if ( !(hingeType === Fullik.BB_GLOBAL_HINGE || hingeType === Fullik.BB_LOCAL_HINGE) ) return;//throw new IllegalArgumentException("The only valid hinge types for this method are GLOBAL_HINGE and LOCAL_HINGE.");
        
        type = type || 'global';  

        // Set the constraint type, axis and angle
        this.mBaseboneConstraintType = type === 'global' ? Fullik.BB_GLOBAL_HINGE : Fullik.BB_LOCAL_HINGE;
        this.mBaseboneConstraintUV.copy( hingeRotationAxis.normalised() );
        
        //var hinge = this.getBone(0).getJoint();//new Fullik.Joint();
        
        if ( type === 'global' ) this.getBone(0).getJoint().setHinge( Fullik.J_GLOBAL_HINGE, hingeRotationAxis, cwConstraintDegs, acwConstraintDegs, hingeReferenceAxis );
        else this.getBone(0).getJoint().setHinge( Fullik.J_LOCAL_HINGE, hingeRotationAxis, cwConstraintDegs, acwConstraintDegs, hingeReferenceAxis );
        
        //this.getBone(0).setJoint( hinge );

        //console.log('base bone is hinge');

    },

    setFreelyRotatingGlobalHingedBasebone : function( hingeRotationAxis ){

        this.setHingeBaseboneConstraint( Fullik.BB_GLOBAL_HINGE, hingeRotationAxis, 180, 180, Fullik.genPerpendicularVectorQuick( hingeRotationAxis ) );
    },

    setFreelyRotatingLocalHingedBasebone : function( hingeRotationAxis ){

        this.setHingeBaseboneConstraint( Fullik.BB_LOCAL_HINGE, hingeRotationAxis, 180, 180, Fullik.genPerpendicularVectorQuick( hingeRotationAxis ) );
    },

    setLocalHingedBasebone : function( hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis ){

        this.setHingeBaseboneConstraint( Fullik.BB_LOCAL_HINGE, hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );
    },

    setGlobalHingedBasebone : function( hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis ){

        this.setHingeBaseboneConstraint( Fullik.BB_GLOBAL_HINGE, hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );
    },

    setBaseboneConstraintUV : function( constraintUV ){

        if ( this.mBaseboneConstraintType === Fullik.BB_NONE ) return;

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
        if ( this.mBaseboneConstraintType === Fullik.BB_GLOBAL_ROTOR && !value ) return;
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
        this.mLastBaseLocation = new Fullik.V3( Fullik.MAX_VALUE, Fullik.MAX_VALUE, Fullik.MAX_VALUE );
        this.mCurrentSolveDistance = Fullik.MAX_VALUE;
    },


    // Method to solve this IK chain for the given target location.
    // The end result of running this method is that the IK chain configuration is updated.

    // To minimuse CPU usage, this method dynamically aborts if:
    // - The solve distance (i.e. distance between the end effector and the target) is below the mSolveDistanceThreshold,
    // - A solution incrementally improves on the previous solution by less than the mMinIterationChange, or
    // - The number of attempts to solve the IK chain exceeds the mMaxIterationAttempts.

    updateTarget : function( t ){

        var newTarget = new Fullik.V3( t.x, t.y, t.z );//.copy(t);//( newTarget.x, newTarget.y, newTarget.z );
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
        var bestSolveDistance = Fullik.MAX_VALUE;
        
        // We'll also keep track of the solve distance from the last pass
        var lastPassSolveDistance = Fullik.MAX_VALUE;
        
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
                if ( solveDistance < this.mSolveDistanceThreshold ) break;
                
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
            if ( i != this.mNumBones - 1 ) {
                // Get the outer-to-inner unit vector of the bone further out
                var outerBoneOuterToInnerUV = this.bones[ i+1 ].getDirectionUV().negated();

                // Get the outer-to-inner unit vector of this bone
                var boneOuterToInnerUV = bone.getDirectionUV().negated();
                
                // Get the joint type for this bone and handle constraints on boneInnerToOuterUV
                
                if ( jointType === Fullik.J_BALL ) { 

                    // Constrain to relative angle between this bone and the outer bone if required
                    var angleBetweenDegs    = Fullik.getAngleBetweenDegs( outerBoneOuterToInnerUV, boneOuterToInnerUV );
                    var constraintAngleDegs = joint.getBallJointConstraintDegs();
                    if ( angleBetweenDegs > constraintAngleDegs ){   
                        boneOuterToInnerUV = Fullik.getAngleLimitedUnitVectorDegs( boneOuterToInnerUV, outerBoneOuterToInnerUV, constraintAngleDegs );
                    }
                }
                else if ( jointType === Fullik.J_GLOBAL_HINGE ) {  

                    // Project this bone outer-to-inner direction onto the hinge rotation axis
                    // Note: The returned vector is normalised.
                    boneOuterToInnerUV = boneOuterToInnerUV.projectOnPlane( joint.getHingeRotationAxis() ).normalize(); 
                    
                    // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
                }
                else if ( jointType === Fullik.J_LOCAL_HINGE ) {   
                    // Not a basebone? Then construct a rotation matrix based on the previous bones inner-to-to-inner direction...
                    var m; // M3
                    var relativeHingeRotationAxis; // V3
                    if ( i > 0 ) {
                        m = Fullik.createRotationMatrix( this.bones[i-1].getDirectionUV() );
                        relativeHingeRotationAxis = m.timesV3( joint.getHingeRotationAxis() ).normalize();
                    } else {// ...basebone? Need to construct matrix from the relative constraint UV.
                        relativeHingeRotationAxis = this.mBaseboneRelativeConstraintUV.clone();
                    }
                    
                    // ...and transform the hinge rotation axis into the previous bones frame of reference.
                                        
                    // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                    // Note: The returned vector is normalised.                 
                    boneOuterToInnerUV = boneOuterToInnerUV.projectOnPlane( relativeHingeRotationAxis ).normalize();
                                        
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
                    case Fullik.J_BALL:
                        // Ball joints do not get constrained on this forward pass
                        break;                      
                    case Fullik.J_GLOBAL_HINGE:
                        // Global hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane
                        boneOuterToInnerUV = boneOuterToInnerUV.projectOnPlane( joint.getHingeRotationAxis() ).normalize();
                        break;
                    case Fullik.J_LOCAL_HINGE:
                        // Local hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane
                        
                        // Construct a rotation matrix based on the previous bones inner-to-to-inner direction...
                        var m = Fullik.createRotationMatrix( this.bones[i-1].getDirectionUV() );
                        
                        // ...and transform the hinge rotation axis into the previous bones frame of reference.
                        var relativeHingeRotationAxis = m.timesV3( joint.getHingeRotationAxis() ).normalize();
                                            
                        // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                        // Note: The returned vector is normalised.                 
                        boneOuterToInnerUV = boneOuterToInnerUV.projectOnPlane( relativeHingeRotationAxis ).normalize();
                        break;
                }
                                                
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

                if ( jointType === Fullik.J_BALL ){                   
                    var angleBetweenDegs    = Fullik.getAngleBetweenDegs( prevBoneInnerToOuterUV, boneInnerToOuterUV );
                    var constraintAngleDegs = joint.getBallJointConstraintDegs(); 
                    
                    // Keep this bone direction constrained within the rotor about the previous bone direction
                    if (angleBetweenDegs > constraintAngleDegs){
                        boneInnerToOuterUV = Fullik.getAngleLimitedUnitVectorDegs( boneInnerToOuterUV, prevBoneInnerToOuterUV, constraintAngleDegs );
                    }
                }
                else if ( jointType === Fullik.J_GLOBAL_HINGE ) {                   
                    // Get the hinge rotation axis and project our inner-to-outer UV onto it
                    var hingeRotationAxis  = joint.getHingeRotationAxis();
                    boneInnerToOuterUV = boneInnerToOuterUV.projectOnPlane(hingeRotationAxis).normalize();
                    
                    // If there are joint constraints, then we must honour them...
                    var cwConstraintDegs   = -joint.getHingeClockwiseConstraintDegs();
                    var acwConstraintDegs  =  joint.getHingeAnticlockwiseConstraintDegs();

                    if ( !( Fullik.nearEquals( cwConstraintDegs, -Fullik.MAX_ANGLE_DEGS, Fullik.PRECISION ) ) && !( Fullik.nearEquals( acwConstraintDegs, Fullik.MAX_ANGLE_DEGS, Fullik.PRECISION ) ) ) {

                        var hingeReferenceAxis =  joint.getHingeReferenceAxis();
                        
                        // Get the signed angle (about the hinge rotation axis) between the hinge reference axis and the hinge-rotation aligned bone UV
                        // Note: ACW rotation is positive, CW rotation is negative.
                        var signedAngleDegs = Fullik.getSignedAngleBetweenDegs( hingeReferenceAxis, boneInnerToOuterUV, hingeRotationAxis );
                        
                        // Make our bone inner-to-outer UV the hinge reference axis rotated by its maximum clockwise or anticlockwise rotation as required
                        if (signedAngleDegs > acwConstraintDegs) boneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, acwConstraintDegs, hingeRotationAxis ).normalised();
                        else if (signedAngleDegs < cwConstraintDegs) boneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, cwConstraintDegs, hingeRotationAxis ).normalised();
                        
                    }
                }
                else if ( jointType === Fullik.J_LOCAL_HINGE ){   
                    // Transform the hinge rotation axis to be relative to the previous bone in the chain
                    var hingeRotationAxis  = joint.getHingeRotationAxis();
                    
                    // Construct a rotation matrix based on the previous bone's direction
                    var m = Fullik.createRotationMatrix( prevBoneInnerToOuterUV );
                    
                    // Transform the hinge rotation axis into the previous bone's frame of reference
                    var relativeHingeRotationAxis  = m.timesV3( hingeRotationAxis ).normalize();
                    
                    
                    // Project this bone direction onto the plane described by the hinge rotation axis
                    // Note: The returned vector is normalised.
                    boneInnerToOuterUV = boneInnerToOuterUV.projectOnPlane( relativeHingeRotationAxis ).normalize();
                    
                    // Constrain rotation about reference axis if required
                    var cwConstraintDegs  = -joint.getHingeClockwiseConstraintDegs();
                    var acwConstraintDegs =  joint.getHingeAnticlockwiseConstraintDegs();
                    if ( !( Fullik.nearEquals( cwConstraintDegs, -Fullik.MAX_ANGLE_DEGS, Fullik.PRECISION ) ) && !( Fullik.nearEquals( acwConstraintDegs, Fullik.MAX_ANGLE_DEGS, Fullik.PRECISION ) ) ) {

                        // Calc. the reference axis in local space
                        //Vec3f relativeHingeReferenceAxis = mBaseboneRelativeReferenceConstraintUV;//m.times( joint.getHingeReferenceAxis() ).normalise();
                        var relativeHingeReferenceAxis = m.timesV3( joint.getHingeReferenceAxis() ).normalize();
                        
                        // Get the signed angle (about the hinge rotation axis) between the hinge reference axis and the hinge-rotation aligned bone UV
                        // Note: ACW rotation is positive, CW rotation is negative.
                        var signedAngleDegs = Fullik.getSignedAngleBetweenDegs( relativeHingeReferenceAxis, boneInnerToOuterUV, relativeHingeRotationAxis );
                        
                        // Make our bone inner-to-outer UV the hinge reference axis rotated by its maximum clockwise or anticlockwise rotation as required
                        if (signedAngleDegs > acwConstraintDegs) boneInnerToOuterUV = Fullik.rotateAboutAxisDegs( relativeHingeReferenceAxis, acwConstraintDegs, relativeHingeRotationAxis ).normalize();
                        else if (signedAngleDegs < cwConstraintDegs) boneInnerToOuterUV = Fullik.rotateAboutAxisDegs( relativeHingeReferenceAxis, cwConstraintDegs, relativeHingeRotationAxis ).normalize();                            
                        
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
                if ( this.mBaseboneConstraintType === Fullik.BB_NONE ) {
                    // Set the new end location of this bone, and if there are more bones,
                    // then set the start location of the next bone to be the end location of this bone
                    var newEndLocation = bone.getStartLocation().plus( bone.getDirectionUV().times( lng ) );
                    bone.setEndLocation( newEndLocation );    
                    
                    if ( this.mNumBones > 1 ) { this.bones[1].setStartLocation( newEndLocation ); }
                } else {// ...otherwise we must constrain it to the basebone constraint unit vector
                  
                    if ( this.mBaseboneConstraintType === Fullik.BB_GLOBAL_ROTOR ){   
                        // Get the inner-to-outer direction of this bone
                        var boneInnerToOuterUV = bone.getDirectionUV();
                                
                        var angleBetweenDegs    = Fullik.getAngleBetweenDegs( this.mBaseboneConstraintUV, boneInnerToOuterUV );
                        var constraintAngleDegs = bone.getBallJointConstraintDegs(); 
                    
                        if ( angleBetweenDegs > constraintAngleDegs ){
                            boneInnerToOuterUV = Fullik.getAngleLimitedUnitVectorDegs( boneInnerToOuterUV, this.mBaseboneConstraintUV, constraintAngleDegs );
                        }
                        
                        var newEndLocation = bone.getStartLocation().plus( boneInnerToOuterUV.times( lng ) );
                        
                        bone.setEndLocation( newEndLocation );
                        
                        // Also, set the start location of the next bone to be the end location of this bone
                        if ( this.mNumBones > 1 ) { this.bones[1].setStartLocation( newEndLocation ); }
                    }
                    else if ( this.mBaseboneConstraintType === Fullik.BB_LOCAL_ROTOR ){
                        // Note: The mBaseboneRelativeConstraintUV is updated in the Fullik.Structure.updateTarget()
                        // method BEFORE this Fullik.Chain.updateTarget() method is called. We no knowledge of the
                        // direction of the bone we're connected to in another chain and so cannot calculate this 
                        // relative basebone constraint direction on our own, but the Fullik.Structure does it for
                        // us so we are now free to use it here.
                        
                        // Get the inner-to-outer direction of this bone
                        var boneInnerToOuterUV = bone.getDirectionUV();
                                
                        // Constrain about the relative basebone constraint unit vector as neccessary
                        var angleBetweenDegs    = Fullik.getAngleBetweenDegs( this.mBaseboneRelativeConstraintUV, boneInnerToOuterUV);
                        var constraintAngleDegs = bone.getBallJointConstraintDegs();
                        if ( angleBetweenDegs > constraintAngleDegs ){
                            boneInnerToOuterUV = Fullik.getAngleLimitedUnitVectorDegs(boneInnerToOuterUV, this.mBaseboneRelativeConstraintUV, constraintAngleDegs);
                        }
                        
                        // Set the end location
                        var newEndLocation = bone.getStartLocation().plus( boneInnerToOuterUV.times( lng ) );                        
                        bone.setEndLocation( newEndLocation );
                        
                        // Also, set the start location of the next bone to be the end location of this bone
                        if ( this.mNumBones > 1 ) { this.bones[1].setStartLocation(newEndLocation); }

                    } else if ( this.mBaseboneConstraintType === Fullik.BB_GLOBAL_HINGE ) {

                        joint = bone.getJoint();
                        var hingeRotationAxis  =  joint.getHingeRotationAxis();
                        var cwConstraintDegs   = - joint.getHingeClockwiseConstraintDegs(); // Clockwise rotation is negative!
                        var acwConstraintDegs  =  joint.getHingeAnticlockwiseConstraintDegs();
                        
                        // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
                        var boneInnerToOuterUV = bone.getDirectionUV().projectOnPlane( hingeRotationAxis ).normalize();
                                
                        // If we have a global hinge which is not freely rotating then we must constrain about the reference axis
                        if ( !( Fullik.nearEquals( cwConstraintDegs, Fullik.MAX_ANGLE_DEGS, Fullik.PRECISION_DEG ) ) && !( Fullik.nearEquals( acwConstraintDegs, Fullik.MAX_ANGLE_DEGS, Fullik.PRECISION_DEG ) ) ) {

                            // Grab the hinge reference axis and calculate the current signed angle between it and our bone direction (about the hinge
                            // rotation axis). Note: ACW rotation is positive, CW rotation is negative.
                            var hingeReferenceAxis = joint.getHingeReferenceAxis();
                            var signedAngleDegs    = Fullik.getSignedAngleBetweenDegs(hingeReferenceAxis, boneInnerToOuterUV, hingeRotationAxis);
                            
                            // Constrain as necessary
                            if (signedAngleDegs > acwConstraintDegs) boneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, acwConstraintDegs, hingeRotationAxis ).normalize();
                            else if (signedAngleDegs < cwConstraintDegs) boneInnerToOuterUV = Fullik.rotateAboutAxisDegs(hingeReferenceAxis, cwConstraintDegs, hingeRotationAxis).normalize();                            
                            
                        }
                        
                        // Calc and set the end location of this bone
                        var newEndLocation = bone.getStartLocation().plus( boneInnerToOuterUV.times( lng ) );                        
                        bone.setEndLocation( newEndLocation );
                        
                        // Also, set the start location of the next bone to be the end location of this bone
                        if ( this.mNumBones > 1 ) { this.bones[1].setStartLocation(newEndLocation); }

                    } else if ( this.mBaseboneConstraintType === Fullik.BB_LOCAL_HINGE ){

                        joint = bone.getJoint();
                        var hingeRotationAxis  =  this.mBaseboneRelativeConstraintUV;          // Basebone relative constraint is our hinge rotation axis!
                        var cwConstraintDegs   = - joint.getHingeClockwiseConstraintDegs();    // Clockwise rotation is negative!
                        var acwConstraintDegs  =  joint.getHingeAnticlockwiseConstraintDegs();
                        
                        // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
                        var boneInnerToOuterUV = bone.getDirectionUV().projectOnPlane(hingeRotationAxis);//.normalize();
                        
                        //If we have a local hinge which is not freely rotating then we must constrain about the reference axis
                        if ( !( Fullik.nearEquals( cwConstraintDegs, Fullik.MAX_ANGLE_DEGS, Fullik.PRECISION_DEG ) ) && !( Fullik.nearEquals( acwConstraintDegs, Fullik.MAX_ANGLE_DEGS, Fullik.PRECISION_DEG ) ) ) {
        
                            // Grab the hinge reference axis and calculate the current signed angle between it and our bone direction (about the hinge
                            // rotation axis). Note: ACW rotation is positive, CW rotation is negative.
                            var hingeReferenceAxis = this.mBaseboneRelativeReferenceConstraintUV; //joint.getHingeReferenceAxis();
                            var signedAngleDegs    = Fullik.getSignedAngleBetweenDegs( hingeReferenceAxis, boneInnerToOuterUV, hingeRotationAxis );
                            
                            // Constrain as necessary
                            if ( signedAngleDegs > acwConstraintDegs ) boneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, acwConstraintDegs, hingeRotationAxis ).normalize();
                            else if (signedAngleDegs < cwConstraintDegs) boneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, cwConstraintDegs, hingeRotationAxis ).normalize();   

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
        return Fullik.distanceBetween( this.bones[this.mNumBones-1].getEndLocation(), target );
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
            // Use the copy constructor to create a new Fullik.Bone with the values set from the source Fullik.Bone.
            // and add it to the cloned chain.
            clonedChain.push( this.bones[i].clone() );
        }
        
        return clonedChain;

    }


// end

}

Fullik.Structure = function( scene ){

    this.chains = [];
    this.meshChains = [];
    this.targets = [];
    this.mNumChains = 0;

    this.scene = scene;

    this.isWithMesh = false;

}

Fullik.Structure.prototype = {

    constructor: Fullik.Structure,

    update:function(){

        var c, m, b, t;
        var connectedChainNumber;
        var hostChain, hostBone, constraintType;

        //var i =  this.mNumChains;

        //while(i--){

        for(var i = 0; i< this.mNumChains ; i++){

            c = this.chains[i];
            m = this.meshChains[i];
            t = this.targets[i];

            connectedChainNumber = c.getConnectedChainNumber();

            //this.chains[0].updateTarget( this.targets[0] );

            if (connectedChainNumber === -1) c.updateTarget( t );
            else{
                hostChain = this.chains[connectedChainNumber];
                hostBone  = hostChain.getBone( c.getConnectedBoneNumber() );
                if( hostBone.getBoneConnectionPoint() === 'start' ) c.setBaseLocation( hostBone.getStartLocation() );
                else c.setBaseLocation( hostBone.getEndLocation() );

                constraintType = c.getBaseboneConstraintType();
                switch (constraintType){
                    case Fullik.BB_NONE:         // Nothing to do because there's no basebone constraint
                    case Fullik.BB_GLOBAL_ROTOR: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                    case Fullik.BB_GLOBAL_HINGE: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                        break;
                        
                    // If we have a local rotor or hinge constraint then we must calculate the relative basebone constraint before calling updateTarget
                    case Fullik.BB_LOCAL_ROTOR:
                    case Fullik.BB_LOCAL_HINGE:

                    var connectionBoneMatrix = Fullik.createRotationMatrix( hostBone.getDirectionUV() );
                        
                    // We'll then get the basebone constraint UV and multiply it by the rotation matrix of the connected bone 
                    // to make the basebone constraint UV relative to the direction of bone it's connected to.
                    var relativeBaseboneConstraintUV = connectionBoneMatrix.timesV3( c.getBaseboneConstraintUV() ).normalize();
                            
                    // Update our basebone relative constraint UV property
                    c.setBaseboneRelativeConstraintUV( relativeBaseboneConstraintUV );
                        
                        // Updat the relative reference constraint UV if we hav a local hinge
                    if (constraintType === Fullik.BB_LOCAL_HINGE)
                        c.setBaseboneRelativeReferenceConstraintUV( connectionBoneMatrix.timesV3( c.getBone(0).getJoint().getHingeReferenceAxis() ) );
                        
                    break;

                }

                
                c.resetTarget();//
                //hostChain.updateTarget( this.targets[connectedChainNumber] );

                c.updateTarget( t );


            }

            // update 3d mesh

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

        var i, j;

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

        if( meshBone ) this.addChainMeshs( chain );; 

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
        g.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) )
        g.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, size*0.5 ) );
        var m = new THREE.MeshStandardMaterial();
        m.color.setHex( color );

        var m2 = new THREE.MeshBasicMaterial({ wireframe : true });

        var extraMesh;
        var extraGeo;

        var type = bone.getJoint().type;
        switch(type){
            case Fullik.J_BALL :
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
            case Fullik.J_GLOBAL_HINGE :
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * Fullik.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * Fullik.torad;
            var r = 2;
            m2.color.setHex(0xFFFF00);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case Fullik.J_LOCAL_HINGE :
            var r = 2;
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * Fullik.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * Fullik.torad;
            m2.color.setHex(0x00FFFF);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
        }




        var b = new THREE.Mesh( g,  m );
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

}

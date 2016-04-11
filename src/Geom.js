

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
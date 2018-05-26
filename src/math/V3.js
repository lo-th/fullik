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

export { V3 };


export class V2 {

    constructor( x = 0, y = 0 ) {

    	this.isVector2 = true;
	    this.x = x;
	    this.y = y;
	    
	}

	set( x, y ){

	    this.x = x || 0;
	    this.y = y || 0;
	    return this;

	}

	distanceTo( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	}

	distanceToSquared( v ) {

		let dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	}

	multiplyScalar( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		return this;

	}

	divideScalar( scalar ) {

		return this.multiplyScalar( 1 / scalar );

	}

	length() {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	}

	normalize() {

		return this.divideScalar( this.length() || 1 );

	}

	normalised() {

	    return new this.constructor( this.x, this.y ).normalize();
	
	}

	lengthSq() {

		return this.x * this.x + this.y * this.y;

	}

	add( v ) {

		this.x += v.x;
		this.y += v.y;
	    return this;

	}

	plus( v ) {

	    return new this.constructor( this.x + v.x, this.y + v.y );

	}

	min( v ) {

		this.x -= v.x;
		this.y -= v.y;
	    return this;

	}

	minus( v ) {

	    return new V2( this.x - v.x, this.y - v.y );

	}

	divideBy( value ) {

	    return new this.constructor( this.x, this.y ).divideScalar( value );
	
	}

	dot( a, b ) {

		return this.x * a.x + this.y * a.y;

	}

	negate() { 

	    this.x = -this.x;
	    this.y = -this.y;
	    return this;

	}

	negated() { 

	    return new this.constructor( -this.x, -this.y );

	}

	clone (){

	    return new this.constructor( this.x, this.y );

	}

	copy( v ) {

	    this.x = v.x;
	    this.y = v.y;
	    return this;

	}

	cross( v ) {

	    return this.x * v.y - this.y * v.x;

	}

	sign( v ) {

		let s = this.cross( v );
		return s >= 0 ? 1 : -1;

	}

	approximatelyEquals( v, t ) {

	    if ( t < 0 ) return false;
	    let xDiff = Math.abs(this.x - v.x);
	    let yDiff = Math.abs(this.y - v.y);
	    return ( xDiff < t && yDiff < t );

	}

	rotate( angle ) {

		let cos = Math.cos( angle );
		let sin = Math.sin( angle );
		let x = this.x * cos - this.y * sin;
		let y = this.x * sin + this.y * cos;
		this.x = x;
		this.y = y;
		return this;

	}

	angleTo( v ) {

		let a = this.dot(v) / (Math.sqrt( this.lengthSq() * v.lengthSq() ));
		if(a <= -1) return Math.PI;
		if(a >= 1) return 0;
		return Math.acos( a );

	}

	getSignedAngle( v ) {

		let a = this.angleTo( v );
		let s = this.sign( v );
		return s === 1 ? a : -a;
		
	}

	constrainedUV( baselineUV, min, max ) {

        let angle = baselineUV.getSignedAngle( this );
        if( angle > max ) this.copy( baselineUV ).rotate(max);
        if( angle < min ) this.copy( baselineUV ).rotate(min);
        return this;

    }

}
import { V3 } from './V3.js';

export class M3 {

    constructor() {

		this.isMatrix3 = true;

		this.elements = [

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		];

		if ( arguments.length > 0 ) {

			console.error( 'M3: the constructor no longer reads arguments. use .set() instead.' );

		}

	}

	set( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

		let te = this.elements;

		te[ 0 ] = n11; te[ 1 ] = n21; te[ 2 ] = n31;
		te[ 3 ] = n12; te[ 4 ] = n22; te[ 5 ] = n32;
		te[ 6 ] = n13; te[ 7 ] = n23; te[ 8 ] = n33;

		return this;

	}

	identity() {

		this.set(

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		);

		return this;

	}

	setV3( xAxis, yAxis, zAxis ) {

		const te = this.elements;

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

	}

	transpose() {

		let tmp, m = this.elements;

		tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
		tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
		tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

		return this;

	}

	createRotationMatrix( referenceDirection ) {
  
	    /*let zAxis = referenceDirection;//normalised();
	    let xAxis = new V3(1, 0, 0);
	    let yAxis = new V3(0, 1, 0);
	            
	    // Handle the singularity (i.e. bone pointing along negative Z-Axis)...
	    if( referenceDirection.z < -0.9999999 ){
	        xAxis.set(1, 0, 0); // ...in which case positive X runs directly to the right...
	        yAxis.set(0, 1, 0); // ...and positive Y runs directly upwards.
	    } else {
	        let a = 1/(1 + zAxis.z);
	        let b = -zAxis.x * zAxis.y * a;           
	        xAxis.set( 1 - zAxis.x * zAxis.x * a, b, -zAxis.x ).normalize();
	        yAxis.set( b, 1 - zAxis.y * zAxis.y * a, -zAxis.y ).normalize();
	    }

	    return this.setV3( xAxis, yAxis, zAxis );

	    */

	    // NEW VERSION - 1.3.8

		let zAxis = referenceDirection;
	    let xAxis = new V3(1, 0, 0);
	    let yAxis = new V3(0, 1, 0);
		
		// Singularity fix
		if ( Math.abs( referenceDirection.y ) > 0.9999 ){

			
			yAxis.copy( xAxis ).cross( zAxis ).normalize();

		} else {

			xAxis.copy( zAxis ).cross( yAxis ).normalize();
			yAxis.copy( xAxis ).cross( zAxis ).normalize();

		}

	    return this.setV3( xAxis, yAxis, zAxis );

	}

	rotateAboutAxis( v, angle, rotationAxis ){

	    let sinTheta = Math.sin( angle );
	    let cosTheta = Math.cos( angle );
	    let oneMinusCosTheta = 1.0 - cosTheta;
	    
	    // It's quicker to pre-calc these and reuse than calculate x * y, then y * x later (same thing).
	    let xyOne = rotationAxis.x * rotationAxis.y * oneMinusCosTheta;
	    let xzOne = rotationAxis.x * rotationAxis.z * oneMinusCosTheta;
	    let yzOne = rotationAxis.y * rotationAxis.z * oneMinusCosTheta;

	    let te = this.elements;

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

	}

}
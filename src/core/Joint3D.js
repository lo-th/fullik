import { V3 } from '../math/V3.js';
import { math } from '../math/Math.js';
import { J_BALL, J_GLOBAL, J_LOCAL } from '../constants.js';


export class Joint3D {

    constructor() {

        this.isJoint3D = true;

        this.rotor = math.PI;
        this.min = -math.PI;
        this.max = math.PI;

        this.freeHinge = true;

        this.rotationAxisUV = new V3();
        this.referenceAxisUV = new V3();
        this.type = J_BALL;

    }

    clone() {

        let j = new this.constructor();
        j.type = this.type;
        j.rotor = this.rotor;
        j.max = this.max;
        j.min = this.min;
        j.freeHinge = this.freeHinge;
        j.rotationAxisUV.copy( this.rotationAxisUV );
        j.referenceAxisUV.copy( this.referenceAxisUV );

        return j

    }

    testAngle() {

        if( this.max === math.PI && this.min === -math.PI ) this.freeHinge = true;
        else this.freeHinge = false;

    }

    validateAngle( a ) {

        a = a < 0 ? 0 : a;
        a = a > 180 ? 180 : a;
        return a;

    }

    setAsBallJoint( angle ) {

        this.rotor = this.validateAngle( angle ) * math.toRad;
        this.type = J_BALL;
        
    }

    // Specify this joint to be a hinge with the provided settings

    setHinge( type, rotationAxis, clockwise, anticlockwise, referenceAxis ) {

        this.type = type;
        if( clockwise < 0 ) clockwise *= -1;
        this.min = -this.validateAngle( clockwise ) * math.toRad;
        this.max = this.validateAngle( anticlockwise ) * math.toRad;

        this.testAngle();

        this.rotationAxisUV.copy( rotationAxis ).normalize();
        this.referenceAxisUV.copy( referenceAxis ).normalize();

    }

    // GET

    getHingeReferenceAxis() {

        return this.referenceAxisUV; 

    }

    getHingeRotationAxis() {

        return this.rotationAxisUV; 

    }

    // SET

    setBallJointConstraintDegs( angle ) {

        this.rotor = this.validateAngle( angle ) * math.toRad;

    }

    setHingeClockwise( angle ) {

        if( angle < 0 ) angle *= -1;
        this.min = -this.validateAngle( angle ) * math.toRad;
        this.testAngle();

    }

    setHingeAnticlockwise( angle ) {

        this.max = this.validateAngle( angle ) * math.toRad;
        this.testAngle();

    }

    /*setHingeRotationAxis: function ( axis ) {

        this.rotationAxisUV.copy( axis ).normalize();

    },

    setHingeReferenceAxis: function ( referenceAxis ) {

        this.referenceAxisUV.copy( referenceAxis ).normalize(); 

    },*/

    
    
}
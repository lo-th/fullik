import { V3 } from '../math/V3.js';
import { J_BALL, J_GLOBAL, J_LOCAL, PI, TORAD } from '../constants.js';

function Joint3D(){

    this.rotor = PI;
    this.min = -PI;
    this.max = PI;

    this.freeHinge = true;

    this.rotationAxisUV = new V3();
    this.referenceAxisUV = new V3();
    this.type = J_BALL;

}

Object.assign( Joint3D.prototype, {

	isJoint3D: true,

    clone:function(){

        var j = new Joint3D();

        j.type = this.type;
        j.rotor = this.rotor;
        j.max = this.max;
        j.min = this.min;
        j.freeHinge = this.freeHinge;
        j.rotationAxisUV.copy( this.rotationAxisUV );
        j.referenceAxisUV.copy( this.referenceAxisUV );

        return j;

    },

    testAngle: function () {

        if( this.max === PI && this.min === -PI ) this.freeHinge = true;
        else this.freeHinge = false;

    },

    validateAngle: function ( a ) {

        a = a < 0 ? 0 : a;
        a = a > 180 ? 180 : a;
        return a;

    },

    setAsBallJoint:function( angle ){

        this.rotor = this.validateAngle( angle ) * TORAD;
        this.type = J_BALL;
        
    },

    // Specify this joint to be a hinge with the provided settings

    setHinge: function( type, rotationAxis, clockwise, anticlockwise, referenceAxis ){

        this.type = type;
        if( clockwise < 0 ) clockwise *= -1;
        this.min = -this.validateAngle( clockwise ) * TORAD;
        this.max = this.validateAngle( anticlockwise ) * TORAD;

        this.testAngle();

        this.rotationAxisUV.copy( rotationAxis ).normalize();
        this.referenceAxisUV.copy( referenceAxis ).normalize();

    },

    // GET

    getHingeReferenceAxis:function () {

        return this.referenceAxisUV; 

    },

    getHingeRotationAxis:function () {

        return this.rotationAxisUV; 

    },

    // SET

    setBallJointConstraintDegs: function ( angle ) {

        this.rotor = this.validateAngle( angle ) * TORAD;

    },

    setHingeClockwise: function ( angle ) {

        if( angle < 0 ) angle *= -1;
        this.min = -this.validateAngle( angle ) * TORAD;
        this.testAngle();

    },

    setHingeAnticlockwise: function ( angle ) {

        this.max = this.validateAngle( angle ) * TORAD;
        this.testAngle();

    },

    /*setHingeRotationAxis: function ( axis ) {

        this.rotationAxisUV.copy( axis ).normalize();

    },

    setHingeReferenceAxis: function ( referenceAxis ) {

        this.referenceAxisUV.copy( referenceAxis ).normalize(); 

    },*/

    
    
} );

export { Joint3D };
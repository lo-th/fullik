import { V3 } from '../math/V3.js';
import { _Math } from '../math/Math.js';
import { J_BALL, J_GLOBAL, J_LOCAL, MIN_DEGS, MAX_DEGS } from '../constants.js';

function Joint3D(){

    this.mRotorConstraintDegs = MAX_DEGS;
    this.mHingeClockwiseConstraintDegs = MAX_DEGS;
    this.mHingeAnticlockwiseConstraintDegs = MAX_DEGS;

    this.mRotationAxisUV = new V3();
    this.mReferenceAxisUV = new V3();
    this.type = J_BALL;

}

Object.assign( Joint3D.prototype, {

	isJoint3D: true,

    clone:function(){

        var j = new Joint3D();
        j.type = this.type;
        j.mRotorConstraintDegs = this.mRotorConstraintDegs;
        j.mHingeClockwiseConstraintDegs = this.mHingeClockwiseConstraintDegs;
        j.mHingeAnticlockwiseConstraintDegs = this.mHingeAnticlockwiseConstraintDegs;
        j.mRotationAxisUV.copy( this.mRotationAxisUV );
        j.mReferenceAxisUV.copy( this.mReferenceAxisUV );
        return j;

    },

    validateAngle:function( angle ){

        return _Math.clamp( angle, MIN_DEGS, MAX_DEGS );

    },

    setAsBallJoint:function( angle ){

        this.mRotorConstraintDegs = this.validateAngle( angle );
        this.type = J_BALL;
        
    },

    // Specify this joint to be a hinge with the provided settings.
    setHinge: function( type, rotationAxis, clockwiseConstraintDegs, anticlockwiseConstraintDegs, referenceAxis ){

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
        if ( !(this.type === J_BALL) ) return this.mHingeClockwiseConstraintDegs;
    },

    getHingeAnticlockwiseConstraintDegs:function(){
        if ( !(this.type === J_BALL) ) return this.mHingeAnticlockwiseConstraintDegs;
    },

    getHingeReferenceAxis:function(){
        if ( !(this.type === J_BALL) ) return this.mReferenceAxisUV; 
    },

    getHingeRotationAxis:function(){
        if ( !(this.type === J_BALL) ) return this.mRotationAxisUV; 
    },

    getBallJointConstraintDegs:function(){
        if ( this.type === J_BALL ) return this.mRotorConstraintDegs; 
    },

    // SET

    /*setAsGlobalHinge:function( globalRotationAxis, cwConstraintDegs, acwConstraintDegs, globalReferenceAxis ){
        this.setHinge( J_GLOBAL, globalRotationAxis, cwConstraintDegs, acwConstraintDegs, globalReferenceAxis );
    },

    setAsLocalHinge:function( localRotationAxis, cwConstraintDegs, acwConstraintDegs, localReferenceAxis ){
        this.setHinge( J_LOCAL, localRotationAxis, cwConstraintDegs, acwConstraintDegs, localReferenceAxis );
    },*/

    setBallJointConstraintDegs:function( angle ){
        if ( this.type === J_BALL ) this.mRotorConstraintDegs = this.validateAngle( angle );
    },

    setHingeJointClockwiseConstraintDegs:function( angle ){
        if ( !(this.type === J_BALL) ) this.mHingeClockwiseConstraintDegs = this.validateAngle( angle ); 
    },

    setHingeJointAnticlockwiseConstraintDegs:function( angle ){
        if ( !(this.type === J_BALL) ) this.mHingeAnticlockwiseConstraintDegs = this.validateAngle( angle ); 
    },

    setHingeRotationAxis:function( axis ){
        if ( !(this.type === J_BALL) ) this.mRotationAxisUV.copy( axis.normalised() ); 
    },

    setHingeReferenceAxis:function( referenceAxis ){
        if ( !(this.type === J_BALL) ) this.mReferenceAxisUV.copy( referenceAxis.normalised() ); 
    },

    
    
} );

export { Joint3D };
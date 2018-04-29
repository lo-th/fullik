import { V3 } from '../math/V3.js';
import { _Math } from '../math/Math.js';
import { J_BALL, J_GLOBAL, J_LOCAL } from '../constants.js';

function Joint3D(){

    this.mRotorConstraintDegs = _Math.MAX_ANGLE_DEGS;
    this.mHingeClockwiseConstraintDegs = _Math.MAX_ANGLE_DEGS;
    this.mHingeAnticlockwiseConstraintDegs = _Math.MAX_ANGLE_DEGS;

    this.mRotationAxisUV = new V3();
    this.mReferenceAxisUV = new V3();
    this.type = J_BALL;

}

Object.assign( Joint3D.prototype, {

    clone:function(){

        var j = new Joint3D();
        j.mRotorConstraintDegs = this.mRotorConstraintDegs;
        j.mHingeClockwiseConstraintDegs = this.mHingeClockwiseConstraintDegs;
        j.mHingeAnticlockwiseConstraintDegs = this.mHingeAnticlockwiseConstraintDegs;
        j.type = this.type;
        j.mRotationAxisUV.copy( this.mRotationAxisUV );
        j.mReferenceAxisUV.copy( this.mReferenceAxisUV );
        return j;

    },

    validateAngle:function( angle ){

        if( angle < _Math.MIN_ANGLE_DEGS ){ angle = _Math.MIN_ANGLE_DEGS; console.log( '! min angle is '+ _Math.MIN_ANGLE_DEGS ); }
        if( angle > _Math.MAX_ANGLE_DEGS ){ angle = _Math.MAX_ANGLE_DEGS; console.log( '! max angle is '+ _Math.MAX_ANGLE_DEGS ); }

        return angle;

    },

    setAsBallJoint:function( angleDegs ){

        this.mRotorConstraintDegs = this.validateAngle( angleDegs );
        this.type = J_BALL;
        
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

    setAsGlobalHinge:function( globalRotationAxis, cwConstraintDegs, acwConstraintDegs, globalReferenceAxis ){
        this.setHinge( J_GLOBAL, globalRotationAxis, cwConstraintDegs, acwConstraintDegs, globalReferenceAxis );
    },

    setAsLocalHinge:function( localRotationAxis, cwConstraintDegs, acwConstraintDegs, localReferenceAxis ){
        this.setHinge( J_LOCAL, localRotationAxis, cwConstraintDegs, acwConstraintDegs, localReferenceAxis );
    },

    setBallJointConstraintDegs:function( angleDegs ){
        if ( this.type === J_BALL ) this.mRotorConstraintDegs = this.validateAngle( angleDegs );
    },

    setHingeJointClockwiseConstraintDegs:function( angleDegs ){
        if ( !(this.type === J_BALL) ) this.mHingeClockwiseConstraintDegs = this.validateAngle( angleDegs ); 
    },

    setHingeJointAnticlockwiseConstraintDegs:function( angleDegs ){
        if ( !(this.type === J_BALL) ) this.mHingeAnticlockwiseConstraintDegs = this.validateAngle( angleDegs ); 
    },

    setHingeRotationAxis:function( axis ){
        if ( !(this.type === J_BALL) ) this.mRotationAxisUV.copy( axis.normalised() ); 
    },

    setHingeReferenceAxis:function( referenceAxis ){
        if ( !(this.type === J_BALL) ) this.mReferenceAxisUV.copy( referenceAxis.normalised() ); 
    },

    
    
} );

export { Joint3D };
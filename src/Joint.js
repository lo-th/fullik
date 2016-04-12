

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
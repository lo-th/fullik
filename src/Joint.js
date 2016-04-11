

Fullik.Joint = function( source ){

    this.mRotorConstraintDegs = Fullik.MAX_ANGLE_DEGS;
    this.mHingeClockwiseConstraintDegs = Fullik.MAX_ANGLE_DEGS;
    this.mHingeAnticlockwiseConstraintDegs = Fullik.MAX_ANGLE_DEGS;

    this.mRotationAxisUV = new Fullik.V3();
    this.mReferenceAxisUV = new Fullik.V3();
    this.type = Fullik.J_BALL;

    if(source !== undefined){
        this.mRotorConstraintDegs = source.mRotorConstraintDegs;
        this.mHingeClockwiseConstraintDegs = source.mHingeClockwiseConstraintDegs;
        this.mHingeAnticlockwiseConstraintDegs = source.mHingeAnticlockwiseConstraintDegs;
        this.type = source.type;
        this.mRotationAxisUV.copy( source.mRotationAxisUV );
        this.mReferenceAxisUV.copy( source.mReferenceAxisUV );
    }
}

Fullik.Joint.prototype = {

    constructor: Fullik.Joint,

    clone:function(){
        return new Fullik.Joint( this );
    },

    setAsBallJoint:function( constraintAngleDegs ){
        //this.validateConstraintAngleDegs(constraintAngleDegs);
        this.mRotorConstraintDegs = constraintAngleDegs;
        this.type = Fullik.J_BALL;
        
    },

    // Specify this joint to be a hinge with the provided settings.
    setHinge: function( type, rotationAxis, clockwiseConstraintDegs, anticlockwiseConstraintDegs, referenceAxis ){

        // Set params
        this.type = type;
        this.mHingeClockwiseConstraintDegs     = clockwiseConstraintDegs;
        this.mHingeAnticlockwiseConstraintDegs = anticlockwiseConstraintDegs;
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
        if ( this.type === Fullik.J_BALL ) this.mRotorConstraintDegs = angleDegs;
    },

    setHingeJointClockwiseConstraintDegs:function( angleDegs ){
        if ( !(this.type === Fullik.J_BALL) ) this.mHingeClockwiseConstraintDegs = angleDegs; 
    },

    setHingeJointAnticlockwiseConstraintDegs:function( angleDegs ){
        if ( !(this.type === Fullik.J_BALL) ) this.mHingeAnticlockwiseConstraintDegs = angleDegs; 
    },

    setHingeRotationAxis:function( axis ){
        if ( !(this.type === Fullik.J_BALL) ) this.mRotationAxisUV.copy( axis.normalised() ); 
    },

    setHingeReferenceAxis:function( referenceAxis ){
        if ( !(this.type === Fullik.J_BALL) ) this.mReferenceAxisUV.copy( referenceAxis.normalised() ); 
    },

    
    
}
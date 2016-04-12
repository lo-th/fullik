

Fullik.Bone = function( startLocation, endLocation, directionUV, length, color ){

    this.mJoint = new Fullik.Joint();
    this.mStartLocation = new Fullik.V3();
    this.mEndLocation = new Fullik.V3();
    
    this.mBoneConnectionPoint = 'end';
    this.mLength = 0;

    this.color = color || 0xFFFFFF;
    this.name = '';

    this.init( startLocation, endLocation, directionUV, length );

};

Fullik.Bone.prototype = {

    constructor: Fullik.Bone,

    init:function( startLocation, endLocation, directionUV, length ){

        this.setStartLocation( startLocation );
        if( endLocation !== undefined ){ 
            this.setEndLocation( endLocation );
            this.setLength( Fullik.distanceBetween( this.mStartLocation, this.mEndLocation ) );
        } else {
            this.setLength( length );
            this.setEndLocation( this.mStartLocation.plus( directionUV.normalised().times( length ) ) );
        }

    },

    clone:function(){
        var b = new Fullik.Bone( this.mStartLocation, this.mEndLocation );
        b.mJoint = this.mJoint.clone();
        return b;
    },

    length : function(){
        return this.mLength;
    },

    liveLength :function(){
        return Fullik.distanceBetween( this.mStartLocation, this.mEndLocation );
    },
    

    // SET

    setName:function( name ){
        this.name = name;
    },

    setColor:function( c ){
        this.color = c;
    },

    setBoneConnectionPoint:function( bcp ){
        this.mBoneConnectionPoint = bcp;
    },

    setHingeJointClockwiseConstraintDegs:function( angleDegs ){
        this.mJoint.setHingeJointClockwiseConstraintDegs( angleDegs );
    },

    setHingeJointAnticlockwiseConstraintDegs:function( angleDegs ){
        this.mJoint.setHingeJointAnticlockwiseConstraintDegs( angleDegs );
    },

    setBallJointConstraintDegs:function( angleDegs ){
        if (angleDegs < 0 ) angleDegs = 0;
        if (angleDegs > 180 ) angleDegs = 180;
        this.mJoint.setBallJointConstraintDegs( angleDegs );
    },

    setStartLocation:function( location ){
        this.mStartLocation.copy( location );
    },

    setEndLocation:function( location ){
        this.mEndLocation.copy( location );
    },

    setLength:function( lng ){
        if ( lng > 0 ) this.mLength = lng;
    },

    setJoint:function( joint ){
        this.mJoint = joint;
    },


    // GET

    getHingeJointClockwiseConstraintDegs : function(){
        return this.mJoint.getHingeClockwiseConstraintDegs();
    },

    
    getHingeJointAnticlockwiseConstraintDegs : function(){
        return this.mJoint.getHingeAnticlockwiseConstraintDegs();
    },

    
    getBallJointConstraintDegs : function(){
        return this.mJoint.getBallJointConstraintDegs();
    },

    getBoneConnectionPoint:function(){
        return this.mBoneConnectionPoint;
    },

    getDirectionUV:function(){
        return Fullik.getDirectionUV( this.mStartLocation, this.mEndLocation );
    },
    getStartLocation : function(){
        return this.mStartLocation;
    },
    getEndLocation : function(){
        return this.mEndLocation;
    },

    getJointType : function(){
        return this.mJoint.getJointType();
    },

    getLength : function(){
        return this.mLength;
    },

    getJoint : function(){
        return this.mJoint;
    },

    

}
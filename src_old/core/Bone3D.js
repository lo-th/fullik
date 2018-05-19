import { Joint3D } from './Joint3D.js';
import { _Math } from '../math/Math.js';
import { V3 } from '../math/V3.js';
import { MIN_DEGS, MAX_DEGS } from '../constants.js';

function Bone3D ( startLocation, endLocation, directionUV, length, color ){

    this.mJoint = new Joint3D();
    this.mStartLocation = new V3();
    this.mEndLocation = new V3();
    
    this.mBoneConnectionPoint = 'end';
    this.mLength = 0;

    this.color = color || 0xFFFFFF;
    this.name = '';

    this.init( startLocation, endLocation, directionUV, length );

};

Object.assign( Bone3D.prototype, {

    isBone3D: true,

    init:function( startLocation, endLocation, directionUV, length ){

        this.setStartLocation( startLocation );
        if( endLocation ){ 
            this.setEndLocation( endLocation );
            this.setLength( _Math.distanceBetween( this.mStartLocation, this.mEndLocation ) );
        } else {
            this.setLength( length );
            this.setEndLocation( this.mStartLocation.plus( directionUV.normalised().times( length ) ) );
        }

    },

    clone:function(){

        var b = new Bone3D( this.mStartLocation, this.mEndLocation );
        b.mJoint = this.mJoint.clone();
        return b;

    },

    length: function(){
        return this.mLength;
    },

    liveLength: function(){
        return _Math.distanceBetween( this.mStartLocation, this.mEndLocation );
    },

    // SET

    setName: function ( name ) {

        this.name = name;

    },

    setColor: function ( c ) {

        this.color = c;

    },

    setBoneConnectionPoint: function ( bcp ) {

        this.mBoneConnectionPoint = bcp;

    },

    setHingeJointClockwiseConstraintDegs: function ( angle ){

        this.mJoint.setHingeJointClockwiseConstraintDegs( angle );

    },

    setHingeJointAnticlockwiseConstraintDegs: function ( angle ){

        this.mJoint.setHingeJointAnticlockwiseConstraintDegs( angle );

    },

    setBallJointConstraintDegs: function ( angle ){

        this.mJoint.setBallJointConstraintDegs( angle );

    },

    setStartLocation: function ( location ) {

        this.mStartLocation.copy ( location );

    },

    setEndLocation:function( location ){

        this.mEndLocation.copy ( location );

    },

    setLength:function( lng ){

        if ( lng > 0 ) this.mLength = lng;

    },

    setJoint:function( joint ){

        this.mJoint = joint;

    },


    // GET

    getHingeJointClockwiseConstraintDegs: function(){
        return this.mJoint.getHingeClockwiseConstraintDegs();
    },

    
    getHingeJointAnticlockwiseConstraintDegs: function(){
        return this.mJoint.getHingeAnticlockwiseConstraintDegs();
    },

    
    getBallJointConstraintDegs : function(){
        return this.mJoint.getBallJointConstraintDegs();
    },

    getBoneConnectionPoint:function(){
        return this.mBoneConnectionPoint;
    },

    getDirectionUV:function(){
        return _Math.getDirectionUV( this.mStartLocation, this.mEndLocation );
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

} );

export { Bone3D };
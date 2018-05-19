import { END, START } from '../constants.js';
import { Joint2D } from './Joint2D.js';
import { _Math } from '../math/Math.js';
import { V2 } from '../math/V2.js';

function Bone2D ( startLocation, endLocation, directionUV, length, clockwiseDegs, anticlockwiseDegs, color ){

    this.mJoint = new Joint2D( clockwiseDegs, anticlockwiseDegs );
    this.mStartLocation = new V2();
    this.mEndLocation = new V2();

    this.mGlobalConstraintUV = new V2(1, 0);
    
    this.mBoneConnectionPoint = END;
    this.mLength = 0;

    this.color = color || null;
    this.name = '';

    this.init( startLocation, endLocation, directionUV, length );

};

Object.assign( Bone2D.prototype, {

    isBone2D: true,

    init:function( startLocation, endLocation, directionUV, length ){

        this.setStartLocation( startLocation );
        //if( endLocation !== undefined ){ 
        if( endLocation ){ 

            this.setEndLocation( endLocation );
            this.setLength( _Math.distanceBetween( this.mStartLocation, this.mEndLocation ) );

        } else {

            this.setLength( length );
            this.setEndLocation( this.mStartLocation.plus( directionUV.normalised().times( length ) ) );
            
        }

    },

    clone:function(){
        var b = new Bone2D( this.mStartLocation, this.mEndLocation );
        b.mGlobalConstraintUV = this.mGlobalConstraintUV;
        b.mBoneConnectionPoint = this.mBoneConnectionPoint;
        b.color = this.color;
        b.mJoint = this.mJoint.clone();
        return b;
    },

    length : function(){
        return this.mLength;
    },

    liveLength :function(){
        return _Math.distanceBetween( this.mStartLocation, this.mEndLocation );
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


    setClockwiseConstraintDegs:function( angleDegs ){
        this.mJoint.setClockwiseConstraintDegs( angleDegs );
    },

    setAnticlockwiseConstraintDegs:function( angleDegs ){
        this.mJoint.setAnticlockwiseConstraintDegs( angleDegs );
    },

    setStartLocation:function( v ){
        this.mStartLocation.copy( v );
    },

    setEndLocation:function( v ){
        this.mEndLocation.copy( v );
    },

    setLength:function( lng ){
        if ( lng > 0 ) this.mLength = lng;
    },

    setJoint:function( joint ){
        this.mJoint = joint;
    },

    setGlobalConstraintUV:function( v ){
        this.mGlobalConstraintUV = v;
    },

    setJointConstraintCoordinateSystem:function( coordSystem ){
        this.mJoint.setConstraintCoordinateSystem( coordSystem );
    },


    // GET

    getGlobalConstraintUV: function(){
        return this.mGlobalConstraintUV;
    },

    getClockwiseConstraintDegs: function(){
        return this.mJoint.getClockwiseConstraintDegs();
    },

    
    getAnticlockwiseConstraintDegs: function(){
        return this.mJoint.getAnticlockwiseConstraintDegs();
    },

    getJointConstraintCoordinateSystem: function () {
        return this.mJoint.getConstraintCoordinateSystem();
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

    /*getJointType : function(){
        return this.mJoint.getJointType();
    },*/

    getLength : function(){
        return this.mLength;
    },

    getJoint : function(){
        return this.mJoint;
    },

    

} );

export { Bone2D };
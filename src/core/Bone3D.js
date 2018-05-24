import { END, START } from '../constants.js';
import { Joint3D } from './Joint3D.js';
import { V3 } from '../math/V3.js';

function Bone3D ( startLocation, endLocation, directionUV, length, color ){

    this.joint = new Joint3D();
    this.start = new V3();
    this.end = new V3();
    
    this.boneConnectionPoint = END;
    this.length = 0;

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
            this.length = this.getLength();

        } else {
            this.setLength( length );
            this.setEndLocation( this.start.plus( directionUV.normalised().multiplyScalar( length ) ) );
        }

    },

    clone:function () {

        var b = new Bone3D( this.start, this.end );
        b.joint = this.joint.clone();
        return b;

    },

    // SET

    setColor: function ( c ) {

        this.color = c;

    },

    setBoneConnectionPoint: function ( bcp ) {

        this.boneConnectionPoint = bcp;

    },

    setHingeClockwise: function ( angle ) {


        this.joint.setHingeClockwise( angle );

    },

    setHingeAnticlockwise: function ( angle ) {

        this.joint.setHingeAnticlockwise( angle );

    },

    setBallJointConstraintDegs: function ( angle ) {

        this.joint.setBallJointConstraintDegs( angle );

    },

    setStartLocation: function ( location ) {

        this.start.copy ( location );

    },

    setEndLocation: function ( location ) {

        this.end.copy ( location );

    },

    setLength: function ( lng ) {

        if ( lng > 0 ) this.length = lng;

    },

    setJoint: function ( joint ) {

        this.joint = joint;

    },


    // GET

    getBoneConnectionPoint: function () {

        return this.boneConnectionPoint;

    },

    getDirectionUV: function () {

        return this.end.minus( this.start ).normalize();

    },

    getLength: function(){

        return this.start.distanceTo( this.end );

    },

} );

export { Bone3D };
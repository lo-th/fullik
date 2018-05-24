import { END, START } from '../constants.js';
import { Joint2D } from './Joint2D.js';
import { V2 } from '../math/V2.js';

function Bone2D ( Start, End, directionUV, length, clockwiseDegs, anticlockwiseDegs, color ) {

    this.start = new V2();
    this.end = new V2();
    this.length = length || 0;

    this.joint = new Joint2D( clockwiseDegs, anticlockwiseDegs );

    this.globalConstraintUV = new V2(1, 0);
    this.boneConnectionPoint = END;

    this.color = color || null;
    this.name = '';

    // init

    this.setStartLocation( Start );

    if( End ){ 

        this.setEndLocation( End );
        if( this.length === 0 ) this.length = this.getLength();

    } else if ( directionUV ) {

        this.setEndLocation( this.start.plus( directionUV.normalised().multiplyScalar( this.length ) ) );
        
    }

};

Object.assign( Bone2D.prototype, {

    isBone2D: true,

    clone: function () {

        var b = new Bone2D( this.start, this.end );
        b.length = this.length;
        b.globalConstraintUV = this.globalConstraintUV;
        b.boneConnectionPoint = this.boneConnectionPoint;
        b.joint = this.joint.clone();
        b.color = this.color;
        b.name = this.name;
        return b;

    },
    

    // SET

    setName: function ( name ) {

        this.name = name;

    },

    setColor: function ( c ) {

        this.color = c;

    },

    setBoneConnectionPoint: function ( bcp ) {

        this.boneConnectionPoint = bcp;

    },

    setStartLocation: function ( v ) {

        this.start.copy( v );

    },

    setEndLocation: function ( v ) {

        this.end.copy( v );

    },

    setLength:function ( length ) {

        if ( length > 0 ) this.length = length;

    },

    setGlobalConstraintUV: function ( v ) {

        this.globalConstraintUV = v;

    },

    // SET JOINT

    setJoint: function ( joint ) {

        this.joint = joint;

    },

    setClockwiseConstraintDegs: function ( angleDegs ) {

        this.joint.setClockwiseConstraintDegs( angleDegs );

    },

    setAnticlockwiseConstraintDegs: function ( angleDegs ) {

        this.joint.setAnticlockwiseConstraintDegs( angleDegs );

    },

    setJointConstraintCoordinateSystem: function ( coordSystem ) {

        this.joint.setConstraintCoordinateSystem( coordSystem );

    },


    // GET

    getGlobalConstraintUV: function () {

        return this.globalConstraintUV;

    },
    
    getBoneConnectionPoint: function () {

        return this.boneConnectionPoint;

    },

    getDirectionUV: function () {

        return this.end.minus( this.start ).normalize();

    },

    getLength: function () {

        return this.start.distanceTo( this.end );

    },
    

} );

export { Bone2D };
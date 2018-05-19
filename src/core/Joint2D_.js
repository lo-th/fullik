import { _Math } from '../math/Math.js';
import { J_LOCAL, J_GLOBAL, MIN_DEGS, MAX_DEGS } from '../constants.js';

function Joint2D( clockwiseConstraintDegs, antiClockwiseConstraintDegs, constraint ){

    this.mClockwiseConstraintDegs = clockwiseConstraintDegs !== undefined ? clockwiseConstraintDegs : MAX_DEGS;
    this.mAnticlockwiseConstraintDegs = antiClockwiseConstraintDegs !== undefined ? antiClockwiseConstraintDegs : MAX_DEGS;

    // Constraint Coordinate System J_LOCAL or J_GLOBAL
    this.constraint = constraint || J_LOCAL;

}

Object.assign( Joint2D.prototype, {

    isJoint2D: true,

    clone:function(){

        var j = new Joint2D();
        j.mClockwiseConstraintDegs = this.mClockwiseConstraintDegs;
        j.mAnticlockwiseConstraintDegs = this.mAnticlockwiseConstraintDegs;
        j.mConstraintCoordinateSystem = this.constraint;
        return j;

    },

    validateAngle: function ( angle ) {

        return _Math.clamp( angle, MIN_DEGS, MAX_DEGS );

    },

    // SET

    set: function ( sourceJoint ) {

        //this.setClockwiseConstraintDegs(sourceJoint.mClockwiseConstraintDegs);
        //this.setAnticlockwiseConstraintDegs(sourceJoint.mAnticlockwiseConstraintDegs);
        this.mClockwiseConstraintDegs = sourceJoint.mClockwiseConstraintDegs;
        this.mAnticlockwiseConstraintDegs = sourceJoint.mAnticlockwiseConstraintDegs;
        this.constraint = sourceJoint.mConstraintCoordinateSystem;

    },

    setClockwiseConstraintDegs: function ( angle ) {

        this.mClockwiseConstraintDegs = this.validateAngle( angle );
        
    },

    setAnticlockwiseConstraintDegs:function( angle ){

        this.mAnticlockwiseConstraintDegs = this.validateAngle( angle );
        
    },

    setConstraintCoordinateSystem: function( constraint ){

        this.constraint = constraint;

    },


    // GET

    getClockwiseConstraintDegs:function(){

        return this.mClockwiseConstraintDegs;

    },

    getAnticlockwiseConstraintDegs:function(){

        return this.mAnticlockwiseConstraintDegs;

    },

    getConstraintCoordinateSystem:function(){

        return this.constraint;

    },

} );

export { Joint2D };
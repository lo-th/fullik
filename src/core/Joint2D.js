import { _Math } from '../math/Math.js';
import { J_LOCAL, J_GLOBAL } from '../constants.js';

function Joint2D( clockwiseConstraintDegs, antiClockwiseConstraintDegs, constraintCoordSystem ){

    this.mClockwiseConstraintDegs = clockwiseConstraintDegs || _Math.MAX_ANGLE_DEGS;
    this.mAnticlockwiseConstraintDegs = antiClockwiseConstraintDegs || _Math.MAX_ANGLE_DEGS;
    this.mConstraintCoordinateSystem = constraintCoordSystem || J_LOCAL;

}

Joint2D.prototype = {

    constructor: Joint2D,

    clone:function(){

        var j = new Joint2D();
        j.mClockwiseConstraintDegs = this.mClockwiseConstraintDegs;
        j.mAnticlockwiseConstraintDegs = this.mAnticlockwiseConstraintDegs;
        j.mConstraintCoordinateSystem = this.mConstraintCoordinateSystem;
        return j;

    },

    validateAngle:function( angle ){

        angle = _Math.clamp( angle, _Math.MIN_ANGLE_DEGS, _Math.MAX_ANGLE_DEGS )

        //if( angle < _Math.MIN_ANGLE_DEGS ){ angle = _Math.MIN_ANGLE_DEGS; console.log( '! min angle is '+ _Math.MIN_ANGLE_DEGS ); }
        //if( angle > _Math.MAX_ANGLE_DEGS ){ angle = _Math.MAX_ANGLE_DEGS; console.log( '! max angle is '+ _Math.MAX_ANGLE_DEGS ); }
        return angle;

    },

    // SET

    set: function ( sourceJoint ) {

        //this.setClockwiseConstraintDegs(sourceJoint.mClockwiseConstraintDegs);
        //this.setAnticlockwiseConstraintDegs(sourceJoint.mAnticlockwiseConstraintDegs);
        this.mClockwiseConstraintDegs = sourceJoint.mClockwiseConstraintDegs;
        this.mAnticlockwiseConstraintDegs = sourceJoint.mAnticlockwiseConstraintDegs;
        this.mConstraintCoordinateSystem = sourceJoint.mConstraintCoordinateSystem;

    },

    setClockwiseConstraintDegs:function( angleDegs ){

        this.mClockwiseConstraintDegs = this.validateAngle( angleDegs );
        
    },

    setAnticlockwiseConstraintDegs:function( angleDegs ){

        this.mAnticlockwiseConstraintDegs = this.validateAngle( angleDegs );
        
    },

    setConstraintCoordinateSystem:function( coordSystem ){

        this.mConstraintCoordinateSystem = coordSystem;

    },


    // GET

    getClockwiseConstraintDegs:function(){

        return this.mClockwiseConstraintDegs;

    },

    getAnticlockwiseConstraintDegs:function(){

        return this.mAnticlockwiseConstraintDegs;

    },

    getConstraintCoordinateSystem:function(){

        return this.mConstraintCoordinateSystem;

    },

}

export { Joint2D };
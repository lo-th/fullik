import { _Math } from '../math/Math.js';

function Joint2D( clockwiseConstraintDegs, antiClockwiseConstraintDegs ){

    this.mClockwiseConstraintDegs = clockwiseConstraintDegs || _Math.MAX_ANGLE_DEGS;
    this.mAnticlockwiseConstraintDegs = antiClockwiseConstraintDegs || _Math.MAX_ANGLE_DEGS;

}

Joint2D.prototype = {

    constructor: Joint2D,

    clone:function(){

        var j = new Joint2D();
        j.mClockwiseConstraintDegs = this.mClockwiseConstraintDegs;
        j.mAnticlockwiseConstraintDegs = this.mAnticlockwiseConstraintDegs;
        return j;

    },

    validateAngle:function( angle ){

        if( angle < _Math.MIN_ANGLE_DEGS ){ angle = _Math.MIN_ANGLE_DEGS; console.log( '! min angle is '+ _Math.MIN_ANGLE_DEGS ); }
        if( angle > _Math.MAX_ANGLE_DEGS ){ angle = _Math.MAX_ANGLE_DEGS; console.log( '! max angle is '+ _Math.MAX_ANGLE_DEGS ); }
        return angle;

    },

    // SET

    set: function ( sourceJoint ) {

        this.setClockwiseConstraintDegs(sourceJoint.mClockwiseConstraintDegs);
        this.setAnticlockwiseConstraintDegs(sourceJoint.mAnticlockwiseConstraintDegs);

    },

    setClockwiseConstraintDegs:function( angleDegs ){

        this.mClockwiseConstraintDegs = this.validateAngle( angleDegs );
        
    },

    setAnticlockwiseConstraintDegs:function( angleDegs ){

        this.mAnticlockwiseConstraintDegs = this.validateAngle( angleDegs );
        
    },


    // GET

    getClockwiseConstraintDegs:function(){

        return this.mClockwiseConstraintDegs;

    },

    getAnticlockwiseConstraintDegs:function(){

        return this.mAnticlockwiseConstraintDegs;

    },

}

export { Joint2D };
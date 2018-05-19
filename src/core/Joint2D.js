import { _Math } from '../math/Math.js';
import { J_LOCAL, J_GLOBAL, MIN_DEGS, MAX_DEGS } from '../constants.js';

function Joint2D( clockwiseConstraintDegs, antiClockwiseConstraintDegs, constraintCoordSystem ){

    this.minDeg = clockwiseConstraintDegs !== undefined ? clockwiseConstraintDegs : MAX_DEGS;
    this.maxDeg = antiClockwiseConstraintDegs !== undefined ? antiClockwiseConstraintDegs : MAX_DEGS;
    this.coordinateSystem = constraintCoordSystem || J_LOCAL;

    this.min = -this.minDeg * _Math.toRad;
    this.max = this.maxDeg * _Math.toRad;
    
}

Object.assign( Joint2D.prototype, {

    isJoint2D: true,

    clone: function () {

        var j = new Joint2D();
        j.minDeg = this.minDeg;
        j.maxDeg = this.maxDeg;
        j.coordinateSystem = this.coordinateSystem;

        j.max = this.max;
        j.min = this.min;


        return j;

    },

    validateAngle: function ( angle ) {

        return _Math.clamp( angle, MIN_DEGS, MAX_DEGS );

    },

    // SET

    set: function ( joint ) {

        this.minDeg = joint.minDeg;
        this.maxDeg = joint.maxDeg;
        this.max = joint.max;
        this.min = joint.min;
        this.coordinateSystem = joint.coordinateSystem;

    },

    setClockwiseConstraintDegs: function ( angle ) {

        // 0 to -180 degrees represents clockwise rotation
        this.minDeg = this.validateAngle( angle );
        this.min = -this.minDeg * _Math.toRad;
        
    },

    setAnticlockwiseConstraintDegs: function ( angle ) {

        // 0 to 180 degrees represents anti-clockwise rotation
        this.maxDeg = this.validateAngle( angle );
        this.max = this.maxDeg * _Math.toRad;
        
    },

    setConstraintCoordinateSystem: function ( coordSystem ) {

        this.coordinateSystem = coordSystem;

    },


    // GET

    getClockwiseConstraintDegs: function () {

        return this.minDeg;

    },

    getAnticlockwiseConstraintDegs: function () {

        return this.maxDeg;

    },

    getConstraintCoordinateSystem: function () {

        return this.coordinateSystem;

    },

} );

export { Joint2D };
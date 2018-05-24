import { J_LOCAL, J_GLOBAL, PI, TORAD } from '../constants.js';

function Joint2D( clockwise, antiClockwise, coordSystem ){

    this.coordinateSystem = coordSystem || J_LOCAL;

    this.min = clockwise !== undefined ? -clockwise * TORAD : -PI;
    this.max = antiClockwise !== undefined ? antiClockwise * TORAD : PI;
    
}

Object.assign( Joint2D.prototype, {

    isJoint2D: true,

    clone: function () {

        var j = new Joint2D();

        j.coordinateSystem = this.coordinateSystem;
        j.max = this.max;
        j.min = this.min;

        return j;

    },

    validateAngle: function ( a ) {

        a = a < 0 ? 0 : a;
        a = a > 180 ? 180 : a;
        return a;

    },

    // SET

    set: function ( joint ) {

        this.max = joint.max;
        this.min = joint.min;
        this.coordinateSystem = joint.coordinateSystem;

    },

    setClockwiseConstraintDegs: function ( angle ) {

        // 0 to -180 degrees represents clockwise rotation
        this.min = - (this.validateAngle( angle ) * TORAD);
        
    },

    setAnticlockwiseConstraintDegs: function ( angle ) {

        // 0 to 180 degrees represents anti-clockwise rotation
        this.max = this.validateAngle( angle ) * TORAD;
        
    },

    setConstraintCoordinateSystem: function ( coordSystem ) {

        this.coordinateSystem = coordSystem;

    },


    // GET

    getConstraintCoordinateSystem: function () {

        return this.coordinateSystem;

    },

} );

export { Joint2D };
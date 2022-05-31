import { END, START } from '../constants.js';
import { Joint3D } from './Joint3D.js';
import { V3 } from '../math/V3.js';


export class Bone3D {

    constructor( startLocation, endLocation, directionUV, length, color ) {

        this.isBone3D = true

        this.joint = new Joint3D();
        this.start = new V3();
        this.end = new V3();
        
        this.boneConnectionPoint = END;
        this.length = 0;

        this.color = color || 0xFFFFFF;
        this.name = '';

        this.init( startLocation, endLocation, directionUV, length );

    }

    init( startLocation, endLocation, directionUV, length ){

        this.setStartLocation( startLocation );
        if( endLocation ){ 
            this.setEndLocation( endLocation );
            this.length = this.getLength();

        } else {
            this.setLength( length );
            this.setEndLocation( this.start.plus( directionUV.normalised().multiplyScalar( length ) ) );
        }

    }

    clone() {

        let b = new this.constructor( this.start, this.end );
        b.joint = this.joint.clone();
        return b;

    }

    // SET

    setColor( c ) {

        this.color = c;

    }

    setBoneConnectionPoint( bcp ) {

        this.boneConnectionPoint = bcp;

    }

    setHingeClockwise( angle ) {


        this.joint.setHingeClockwise( angle );

    }

    setHingeAnticlockwise( angle ) {

        this.joint.setHingeAnticlockwise( angle );

    }

    setBallJointConstraintDegs( angle ) {

        this.joint.setBallJointConstraintDegs( angle );

    }

    setStartLocation( location ) {

        this.start.copy ( location );

    }

    setEndLocation( location ) {

        this.end.copy ( location );

    }

    setLength( lng ) {

        if ( lng > 0 ) this.length = lng;

    }

    setJoint( joint ) {

        this.joint = joint;

    }


    // GET

    getBoneConnectionPoint() {

        return this.boneConnectionPoint;

    }

    getDirectionUV () {

        return this.end.minus( this.start ).normalize();

    }

    getLength(){

        return this.start.distanceTo( this.end );

    }

}
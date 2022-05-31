import { END, START } from '../constants.js';
import { Joint2D } from './Joint2D.js';
import { V2 } from '../math/V2.js';


export class Bone2D {

    constructor( Start, End, directionUV, length, clockwiseDegs, anticlockwiseDegs, color ) {

        this.isBone2D = true

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

    }

    clone() {

        let b = new Bone2D( this.start, this.end );
        b.length = this.length;
        b.globalConstraintUV = this.globalConstraintUV;
        b.boneConnectionPoint = this.boneConnectionPoint;
        b.joint = this.joint.clone();
        b.color = this.color;
        b.name = this.name;
        return b;

    }

    // SET

    setName( name ) {

        this.name = name;

    }

    setColor( c ) {

        this.color = c;

    }

    setBoneConnectionPoint( bcp ) {

        this.boneConnectionPoint = bcp;

    }

    setStartLocation( v ) {

        this.start.copy( v );

    }

    setEndLocation( v ) {

        this.end.copy( v );

    }

    setLengt( length ) {

        if ( length > 0 ) this.length = length;

    }

    setGlobalConstraintUV( v ) {

        this.globalConstraintUV = v;

    }

    // SET JOINT

    setJoint( joint ) {

        this.joint = joint;

    }

    setClockwiseConstraintDegs( angleDegs ) {

        this.joint.setClockwiseConstraintDegs( angleDegs );

    }

    setAnticlockwiseConstraintDegs( angleDegs ) {

        this.joint.setAnticlockwiseConstraintDegs( angleDegs );

    }

    setJointConstraintCoordinateSystem ( coordSystem ) {

        this.joint.setConstraintCoordinateSystem( coordSystem );

    }


    // GET

    getGlobalConstraintUV() {

        return this.globalConstraintUV;

    }
    
    getBoneConnectionPoint() {

        return this.boneConnectionPoint;

    }

    getDirectionUV() {

        return this.end.minus( this.start ).normalize();

    }

    getLength() {

        return this.start.distanceTo( this.end );

    }
    

}
import { NONE, GLOBAL_ABSOLUTE, LOCAL_RELATIVE, LOCAL_ABSOLUTE, END, START, J_LOCAL, J_GLOBAL, MAX_VALUE } from '../constants.js';
import { math } from '../math/Math.js';
import { V2 } from '../math/V2.js';
import { Bone2D } from './Bone2D.js';
import { Tools } from './Tools.js';


export class Chain2D {

    constructor( color ) {

        this.isChain2D = true;
        this.tmpTarget = new V2();

        this.bones = [];
        this.name = '';

        this.solveDistanceThreshold = 1.0;
        this.minIterationChange = 0.01;
        this.maxIteration = 15;
        this.precision = 0.001;
        
        this.chainLength = 0;
        this.numBones = 0;

        this.baseLocation = new V2();
        this.fixedBaseMode = true;

        this.baseboneConstraintType = NONE;

        this.baseboneConstraintUV = new V2();
        this.baseboneRelativeConstraintUV = new V2();

        this.lastTargetLocation = new V2( MAX_VALUE, MAX_VALUE );
        this.lastBaseLocation =  new V2( MAX_VALUE, MAX_VALUE );

        this.boneConnectionPoint = END;
        
        this.currentSolveDistance = MAX_VALUE;
        this.connectedChainNumber = -1;
        this.connectedBoneNumber = -1;

        this.color = color || 0xFFFFFF;

        this.embeddedTarget = new V2();
        this.useEmbeddedTarget = false;

    }

    clone() {

        let c = new this.constructor()

        c.solveDistanceThreshold = this.solveDistanceThreshold;
        c.minIterationChange = this.minIterationChange;
        c.maxIteration = this.maxIteration;
        c.precision = this.precision;
        
        c.bones = this.cloneBones();
        c.baseLocation.copy( this.baseLocation );
        c.lastTargetLocation.copy( this.lastTargetLocation );
        c.lastBaseLocation.copy( this.lastBaseLocation );
                
        // Copy the basebone constraint UV if there is one to copy
        if ( !(this.baseboneConstraintType === NONE) ){
            c.baseboneConstraintUV.copy( this.baseboneConstraintUV );
            c.baseboneRelativeConstraintUV.copy( this.baseboneRelativeConstraintUV );
        }       
        
        // Native copy by value for primitive members
        c.fixedBaseMode          = this.fixedBaseMode;
        
        c.chainLength            = this.chainLength;
        c.numBones               = this.numBones;
        c.currentSolveDistance   = this.currentSolveDistance;

        c.boneConnectionPoint    = this.boneConnectionPoint;
        c.connectedChainNumber   = this.connectedChainNumber;
        c.connectedBoneNumber    = this.connectedBoneNumber;
        c.baseboneConstraintType = this.baseboneConstraintType;

        c.color = this.color;

        c.embeddedTarget = this.embeddedTarget.clone();
        c.useEmbeddedTarget = this.useEmbeddedTarget;

        return c;

    }

    clear() {

        let i = this.numBones;
        while(i--){
            this.removeBone(i);
        }

    }

    addBone( bone ) {

        if( bone.color === null ) bone.setColor( this.color );

        // Add the new bone to the end of the ArrayList of bones
        this.bones.push( bone );
        

        // If this is the basebone...
        if ( this.numBones === 0 ){
            // ...then keep a copy of the fixed start location...
            this.baseLocation.copy( bone.start );
            
            // ...and set the basebone constraint UV to be around the initial bone direction
            this.baseboneConstraintUV.copy( bone.getDirectionUV() );

        }

        // Increment the number of bones in the chain and update the chain length
        this.numBones ++;
        
        // Increment the number of bones in the chain and update the chain length
        this.updateChainLength();

    }

    removeBone( id ) {

        if ( id < this.numBones ){   
            // ...then remove the bone, decrease the bone count and update the chain length.
            this.bones.splice(id, 1)
            this.numBones --;
            this.updateChainLength();
        }

    }

    addConsecutiveBone( directionUV, length, clockwiseDegs, anticlockwiseDegs, color ) {

        if ( this.numBones === 0 ){ Tools.error('Chain is empty ! need first bone'); return };

        if( directionUV.isBone2D ) { // first argument is bone

            let bone = directionUV;

            // Validate the direction unit vector - throws an IllegalArgumentException if it has a magnitude of zero
            let dir = bone.getDirectionUV();
            math.validateDirectionUV( dir );
            
            // Validate the length of the bone - throws an IllegalArgumentException if it is not a positive value
            let len = bone.length;
            math.validateLength( len );

            let prevBoneEnd = this.bones[ this.numBones-1 ].end;

            bone.setStartLocation( prevBoneEnd );
            bone.setEndLocation( prevBoneEnd.plus( dir.multiplyScalar( len ) ) );
            
            // Add a bone to the end of this IK chain
            this.addBone( bone );

        } else if( directionUV.isVector2 ) {
            
            color = color || this.color;
             
            // Validate the direction unit vector - throws an IllegalArgumentException if it has a magnitude of zero
            math.validateDirectionUV( directionUV );
            
            // Validate the length of the bone - throws an IllegalArgumentException if it is not a positive value
            math.validateLength( length );
                    
            // Get the end location of the last bone, which will be used as the start location of the new bone
            let prevBoneEnd = this.bones[ this.numBones-1 ].end;
                    
            // Add a bone to the end of this IK chain
            this.addBone( new Bone2D( prevBoneEnd, null, directionUV.normalised(), length, clockwiseDegs, anticlockwiseDegs, color ) );
            

        }
        
    }


    // -------------------------------
    //      GET
    // -------------------------------

    getBoneConnectionPoint() {

        return this.boneConnectionPoint;

    }

    getConnectedBoneNumber() {

        return this.connectedBoneNumber;

    }

    getConnectedChainNumber(){

        return this.connectedChainNumber;

    }

    getEmbeddedTarget() {

        return this.embeddedTarget;

    }

    getBaseboneConstraintType() {

        return this.baseboneConstraintType;

    }

    getBaseboneConstraintUV() {

        if ( !(this.baseboneConstraintType === NONE) ) return this.baseboneConstraintUV;

    }

    getBaseLocation() {

        return this.bones[0].start;

    }

    getEffectorLocation() {

        return this.bones[this.numBones-1].end;

    }

    getLastTargetLocation() {

        return this.lastTargetLocation;

    }

    getLiveChainLength() {

        let lng = 0;
        let i = this.numBones;
        while( i-- ) lng += this.bones[i].getLength();
        return lng;

    }


    // -------------------------------
    //      SET
    // -------------------------------

    setColor( color ) {

        this.color = color;
        let i = this.numBones;
        while( i-- ) this.bones[i].setColor( this.color );
        
    }

    setBaseboneRelativeConstraintUV( constraintUV ) { 

        this.baseboneRelativeConstraintUV = constraintUV; 

    }

    setConnectedBoneNumber( boneNumber ) {

        this.connectedBoneNumber = boneNumber;

    }

    setConnectedChainNumber( chainNumber ) {

        this.connectedChainNumber = chainNumber;

    }

    setBoneConnectionPoint( point ) {

        this.boneConnectionPoint = point;

    }

    setBaseboneConstraintUV( constraintUV ) {

        math.validateDirectionUV( constraintUV );
        this.baseboneConstraintUV.copy( constraintUV.normalised() );

    }

    setBaseLocation( baseLocation ){

        this.baseLocation.copy( baseLocation );

    }

    setBaseboneConstraintType( value ) {

        this.baseboneConstraintType = value;

    }

    setFixedBaseMode( value ) {

        // Enforce that a chain connected to another chain stays in fixed base mode (i.e. it moves with the chain it's connected to instead of independently)
        if ( !value && this.connectedChainNumber !== -1) return;
        if ( this.baseboneConstraintType === GLOBAL_ABSOLUTE && !value ) return;
        // Above conditions met? Set the fixedBaseMode
        this.fixedBaseMode = value;

    }

    setMaxIterationAttempts( maxIteration ) {

        if ( maxIteration < 1 ) return;
        this.maxIteration = maxIteration;

    }

    setMinIterationChange( minIterationChange ) {

        if (minIterationChange < 0) return;
        this.minIterationChange = minIterationChange;

    }

    setSolveDistanceThreshold( solveDistance ) {

        if ( solveDistance < 0 ) return;
        this.solveDistanceThreshold = solveDistance;

    }

    // -------------------------------
    //
    //      UPDATE TARGET
    //
    // -------------------------------

    solveForEmbeddedTarget() {

        if ( this.useEmbeddedTarget ) return this.solveForTarget( this.embeddedTarget );

    }

    resetTarget(){

        this.lastBaseLocation = new V2( MAX_VALUE, MAX_VALUE );
        this.currentSolveDistance = MAX_VALUE;

    }


    // Solve the IK chain for this target to the best of our ability.
    // The end result of running this method is that the IK chain configuration is updated.

    // To minimuse CPU usage, this method dynamically aborts if:
    // - The solve distance (i.e. distance between the end effector and the target) is below the solveDistanceThreshold,
    // - A solution incrementally improves on the previous solution by less than the minIterationChange, or
    // - The number of attempts to solve the IK chain exceeds the maxIteration.

    solveForTarget( t ) {

        this.tmpTarget.set( t.x, t.y );
        let p = this.precision;

        let isSameBaseLocation = this.lastBaseLocation.approximatelyEquals( this.baseLocation, p );

        // If we have both the same target and base location as the last run then do not solve
        if ( this.lastTargetLocation.approximatelyEquals( this.tmpTarget, p ) && isSameBaseLocation ) return this.currentSolveDistance;
        
        // Keep starting solutions and distance
        let startingDistance;
        let startingSolution = null;

        // If the base location of a chain hasn't moved then we may opt to keep the current solution if our 
        // best new solution is worse...
        if ( isSameBaseLocation ) {
            startingDistance = this.bones[ this.numBones-1 ].end.distanceTo( this.tmpTarget );
            startingSolution = this.cloneBones();
        } else {
            // Base has changed? Then we have little choice but to recalc the solution and take that new solution.
            startingDistance = MAX_VALUE;
        }
                        
        // Not the same target? Then we must solve the chain for the new target.
		// We'll start by creating a list of bones to store our best solution
        let bestSolution = [];
        
        // We'll keep track of our best solve distance, starting it at a huge value which will be beaten on first attempt
        let bestSolveDistance = MAX_VALUE;
        let lastPassSolveDistance = MAX_VALUE;
        
        // Allow up to our iteration limit attempts at solving the chain
        let solveDistance;
        
        let i = this.maxIteration;

        while( i-- ){

            // Solve the chain for this target
            solveDistance = this.solveIK( this.tmpTarget );
            
            // Did we solve it for distance? If so, update our best distance and best solution, and also
            // update our last pass solve distance. Note: We will ALWAYS beat our last solve distance on the first run

            if ( solveDistance < bestSolveDistance ) {   

                bestSolveDistance = solveDistance;
                bestSolution = this.cloneBones();
                
                // If we are happy that this solution meets our distance requirements then we can exit the loop now
                if ( solveDistance <= this.solveDistanceThreshold ) break;
                
            } else {

                // Did not solve to our satisfaction? Okay...
                // Did we grind to a halt? If so break out of loop to set the best distance and solution that we have
                if ( Math.abs( solveDistance - lastPassSolveDistance ) < this.minIterationChange )  break;

            }
            
            // Update the last pass solve distance
            lastPassSolveDistance = solveDistance;
            
        }

        // Did we get a solution that's better than the starting solution's to the new target location?
        if ( bestSolveDistance < startingDistance ){
            // If so, set the newly found solve distance and solution as the best found.
            this.currentSolveDistance = bestSolveDistance;
            this.bones = bestSolution;
        } else {
            // Did we make things worse? Then we keep our starting distance and solution!
            this.currentSolveDistance = startingDistance;
            this.bones = startingSolution; 
        }
        
        // Update our last base and target locations so we know whether we need to solve for this start/end configuration next time
        this.lastBaseLocation.copy( this.baseLocation );
        this.lastTargetLocation.copy( this.tmpTarget );
        
        return this.currentSolveDistance;

    }

    // -------------------------------
    //
    //      SOLVE IK
    //
    // -------------------------------

    // Solve the IK chain for the given target using the FABRIK algorithm.
    // retun the best solve distance found between the end-effector of this chain and the provided target.

    solveIK( target ) {

        if ( this.numBones === 0 ) return;

        let bone, boneLength, angle, nextBone, startPosition, endPosition, directionUV, baselineUV;
        
        // ---------- Forward pass from end effector to base -----------

        // Loop over all bones in the chain, from the end effector (numBones-1) back to the basebone (0) 
        let i = this.numBones;

        while( i-- ){

            // Get the length of the bone we're working on
            bone = this.bones[i];
            boneLength  = bone.length;
            

            // If we are NOT working on the end effector bone
            if ( i !== this.numBones - 1 ) {

                nextBone = this.bones[i+1];

                // Get the outer-to-inner unit vector of this bone
                directionUV = bone.getDirectionUV().negate();
                
                // Get the outer-to-inner unit vector of the bone further out
                baselineUV = bone.joint.coordinateSystem === J_LOCAL ? nextBone.getDirectionUV().negate() : bone.getGlobalConstraintUV().negated();
                directionUV.constrainedUV( baselineUV, nextBone.joint.min, nextBone.joint.max );

                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
                // so we can set the new inner joint location to be the end joint location of this bone plus the
                // outer-to-inner direction unit vector multiplied by the length of the bone.
                startPosition = bone.end.plus( directionUV.multiplyScalar( boneLength ) );

                // Set the new start joint location for this bone
                bone.setStartLocation( startPosition );

                // If we are not working on the basebone, then we also set the end joint location of
                // the previous bone in the chain (i.e. the bone closer to the base) to be the new
                // start joint location of this bone.
                if ( i > 0 ) this.bones[i-1].setEndLocation( startPosition );
                
            } else { // If we ARE working on the end effector bone...
            
                // Snap the end effector's end location to the target
                bone.setEndLocation( target );

                // update directionUV
                directionUV = bone.getDirectionUV().negate();

                if ( i > 0 ){

                    // The end-effector bone is NOT the basebone as well
                    // Get the outer-to-inner unit vector of the bone further in
                    baselineUV = bone.joint.coordinateSystem === J_LOCAL ? this.bones[i-1].getDirectionUV().negate() : bone.getGlobalConstraintUV().negated();
                    directionUV.constrainedUV( baselineUV, bone.joint.min, bone.joint.max );

                } else {

                    if(bone.joint.coordinateSystem !== J_LOCAL){

                        // Can constrain if constraining against global coordinate system
                        baselineUV = bone.getGlobalConstraintUV().negated();
                        directionUV.constrainedUV( baselineUV, bone.joint.min, bone.joint.max );

                    }

                }
      
                // Calculate the new start joint location as the end joint location plus the outer-to-inner direction UV
                // multiplied by the length of the bone.
                startPosition = bone.end.plus( directionUV.multiplyScalar( boneLength ) );
                
                // Set the new start joint location for this bone to be new start location...
                bone.setStartLocation( startPosition );

                // ...and set the end joint location of the bone further in to also be at the new start location.
                if ( i > 0 ) this.bones[i-1].setEndLocation( startPosition );
                
            }
            
        } // End of forward pass loop over all bones

        // ---------- Step 2 of 2 - Backward pass from base to end effector -----------
 
        for ( i = 0; i < this.numBones; i++ ){

            bone = this.bones[i];
            boneLength  = bone.length;

            // If we are not working on the basebone
            if ( i !== 0 ){

                // Get the inner-to-outer direction of this bone as well as the previous bone to use as a baseline
                directionUV = bone.getDirectionUV();
                // Constrain the angle between this bone and the inner bone.
                baselineUV = bone.joint.coordinateSystem === J_LOCAL ? this.bones[i-1].getDirectionUV() : bone.getGlobalConstraintUV();
                directionUV.constrainedUV( baselineUV, bone.joint.min, bone.joint.max );

                // At this stage we have an inner-to-outer unit vector for this bone which is within our constraints,
                // so we can set the new end location to be the start location of this bone plus the constrained
                // inner-to-outer direction unit vector multiplied by the length of this bone.
                endPosition = bone.start.plus( directionUV.multiplyScalar(boneLength) );

                // Set the new end joint location for this bone
                bone.setEndLocation( endPosition );

                // If we are not working on the end bone, then we set the start joint location of
                // the next bone in the chain (i.e. the bone closer to the end effector) to be the
                // new end joint location of this bone also.
                if ( i < this.numBones-1 ) this.bones[i+1].setStartLocation( endPosition );
                
            } else {// If we ARE working on the base bone...

                // If the base location is fixed then snap the start location of the base bone back to the fixed base
                if ( this.fixedBaseMode ){

                    bone.setStartLocation( this.baseLocation );

                } else {// If the base location is not fixed...
                
                    // ...then set the new base bone start location to be its the end location minus the
                    // bone direction multiplied by the length of the bone (i.e. projected backwards).
                    startPosition = bone.end.minus( bone.getDirectionUV().multiplyScalar( boneLength ) );
                    bone.setStartLocation( startPosition );

                }

                // update directionUV
                directionUV = bone.getDirectionUV();
                
                // If the base bone is unconstrained then process it as usual...
                if ( this.baseboneConstraintType === NONE ){
    
                    // Calculate the new end location as the start location plus the direction multiplyScalar by the length of the bone
                    endPosition = bone.start.plus( directionUV.multiplyScalar( boneLength ) );
    
                    // Set the new end joint location
                    bone.setEndLocation( endPosition );
    
                    // Also, set the start location of the next bone to be the end location of this bone
                    if ( this.numBones > 1 ) this.bones[1].setStartLocation( endPosition );

                } else {

                    // ...otherwise we must constrain it to the basebone constraint unit vector

                    // LOCAL_ABSOLUTE? (i.e. local-space directional constraint) - then we must constraint about the relative basebone constraint UV...
                    baselineUV = this.baseboneConstraintType === LOCAL_ABSOLUTE ? this.baseboneRelativeConstraintUV : this.baseboneConstraintUV;
                    directionUV.constrainedUV( baselineUV, bone.joint.min, bone.joint.max );

                    //directionUV = bone.getDirectionUV();
                    
                    // At this stage we have an inner-to-outer unit vector for this bone which is within our constraints,
                    // so we can set the new end location to be the start location of this bone plus the constrained
                    // inner-to-outer direction unit vector multiplied by the length of the bone.
                    endPosition = bone.start.plus( directionUV.multiplyScalar( boneLength ) );

                    // Set the new end joint location for this bone
                    bone.setEndLocation( endPosition );

                    // If we are not working on the end bone, then we set the start joint location of
                    // the next bone in the chain (i.e. the bone closer to the end effector) to be the
                    // new end joint location of this bone.
                    if ( i < (this.numBones - 1) ) { this.bones[i+1].setStartLocation( endPosition ); }
                    
                
                } // End of basebone constraint enforcement section         

            } // End of base bone handling section

        } // End of backward-pass loop over all bones

        // Update our last target location
        this.lastTargetLocation.copy( target );
                
        // ...and calculate and return the distance between the current effector location and the target.
        return this.bones[this.numBones-1].end.distanceTo( target );

    }

    updateChainLength() {

        // Loop over all the bones in the chain, adding the length of each bone to the mChainLength property
        this.chainLength = 0;
        let i = this.numBones;
        while(i--) this.chainLength += this.bones[i].length;

    }

    cloneBones() {

        // Use clone to create a new Bone with the values from the source Bone.
        let chain = [];
        for ( let i = 0, n = this.bones.length; i < n; i++ ) chain.push( this.bones[i].clone() );
        return chain;

    }

}
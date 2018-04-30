import { NONE, GLOBAL_ABSOLUTE, LOCAL_RELATIVE, LOCAL_ABSOLUTE, END, START, J_LOCAL, J_GLOBAL, MIN_DEGS, MAX_DEGS, MAX_VALUE } from '../constants.js';
import { _Math } from '../math/Math.js';
import { V2 } from '../math/V2.js';
import { Bone2D } from './Bone2D.js';
import { Joint2D } from './Joint2D.js';
import { Tools } from './Tools.js';

 function Chain2D ( color ){

    this.bones = [];
    this.name = '';

    this.mSolveDistanceThreshold = 1.0;
    this.mMaxIterationAttempts = 15;
    this.mMinIterationChange = 0.01;

    this.bonesLength = 0;
    this.mNumBones = 0;

    this.mBaseLocation = new V2();
    this.mFixedBaseMode = true;

    this.mBaseboneConstraintType = NONE;


    this.mBaseboneConstraintUV = new V2();
    this.mBaseboneRelativeConstraintUV = new V2();
    //this.mBaseboneRelativeReferenceConstraintUV = new V2();
    this.mLastTargetLocation = new V2( MAX_VALUE, MAX_VALUE );

    this.mLastBaseLocation =  new V2( MAX_VALUE, MAX_VALUE );

    this.mBoneConnectionPoint = END;
    
    this.mCurrentSolveDistance = MAX_VALUE;
    this.mConnectedChainNumber = -1;
    this.mConnectedBoneNumber = -1;

    this.color = color || 0xFFFFFF;

    this.mEmbeddedTarget = new V2();
    this.mUseEmbeddedTarget = false;

}

Object.assign( Chain2D.prototype, {

    isChain2D: true,

    clone:function(){

        var c = new Chain2D();

        c.bones = this.cloneIkChain();
        c.mBaseLocation.copy( this.mBaseLocation );
        c.mLastTargetLocation.copy( this.mLastTargetLocation );
        c.mLastBaseLocation.copy( this.mLastBaseLocation );
                
        // Copy the basebone constraint UV if there is one to copy
        //if ( !(this.mBaseboneConstraintType === NONE) ){
            c.mBaseboneConstraintUV.copy( this.mBaseboneConstraintUV );
            c.mBaseboneRelativeConstraintUV.copy( this.mBaseboneRelativeConstraintUV );
            //c.mBaseboneRelativeReferenceConstraintUV.copy( this.mBaseboneRelativeReferenceConstraintUV );
        //}       
        
        // Native copy by value for primitive members
        c.mBoneConnectionPoint    = this.mBoneConnectionPoint;
        c.bonesLength             = this.bonesLength;
        c.mNumBones               = this.mNumBones;
        c.mCurrentSolveDistance   = this.mCurrentSolveDistance;
        c.mConnectedChainNumber   = this.mConnectedChainNumber;
        c.mConnectedBoneNumber    = this.mConnectedBoneNumber;
        c.mBaseboneConstraintType = this.mBaseboneConstraintType;

        c.color = this.color;

        c.mEmbeddedTarget    = this.mEmbeddedTarget.clone();
        c.mUseEmbeddedTarget = this.mUseEmbeddedTarget;

        return c;

    },

    

    clear:function(){

        var i = this.mNumBones;
        while(i--){
            this.removeBone(i);
        }

    },

    addBone: function( bone ){

        if( bone.color === null )bone.setColor( this.color );

        // Add the new bone to the end of the ArrayList of bones
        this.bones.push( bone );
        

        // If this is the basebone...
        if ( this.mNumBones === 0 ){
            // ...then keep a copy of the fixed start location...
            this.mBaseLocation.copy( bone.getStartLocation() );
            
            // ...and set the basebone constraint UV to be around the initial bone direction
            this.mBaseboneConstraintUV.copy( bone.getDirectionUV() );

        }

        // Increment the number of bones in the chain and update the chain length
        this.mNumBones ++;
        
        // Increment the number of bones in the chain and update the chain length
        this.updateChainLength();

    },

    removeBone:function( id ){
        if ( id < this.mNumBones ){   
            // ...then remove the bone, decrease the bone count and update the chain length.
            this.bones.splice(id, 1)
            this.mNumBones --;
            this.updateChainLength();
        }
    },


    addConsecutiveBone : function( directionUV, length, clockwiseDegs, anticlockwiseDegs, color ){

        if (this.mNumBones === 0){ Tools.error('Chain is empty ! need first bone'); return };

        if(directionUV.isBone2D){ // first argument is bone

            var bone = directionUV;

            // Validate the direction unit vector - throws an IllegalArgumentException if it has a magnitude of zero
            var dir = bone.getDirectionUV();
            _Math.validateDirectionUV( dir );
            
            // Validate the length of the bone - throws an IllegalArgumentException if it is not a positive value
            var len = bone.length();
            _Math.validateLength( len );

            var prevBoneEnd = this.bones[ this.mNumBones-1 ].getEndLocation();

            bone.setStartLocation( prevBoneEnd );
            bone.setEndLocation( prevBoneEnd.plus(dir.times(len)) );
            
            // Add a bone to the end of this IK chain
            this.addBone( bone );

        } else {
            
            color = color || this.color;
             
            // Validate the direction unit vector - throws an IllegalArgumentException if it has a magnitude of zero
            _Math.validateDirectionUV( directionUV );
            
            // Validate the length of the bone - throws an IllegalArgumentException if it is not a positive value
            _Math.validateLength( length );
                    
            // Get the end location of the last bone, which will be used as the start location of the new bone
            var prevBoneEnd = this.bones[ this.mNumBones-1 ].getEndLocation();
                    
            // Add a bone to the end of this IK chain
            this.addBone( new Bone2D( prevBoneEnd, undefined, directionUV.normalised(), length, clockwiseDegs, anticlockwiseDegs, color ) );
            

        }
        
    },


    // Connect this chain to the specified bone in the specified chain in the provided structure.

    connectToStructure : function( structure, chainNumber, boneNumber ){

        // Sanity check chain exists
        var numChains = structure.getNumChains();
        if (chainNumber > numChains) return;//{ throw new IllegalArgumentException("Structure does not contain a chain " + chainNumber + " - it has " + numChains + " chains."); }
        
        // Sanity check bone exists
        var numBones = structure.getChain( chainNumber ).getNumBones();
        if ( boneNumber > numBones ) return;//{ throw new IllegalArgumentException("Chain does not contain a bone " + boneNumber + " - it has " + numBones + " bones."); }
        
        // All good? Set the connection details
        this.mConnectedChainNumber = chainNumber;
        this.mConnectedBoneNumber  = boneNumber; 

    },

    // -------------------------------
    //      GET
    // -------------------------------

    getBoneConnectionPoint:function(){

        return this.mBoneConnectionPoint;

    },

    

    getEmbeddedTarget:function(){

        return this.mEmbeddedTarget;

    },


    getEmbeddedTargetMode:function(){

        return this.mUseEmbeddedTarget;

    },

    getBaseboneConstraintType:function(){
        return this.mBaseboneConstraintType;
    },
    getBaseboneConstraintUV:function(){
        if ( !(this.mBaseboneConstraintType === NONE) ) return this.mBaseboneConstraintUV;
    },
    getBaseLocation:function(){
        return this.bones[0].getStartLocation();
    },
    getBone:function(id){
        return this.bones[id];
    },
    getChain:function(){
        return this.bones;
    },
    getChainLength:function(){
        return this.bonesLength;
    },
    getConnectedBoneNumber:function(){
        return this.mConnectedBoneNumber;
    },
    getConnectedChainNumber:function(){
        return this.mConnectedChainNumber;
    },
    getEffectorLocation:function(){
        return this.bones[this.mNumBones-1].getEndLocation();
    },
    getLastTargetLocation:function(){
        return this.mLastTargetLocation;
    },
    getLiveChainLength:function(){
        var lng = 0;        
        for (var i = 0; i < this.mNumBones; i++){  
            lng += this.bones[i].liveLength();
        }       
        return lng;
    },
    getName:function(){
        return this.name;
    },
    getNumBones:function(){
        return this.mNumBones;
    },

    /*getBaseboneRelativeReferenceConstraintUV:function(){
        return this.mBaseboneRelativeReferenceConstraintUV;
    },*/

    // -------------------------------
    //      SET
    // -------------------------------

    setColor:function(c){

        this.color = c;
        for (var i = 0; i < this.mNumBones; i++){  
            this.bones[i].setColor( c );
        }
        
    },

    setBaseboneRelativeConstraintUV: function( constraintUV ){ this.mBaseboneRelativeConstraintUV = constraintUV; },
    //setBaseboneRelativeReferenceConstraintUV: function( constraintUV ){ this.mBaseboneRelativeReferenceConstraintUV = constraintUV; },

    setConnectedBoneNumber: function( boneNumber ){

        this.mConnectedBoneNumber = boneNumber;

    },

    setConnectedChainNumber: function( chainNumber ){

        this.mConnectedChainNumber = chainNumber;

    },

    setBoneConnectionPoint: function( point ){

        this.mBoneConnectionPoint = point;

    },

    setBaseboneConstraintUV: function( constraintUV ){

        //if ( this.mBaseboneConstraintType === NONE ) return;
        _Math.validateDirectionUV(constraintUV);

        this.mBaseboneConstraintUV.copy( constraintUV.normalised() );

    },

    setBaseLocation : function( baseLocation ){

        this.mBaseLocation.copy( baseLocation );

    },

    setChain : function( bones ){

        //this.bones = bones;

        this.bones = [];
        var lng = bones.length;
        for(var i = 0; i< lng; i++){
            this.bones[i] = bones[i];
        }

    },

    setBaseboneConstraintType: function( value ){

        this.mBaseboneConstraintType = value;

    },

    setFixedBaseMode: function( value ){

        // Enforce that a chain connected to another chain stays in fixed base mode (i.e. it moves with the chain it's connected to instead of independently)
        if ( !value && this.mConnectedChainNumber !== -1) return;
        if ( this.mBaseboneConstraintType === GLOBAL_ABSOLUTE && !value ) return;
        // Above conditions met? Set the fixedBaseMode
        this.mFixedBaseMode = value;
    },

    setMaxIterationAttempts: function( maxIterations ){

        if (maxIterations < 1) return;
        this.mMaxIterationAttempts = maxIterations;

    },

    setMinIterationChange: function( minIterationChange ){

        if (minIterationChange < 0) return;
        this.mMinIterationChange = minIterationChange;

    },

    setSolveDistanceThreshold: function( solveDistance ){

        if (solveDistance < 0) return;
        this.mSolveDistanceThreshold = solveDistance;

    },



    // -------------------------------
    //
    //      UPDATE TARGET
    //
    // -------------------------------

    solveForEmbeddedTarget : function( ){
        if ( this.mUseEmbeddedTarget ) return this.updateTarget(this.mEmbeddedTarget);
    },

    resetTarget : function( ){
        this.mLastBaseLocation = new V2( MAX_VALUE, MAX_VALUE );
        this.mCurrentSolveDistance = MAX_VALUE;
    },


    // Solve the IK chain for this target to the best of our ability.
    // The end result of running this method is that the IK chain configuration is updated.

    // To minimuse CPU usage, this method dynamically aborts if:
    // - The solve distance (i.e. distance between the end effector and the target) is below the mSolveDistanceThreshold,
    // - A solution incrementally improves on the previous solution by less than the mMinIterationChange, or
    // - The number of attempts to solve the IK chain exceeds the mMaxIterationAttempts.

    updateTarget : function( t ){

        var newTarget = new V2( t.x, t.y );
        // If we have both the same target and base location as the last run then do not solve
        if ( this.mLastTargetLocation.approximatelyEquals( newTarget, 0.001 ) && this.mLastBaseLocation.approximatelyEquals( this.mBaseLocation, 0.001) ) return this.mCurrentSolveDistance;
        
        // Keep starting solutions and distance
        var startingDistance;
        var startingSolution = null;

        // If the base location of a chain hasn't moved then we may opt to keep the current solution if our 
        // best new solution is worse...
        if ( this.mLastBaseLocation.approximatelyEquals( this.mBaseLocation, 0.001) ) {           
            startingDistance  = _Math.distanceBetween( this.bones[this.mNumBones-1].getEndLocation(), newTarget );
            startingSolution = this.cloneIkChain();
        } else {
            // Base has changed? Then we have little choice but to recalc the solution and take that new solution.
            startingDistance = MAX_VALUE;
        }
                        
        // Not the same target? Then we must solve the chain for the new target.
		// We'll start by creating a list of bones to store our best solution
        var bestSolution = [];
        
        // We'll keep track of our best solve distance, starting it at a huge value which will be beaten on first attempt
        var bestSolveDistance = MAX_VALUE;
        var lastPassSolveDistance = MAX_VALUE;
        
        // Allow up to our iteration limit attempts at solving the chain
        var solveDistance;
        //var i = this.mMaxIterationAttempts;
        //while( i-- ){
        for ( var i = 0; i < this.mMaxIterationAttempts; i++ ){   

            // Solve the chain for this target
            solveDistance = this.solveIK( newTarget );
            
            // Did we solve it for distance? If so, update our best distance and best solution, and also
            // update our last pass solve distance. Note: We will ALWAYS beat our last solve distance on the first run. 
            if ( solveDistance < bestSolveDistance ) {   

                bestSolveDistance = solveDistance;
                bestSolution = this.cloneIkChain();
                
                // If we are happy that this solution meets our distance requirements then we can exit the loop now
                if ( solveDistance <= this.mSolveDistanceThreshold ) break;
                
            } else {

                // Did not solve to our satisfaction? Okay...
                // Did we grind to a halt? If so break out of loop to set the best distance and solution that we have
                if ( Math.abs( solveDistance - lastPassSolveDistance ) < this.mMinIterationChange )  break; //System.out.println("Ground to halt on iteration: " + loop);

            }
            
            // Update the last pass solve distance
            lastPassSolveDistance = solveDistance;
            
        }


        // Did we get a solution that's better than the starting solution's to the new target location?
        if ( bestSolveDistance < startingDistance ){
            // If so, set the newly found solve distance and solution as the best found.
            this.mCurrentSolveDistance = bestSolveDistance;
            this.bones = bestSolution;
        } else {
            // Did we make things worse? Then we keep our starting distance and solution!
            this.mCurrentSolveDistance = startingDistance;
            this.bones = startingSolution; 
        }
        
        // Update our last base and target locations so we know whether we need to solve for this start/end configuration next time
        this.mLastBaseLocation.copy( this.mBaseLocation );
        this.mLastTargetLocation.copy( newTarget );
        
        return this.mCurrentSolveDistance;
    },

    // -------------------------------
    //
    //      SOLVE IK
    //
    // -------------------------------

    // Solve the IK chain for the given target using the FABRIK algorithm.
    // retun the best solve distance found between the end-effector of this chain and the provided target.

    solveIK : function( target ){

        if ( this.mNumBones === 0 ) return;

        var bone, boneLength, outerBone;
        
        // ---------- Forward pass from end effector to base -----------

        // Loop over all bones in the chain, from the end effector (numBones-1) back to the basebone (0) 
        var i = this.mNumBones;
        while( i-- ){
            // Get the length of the bone we're working on
            bone = this.bones[i];
            boneLength  = bone.getLength();
            //joint = bone.getJoint();
            //jointType = bone.getJointType();

            // If we are NOT working on the end effector bone
            if ( i != this.mNumBones - 1 ) {

                outerBone = this.bones[ i+1 ];
                // Get the outer-to-inner unit vector of the bone further out
                var outerBoneOuterToInnerUV = outerBone.getDirectionUV().negated();

                // Get the outer-to-inner unit vector of this bone
                var boneOuterToInnerUV = bone.getDirectionUV().negated();

                // Constrain the angle between the outer bone and this bone.
                // Note: On the forward pass we constrain to the limits imposed by joint of the outer bone.
                var clockwiseConstraintDegs     = outerBone.getJoint().getClockwiseConstraintDegs();
                var antiClockwiseConstraintDegs = outerBone.getJoint().getAnticlockwiseConstraintDegs();

                var constrainedUV;
                if ( bone.getJointConstraintCoordinateSystem() === J_LOCAL ){
                    constrainedUV = _Math.getConstrainedUV( boneOuterToInnerUV, outerBoneOuterToInnerUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs);
                } else {// Constraint is in global coordinate system
                    constrainedUV = _Math.getConstrainedUV( boneOuterToInnerUV, bone.getGlobalConstraintUV().negated(), clockwiseConstraintDegs, antiClockwiseConstraintDegs);
                }
                
                
                    
                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
                // so we can set the new inner joint location to be the end joint location of this bone plus the
                // outer-to-inner direction unit vector multiplied by the length of the bone.
                var newStartLocation = bone.getEndLocation().plus( constrainedUV.times( boneLength ) );

                // Set the new start joint location for this bone
                bone.setStartLocation( newStartLocation );

                // If we are not working on the basebone, then we also set the end joint location of
                // the previous bone in the chain (i.e. the bone closer to the base) to be the new
                // start joint location of this bone.
                if (i > 0) this.bones[i-1].setEndLocation( newStartLocation );
                
            } else { // If we ARE working on the end effector bone...
            
                // Snap the end effector's end location to the target
                bone.setEndLocation( target );
                
                // Get the UV between the target / end-location (which are now the same) and the start location of this bone
                var boneOuterToInnerUV = bone.getDirectionUV().negated();

                var constrainedUV;
                if (i > 0) {
                    // The end-effector bone is NOT the basebone as well
                    // Get the outer-to-inner unit vector of the bone further in
                    var innerBoneOuterToInnerUV = this.bones[i-1].getDirectionUV().negated();
              
                    // Constrain the angle between the this bone and the inner bone
                    // Note: On the forward pass we constrain to the limits imposed by the first joint of the inner bone.
                    var clockwiseConstraintDegs     = bone.getJoint().getClockwiseConstraintDegs();
                    var antiClockwiseConstraintDegs = bone.getJoint().getAnticlockwiseConstraintDegs();

                    if ( bone.getJointConstraintCoordinateSystem() === J_LOCAL ){
                        // If this bone is locally constrained...
                        constrainedUV = _Math.getConstrainedUV(boneOuterToInnerUV, innerBoneOuterToInnerUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs);
                    } else {
                        // End effector bone is globally constrained
                        constrainedUV = _Math.getConstrainedUV(boneOuterToInnerUV, bone.getGlobalConstraintUV().negated(), clockwiseConstraintDegs, antiClockwiseConstraintDegs);
                    }
                } else {
                    if ( bone.getJointConstraintCoordinateSystem() === J_LOCAL ){
                        // Don't constraint (nothing to constraint against) if constraint is in local coordinate system
                        constrainedUV = boneOuterToInnerUV;
                    } else {
                        // Can constrain if constraining against global coordinate system
                        constrainedUV = _Math.getConstrainedUV(boneOuterToInnerUV, bone.getGlobalConstraintUV().negated(), clockwiseConstraintDegs, antiClockwiseConstraintDegs);
                    }
                }
                
              
                                                
                // Calculate the new start joint location as the end joint location plus the outer-to-inner direction UV
                // multiplied by the length of the bone.
                var newStartLocation = bone.getEndLocation().plus( constrainedUV.times(boneLength) );
                
                // Set the new start joint location for this bone to be new start location...
                bone.setStartLocation( newStartLocation );

                // ...and set the end joint location of the bone further in to also be at the new start location.
                if (i > 0) this.bones[i-1].setEndLocation( newStartLocation );
                
            }
            
        } // End of forward pass loop over all bones

        // ---------- Step 2 of 2 - Backward pass from base to end effector -----------
 
        for ( i = 0; i < this.mNumBones; i++ ){

            bone = this.bones[i];
            boneLength  = bone.getLength();

            // If we are not working on the basebone
            if ( i !== 0 ){

                var previousBone = this.bones[i-1];
                
                // Get the inner-to-outer direction of this bone as well as the previous bone to use as a baseline
                var BoneInnerToOuterUV = bone.getDirectionUV();
                var prevBoneInnerToOuterUV = previousBone.getDirectionUV();
                
                // Constrain the angle between this bone and the inner bone.
                // Note: On the backward pass we constrain to the limits imposed by the first joint of this bone.
                var clockwiseConstraintDegs     = bone.getJoint().getClockwiseConstraintDegs();
                var antiClockwiseConstraintDegs = bone.getJoint().getAnticlockwiseConstraintDegs();
                
                var constrainedUV;
                if (bone.getJointConstraintCoordinateSystem() === J_LOCAL){
                    constrainedUV = _Math.getConstrainedUV(BoneInnerToOuterUV, prevBoneInnerToOuterUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs);
                } else {
                    // Bone is constrained in global coordinate system
                    constrainedUV = _Math.getConstrainedUV(BoneInnerToOuterUV, bone.getGlobalConstraintUV(), clockwiseConstraintDegs, antiClockwiseConstraintDegs);
                }

                // At this stage we have an inner-to-outer unit vector for this bone which is within our constraints,
                // so we can set the new end location to be the start location of this bone plus the constrained
                // inner-to-outer direction unit vector multiplied by the length of this bone.
                var newEndLocation = bone.getStartLocation().plus( constrainedUV.times(boneLength) );

                // Set the new end joint location for this bone
                bone.setEndLocation(newEndLocation);

                // If we are not working on the end bone, then we set the start joint location of
                // the next bone in the chain (i.e. the bone closer to the end effector) to be the
                // new end joint location of this bone also.
                if (i < this.mNumBones-1) this.bones[i+1].setStartLocation(newEndLocation);
                
            } else {// If we ARE working on the base bone...
               
                // If the base location is fixed then snap the start location of the base bone back to the fixed base
                if (this.mFixedBaseMode){
                    bone.setStartLocation(this.mBaseLocation);
                } else {// If the base location is not fixed...
                
                    // ...then set the new base bone start location to be its the end location minus the
                    // bone direction multiplied by the length of the bone (i.e. projected backwards).
                    //float boneZeroLength = this.bones[0].length();
                    var boneZeroUV = this.bones[0].getDirectionUV();
                    var boneZeroEndLocation = this.bones[0].getEndLocation();
                    var newBoneZeroStartLocation = boneZeroEndLocation.minus( boneZeroUV.times(boneLength) );
                    bone.setStartLocation(newBoneZeroStartLocation);
                }
                
                // If the base bone is unconstrained then process it as usual...
                if ( this.mBaseboneConstraintType === NONE){
                    // Get the inner to outer direction of this bone
                    var BoneInnerToOuterUV = bone.getDirectionUV();
    
                    // Calculate the new end location as the start location plus the direction times the length of the bone
                    var newEndLocation = bone.getStartLocation().plus( BoneInnerToOuterUV.times(boneLength) );
    
                    // Set the new end joint location
                    bone.setEndLocation(newEndLocation);
    
                    // Also, set the start location of the next bone to be the end location of this bone
                    if (this.mNumBones > 1) this.bones[1].setStartLocation(newEndLocation);

                } else {

                    // ...otherwise we must constrain it to the basebone constraint unit vector
                   
                    // Note: The mBaseBoneConstraintUV is either fixed, or it may be dynamically updated from
                    // a FabrikStructure2D if this chain is connected to another chain.
                    
                    // Get the inner-to-outer direction of this bone
                    var BoneInnerToOuterUV = bone.getDirectionUV();

                    // Get the constrained direction unit vector between the base bone and the base bone constraint unit vector
                    // Note: On the backward pass we constrain to the limits imposed by the first joint of this bone.
                    var clockwiseConstraintDegs     = bone.getJoint().getClockwiseConstraintDegs();
                    var antiClockwiseConstraintDegs = bone.getJoint().getAnticlockwiseConstraintDegs();
                    
                    // LOCAL_ABSOLUTE? (i.e. local-space directional constraint) - then we must constraint about the relative basebone constraint UV...
                    var constrainedUV;

                    if ( this.mBaseboneConstraintType === LOCAL_ABSOLUTE ){
                        constrainedUV = _Math.getConstrainedUV( BoneInnerToOuterUV, this.mBaseboneRelativeConstraintUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs);
                        
                    } else {
                        // ...otherwise we're free to use the standard basebone constraint UV.
                        constrainedUV = _Math.getConstrainedUV( BoneInnerToOuterUV, this.mBaseboneConstraintUV, clockwiseConstraintDegs, antiClockwiseConstraintDegs );
                    }
                    
                    // At this stage we have an inner-to-outer unit vector for this bone which is within our constraints,
                    // so we can set the new end location to be the start location of this bone plus the constrained
                    // inner-to-outer direction unit vector multiplied by the length of the bone.
                    var newEndLocation = bone.getStartLocation().plus( constrainedUV.times(boneLength) );

                    // Set the new end joint location for this bone
                    bone.setEndLocation( newEndLocation );

                    // If we are not working on the end bone, then we set the start joint location of
                    // the next bone in the chain (i.e. the bone closer to the end effector) to be the
                    // new end joint location of this bone.
                    if (i < (this.mNumBones - 1)) { this.bones[i+1].setStartLocation( newEndLocation ); }
                    
                
                } // End of basebone constraint enforcement section         

            } // End of base bone handling section

        } // End of backward-pass loop over all bones

        // Update our last target location
        this.mLastTargetLocation.copy( target );
                
        // Finally, get the current effector location...
        var currentEffectorLocation = this.bones[this.mNumBones-1].getEndLocation();
                
        // ...and calculate and return the distance between the current effector location and the target.
        return _Math.distanceBetween( currentEffectorLocation, target );
    },

    updateChainLength : function(){

        // Loop over all the bones in the chain, adding the length of each bone to the mChainLength property
        this.bonesLength = 0;
        var i = this.mNumBones;
        while(i--) this.bonesLength += this.bones[i].getLength();

    },

    cloneIkChain : function(){

        // How many bones are in this chain?
        var numBones = this.bones.length;
        
        // Create a new Array
        var clonedChain = [];

        // For each bone in the chain being cloned...       
        for (var i = 0; i < numBones; i++){
            // Use the copy constructor to create a new Bone with the values set from the source Bone.
            // and add it to the cloned chain.
            clonedChain.push( this.bones[i].clone() );
        }
        
        return clonedChain;

    }


// end

} );

export { Chain2D };
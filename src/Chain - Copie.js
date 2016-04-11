

Fullik.Chain = function( source ){

    this.mChain = [];
    this.name = '';

    this.mSolveDistanceThreshold = 0.1;
    this.mMaxIterationAttempts = 20;
    this.mMinIterationChange = 0.01;

    this.mChainLength = 0;
    this.mNumBones = 0;

    this.mFixedBaseLocation = new Fullik.V3();
    this.mFixedBaseMode = true;

    this.mBaseboneConstraintType = Fullik.BB_NONE;

    this.mBaseboneConstraintUV = new Fullik.V3();
    this.mBaseboneRelativeConstraintUV = new Fullik.V3();
    this.mBaseboneRelativeReferenceConstraintUV = new Fullik.V3();
    this.mLastTargetLocation = new Fullik.V3( Fullik.MAX_VALUE, Fullik.MAX_VALUE, Fullik.MAX_VALUE );
    //this.mConstraintLineWidth = 2.0;

    this.mLastBaseLocation =  new Fullik.V3( Fullik.MAX_VALUE, Fullik.MAX_VALUE, Fullik.MAX_VALUE );
    this.mCurrentSolveDistance = Fullik.MAX_VALUE;
    this.mConnectedChainNumber = -1;
    this.mConnectedBoneNumber = -1;

    if( source!==undefined ){
        this.mChain = source.cloneIkChain();
        
        this.mFixedBaseLocation.copy( source.mFixedBaseLocation )//.clone();
        this.mLastTargetLocation.copy( source.mLastTargetLocation )//.clone();
        this.mLastBaseLocation.copy( source.mLastBaseLocation )//.clone();
                
        // Copy the basebone constraint UV if there is one to copy
        if ( source.mBaseboneConstraintType !== Fullik.BB_NONE ){
            this.mBaseboneConstraintUV.copy( source.mBaseboneConstraintUV )//.clone();
            this.mBaseboneRelativeConstraintUV.copy( source.mBaseboneRelativeConstraintUV )//.clone();
        }       
        
        // Native copy by value for primitive members
        this.mChainLength            = source.mChainLength;
        this.mNumBones               = source.mNumBones;
        this.mCurrentSolveDistance   = source.mCurrentSolveDistance;
        this.mConnectedChainNumber   = source.mConnectedChainNumber;
        this.mConnectedBoneNumber    = source.mConnectedBoneNumber;
        this.mBaseboneConstraintType = source.mBaseboneConstraintType;           
        this.name                   = source.name;
        //this.mConstraintLineWidth    = source.mConstraintLineWidth;

    }
  
}

Fullik.Chain.prototype = {

    constructor: Fullik.Chain,

    /*addBone3D: function( size, color ){

        size = size || {x:1, y:1, z:defaultBoneLength }
        color = color || 0XFFFF00;
        var g = new THREE.BoxBufferGeometry( size.x, size.y, size.z );
        g.applyMatrix( new THREE.Matrix4().makeTranslation( size.x === 1 ? 0: size.x*0.5, size.y === 1 ? 0: size.y*0.5, size.z === 1 ? 0: size.z*0.5 ) )
        b = new THREE.Mesh( g,  new THREE.MeshStandardMaterial({color:color}) );
        this.scene.add( b );

        return b;
        
    },*/


    clear:function(){

        var i = this.mNumBones;
        while(i--){
            this.removeBone(i);
        }

    },

    addBone: function( bone ){

        // Add the new bone to the end of the ArrayList of bones
        this.mChain.push( bone );//.add( bone );

        // If this is the basebone...
        if ( this.mNumBones === 0 ){
            // ...then keep a copy of the fixed start location...
            this.mFixedBaseLocation.copy(bone.getStartLocation());//.clone();
            
            // ...and set the basebone constraint UV to be around the initial bone direction
            this.mBaseboneConstraintUV.copy(bone.getDirectionUV());
        }
        
        // Increment the number of bones in the chain and update the chain length
        this.mNumBones ++;
        this.updateChainLength();

    },

    removeBone:function( id ){
        if (id < this.mNumBones){   
            // ...then remove the bone, decrease the bone count and update the chain length.
            this.mChain.splice(id, 1)//remove(boneNumber);
            this.mNumBones --;
            this.updateChainLength();
        }
    },

    addConsecutiveBone : function( directionUV, length ){
         //this.addConsecutiveBone( directionUV, length )
         if (this.mNumBones > 0) {               
            // Get the end location of the last bone, which will be used as the start location of the new bone
            var prevBoneEnd = this.mChain[this.mNumBones-1].getEndLocation();//.clone();
                
            // Add a bone to the end of this IK chain
            // Note: We use a normalised version of the bone direction
            this.addBone( new Fullik.Bone( prevBoneEnd, undefined, directionUV.normalised(), length ) );
        }

    },

    addConsecutiveFreelyRotatingHingedBone : function ( directionUV, length, jointType, hingeRotationAxis ){

        this.addConsecutiveHingedBone( directionUV, length, jointType, hingeRotationAxis, 180.0, 180.0, Fullik.genPerpendicularVectorQuick( hingeRotationAxis ) );

    },

    addConsecutiveHingedBone: function( directionUV, length, jointType, hingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis ){
        // Cannot add a consectuive bone of any kind if the there is no basebone
        if (this.mNumBones === 0) return;

        // Normalise the direction and hinge rotation axis 
        directionUV.normalize();
        hingeRotationAxis.normalize();
            
        // Get the end location of the last bone, which will be used as the start location of the new bone
        var prevBoneEnd = this.mChain[this.mNumBones-1].getEndLocation();//.clone();
            
        // Create a bone
        var bone = new Fullik.Bone( prevBoneEnd, undefined, directionUV, length );
        
        // ...then create and set up a joint which we'll apply to that bone.
        var joint = new Fullik.Joint();
        switch (jointType){
            case Fullik.J_GLOBAL_HINGE:
                joint.setAsGlobalHinge( hingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis);
                break;
            case Fullik.J_LOCAL_HINGE:
                joint.setAsLocalHinge( hingeRotationAxis, clockwiseDegs, anticlockwiseDegs, hingeReferenceAxis);
                break;
            default:
                //throw new IllegalArgumentException("Hinge joint types may be only Fullik.J_GLOBAL_HINGE or Fullik.J_LOCAL_HINGE.");
        }
        
        // Set the joint we just set up on the the new bone we just created
        bone.setJoint( joint );
        
        // Finally, add the bone to this chain
        this.addBone( bone );

        //console.log('good')

    },

    addConsecutiveRotorConstrainedBone:function( boneDirectionUV, boneLength, constraintAngleDegs ){

        if (this.mNumBones === 0) return;

        // Create the bone starting at the end of the previous bone, set its direction, constraint angle and colour
        // then add it to the chain. Note: The default joint type of a new FullikBone3D is Fullik.J_BALL.
        var bone = new Fullik.Bone( this.mChain[ this.mNumBones-1 ].getEndLocation(), undefined , boneDirectionUV.normalize(), boneLength );
        bone.setBallJointConstraintDegs( constraintAngleDegs );
        this.addBone( bone );

    },

    // -------------------------------
    //
    //      GET
    //
    // -------------------------------

    getBaseboneConstraintType:function(){
        return this.mBaseboneConstraintType;
    },
    getBaseboneConstraintUV:function(){
        if (this.mBaseboneConstraintType !== Fullik.BB_NONE ) return this.mBaseboneConstraintUV;
    },
    getBaseLocation:function(){
        return this.mChain[0].getStartLocation();
    },
    getBone:function(id){
        return this.mChain[id];
    },
    getChain:function(){
        return this.mChain;
    },
    getChainLength:function(){
        return this.mChainLength;
    },
    getConnectedBoneNumber:function(){
        return this.mConnectedBoneNumber;
    },
    getConnectedChainNumber:function(){
        return this.mConnectedChainNumber;
    },
    getEffectorLocation:function(){
        return this.mChain[this.mNumBones-1].getEndLocation();
    },
    getLastTargetLocation:function(){
        return this.mLastTargetLocation;
    },
    getLiveChainLength:function(){
        var lng = 0;        
        for (var i = 0; i < this.mNumBones; i++){  
            lng += this.mChain[i].liveLength();
        }       
        return lng;
    },
    getName:function(){
        return this.name;
    },
    getNumBones:function(){
        return this.mNumBones;
    },

    getBaseboneRelativeReferenceConstraintUV:function(){
        return this.mBaseboneRelativeReferenceConstraintUV;
    },

    // -------------------------------
    //
    //      SET
    //
    // -------------------------------

    setBaseboneRelativeConstraintUV: function( constraintUV ){ this.mBaseboneRelativeConstraintUV = constraintUV; },
    setBaseboneRelativeReferenceConstraintUV: function( constraintUV ){ this.mBaseboneRelativeReferenceConstraintUV = constraintUV; },

    setRotorBaseboneConstraint : function( rotorType, constraintAxis, angleDegs ){

        // Sanity checking
        if (this.mNumBones === 0) return;// throw new RuntimeException("Chain must contain a basebone before we can specify the basebone constraint type.");       
        if ( !(constraintAxis.length() > 0) ) return;//  throw new IllegalArgumentException("Constraint axis cannot be zero.");                                             
        if (angleDegs < 0  ) angleDegs = 0;                                                                                                  
        if (angleDegs > 180) angleDegs = 180;                                                                                                    
        //if ( rotorType != Fullik.BB_GLOBAL_ROTOR || rotorType != Fullik.BB_LOCAL_ROTOR ) return;//throw new IllegalArgumentException("The only valid rotor types for this method are GLOBAL_ROTOR and LOCAL_ROTOR.");
                
        // Set the constraint type, axis and angle
        this.mBaseboneConstraintType = rotorType;
        this.mBaseboneConstraintUV   = constraintAxis.normalised();
        this.mBaseboneRelativeConstraintUV.copy( this.mBaseboneConstraintUV );
        this.getBone(0).getJoint().setAsBallJoint( angleDegs );

        console.log("apply")

    },

    setHingeBaseboneConstraint : function( hingeType, hingeRotationAxis, cwConstraintDegs, acwConstraintDegs, hingeReferenceAxis ){

        // Sanity checking
        if ( this.mNumBones === 0)  return;// throw new RuntimeException("Chain must contain a basebone before we can specify the basebone constraint type.");       
        if ( !( hingeRotationAxis.length() > 0) ) return;// throw new IllegalArgumentException("Hinge rotation axis cannot be zero.");            
        if ( !( hingeReferenceAxis.length() > 0) ) return;// throw new IllegalArgumentException("Hinge reference axis cannot be zero.");            
        if ( !( Fullik.perpendicular( hingeRotationAxis, hingeReferenceAxis ) ) ) return;// throw new IllegalArgumentException("The hinge reference axis must be in the plane of the hinge rotation axis, that is, they must be perpendicular."); 
        if ( hingeType !== Fullik.BB_GLOBAL_HINGE || hingeType !== Fullik.BB_LOCAL_HINGE ) return;//throw new IllegalArgumentException("The only valid hinge types for this method are GLOBAL_HINGE and LOCAL_HINGE.");
        
        // Set the constraint type, axis and angle
        this.mBaseboneConstraintType = hingeType;
        this.mBaseboneConstraintUV.copy( hingeRotationAxis.normalised() );
        
        var hinge = new Fullik.Joint();
        
        if (hingeType === Fullik.BB_GLOBAL_HINGE ) hinge.setHinge( Fullik.J_GLOBAL_HINGE, hingeRotationAxis, cwConstraintDegs, acwConstraintDegs, hingeReferenceAxis );
        else hinge.setHinge( Fullik.J_LOCAL_HINGE, hingeRotationAxis, cwConstraintDegs, acwConstraintDegs, hingeReferenceAxis );
        
        this.getBone(0).setJoint( hinge );

    },

    setFreelyRotatingGlobalHingedBasebone : function( hingeRotationAxis ){

        this.setHingeBaseboneConstraint( Fullik.BB_GLOBAL_HINGE, hingeRotationAxis, 180, 180, Fullik.genPerpendicularVectorQuick( hingeRotationAxis ) );
    },

    setFreelyRotatingLocalHingedBasebone : function( hingeRotationAxis ){

        this.setHingeBaseboneConstraint( Fullik.BB_LOCAL_HINGE, hingeRotationAxis, 180, 180, Fullik.genPerpendicularVectorQuick( hingeRotationAxis ) );
    },

    setLocalHingedBasebone : function( hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis ){

        this.setHingeBaseboneConstraint( Fullik.BB_LOCAL_HINGE, hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );
    },

    setGlobalHingedBasebone : function( hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis ){

        this.setHingeBaseboneConstraint( Fullik.BB_GLOBAL_HINGE, hingeRotationAxis, cwDegs, acwDegs, hingeReferenceAxis );
    },

    setBaseboneConstraintUV : function( constraintUV ){

        if ( this.mBaseboneConstraintType === Fullik.BB_NONE ) return;

        this.constraintUV.normalize();
        this.mBaseboneConstraintUV.copy( constraintUV );

    },

    setBaseLocation : function( baseLocation ){

        this.mFixedBaseLocation.copy( baseLocation );
    },

    setChain : function( chain ){

        this.mChain = chain;
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

    setFixedBaseMode : function( value ){

        // Enforce that a chain connected to another chain stays in fixed base mode (i.e. it moves with the chain it's connected to instead of independently)
        if ( !value && this.mConnectedChainNumber !== -1) return;
        if ( this.mBaseboneConstraintType == Fullik.BB_GLOBAL_ROTOR && !value ) return;
        // Above conditions met? Set the fixedBaseMode
        this.mFixedBaseMode = value;
    },

    setMaxIterationAttempts : function( maxIterations ){

        if (maxIterations < 1) return;
        this.mMaxIterationAttempts = maxIterations;

    },

    setMinIterationChange : function( minIterationChange ){

        if (minIterationChange < 0) return;
        this.mMinIterationChange = minIterationChange;

    },

    setSolveDistanceThreshold : function( solveDistance ){

        if (solveDistance < 0) return;
        this.mSolveDistanceThreshold = solveDistance;

    },



    // -------------------------------
    //
    //      UPDATE TARGET
    //
    // -------------------------------


    // Method to solve this IK chain for the given target location.
    // The end result of running this method is that the IK chain configuration is updated.

    // To minimuse CPU usage, this method dynamically aborts if:
    // - The solve distance (i.e. distance between the end effector and the target) is below the mSolveDistanceThreshold,
    // - A solution incrementally improves on the previous solution by less than the mMinIterationChange, or
    // - The number of attempts to solve the IK chain exceeds the mMaxIterationAttempts.

    updateTarget : function( t ){

        var newTarget = new Fullik.V3( t.x, t.y, t.z );//.copy(t);//( newTarget.x, newTarget.y, newTarget.z );
        // If we have both the same target and base location as the last run then do not solve
        if ( this.mLastTargetLocation.approximatelyEquals( newTarget, 0.001) && this.mLastBaseLocation.approximatelyEquals( this.getBaseLocation(), 0.001) ) return this.mCurrentSolveDistance;
        
        /*
         * NOTE: We must allow the best solution of THIS run to be used for a new target or base location - we cannot
         * just use the last solution (even if it's better) - because that solution was for a different target / base
         * location combination and NOT for the current setup.
         */
                        
        // Declare a list of bones to use to store our best solution
        var bestSolution = [];
        
        // We start with a best solve distance that can be easily beaten
        var bestSolveDistance = Fullik.MAX_VALUE;
        
        // We'll also keep track of the solve distance from the last pass
        var lastPassSolveDistance = Fullik.MAX_VALUE;
        
        // Allow up to our iteration limit attempts at solving the chain
        var solveDistance;
        for ( var i = 0; i < this.mMaxIterationAttempts; i++ ){   

            // Solve the chain for this target
            solveDistance = this.solveIK( newTarget );

            //console.log(solveDistance)
            
            // Did we solve it for distance? If so, update our best distance and best solution, and also
            // update our last pass solve distance. Note: We will ALWAYS beat our last solve distance on the first run. 
            if ( solveDistance < bestSolveDistance ) {   

                bestSolveDistance = solveDistance;
                bestSolution = this.cloneIkChain();
                
                // If we are happy that this solution meets our distance requirements then we can exit the loop now
                if ( solveDistance < this.mSolveDistanceThreshold ) break;
                
            } else {// Did not solve to our satisfaction? Okay...
            
                // Did we grind to a halt? If so break out of loop to set the best distance and solution that we have
                if ( Math.abs( solveDistance - lastPassSolveDistance ) < this.mMinIterationChange )  break; //System.out.println("Ground to halt on iteration: " + loop);

            }
            
            // Update the last pass solve distance
            lastPassSolveDistance = solveDistance;
            
        } // End of loop
        
        // Update our solve distance and chain configuration to the best solution found
        this.mCurrentSolveDistance = bestSolveDistance;
        this.mChain = bestSolution;

        //console.log('dddddd' , this.mChain )
        
        // Update our base and target locations
        this.mLastBaseLocation.copy( this.getBaseLocation() );
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

        //var i;

        // Sanity check that there are bones in the chain
        if ( this.mNumBones === 0 ) return;
        
        // ---------- Forward pass from end effector to base -----------

        // Loop over all bones in the chain, from the end effector (numBones-1) back to the basebone (0) 
        var i = this.mNumBones;
        while( i-- ){      
        //for ( i = this.mNumBones-1; i >= 0; i-- ){
            // Get the length of the bone we're working on
            var thisBone = this.mChain[i];
            var thisBoneLength  = thisBone.getLength();
            var thisBoneJoint = thisBone.getJoint();
            var thisBoneJointType = thisBone.getJointType();

            // If we are NOT working on the end effector bone
            if ( i != this.mNumBones - 1 ) {
                // Get the outer-to-inner unit vector of the bone further out
                var outerBoneOuterToInnerUV = this.mChain[ i+1 ].getDirectionUV().negated();

                // Get the outer-to-inner unit vector of this bone
                var thisBoneOuterToInnerUV = thisBone.getDirectionUV().negated();
                
                // Get the joint type for this bone and handle constraints on thisBoneInnerToOuterUV
                
                if ( thisBoneJointType === Fullik.J_BALL ) { 

                    // Constrain to relative angle between this bone and the outer bone if required
                    var angleBetweenDegs    = Fullik.getAngleBetweenDegs( outerBoneOuterToInnerUV, thisBoneOuterToInnerUV );
                    var constraintAngleDegs = thisBoneJoint.getBallJointConstraintDegs();
                    if ( angleBetweenDegs > constraintAngleDegs ){   
                        thisBoneOuterToInnerUV = Fullik.getAngleLimitedUnitVectorDegs( thisBoneOuterToInnerUV, outerBoneOuterToInnerUV, constraintAngleDegs );
                    }
                }
                else if ( thisBoneJointType === Fullik.J_GLOBAL_HINGE ) {  

                    // Project this bone outer-to-inner direction onto the hinge rotation axis
                    // Note: The returned vector is normalised.
                    thisBoneOuterToInnerUV = thisBoneOuterToInnerUV.projectOnPlane( thisBoneJoint.getHingeRotationAxis() ); 
                    
                    // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.
                }
                else if ( thisBoneJointType === Fullik.J_LOCAL_HINGE ) {   
                    // Not a basebone? Then construct a rotation matrix based on the previous bones inner-to-to-inner direction...
                    var m; // M3
                    var relativeHingeRotationAxis; // V3
                    if ( i > 0 ) {
                        m = Fullik.createRotationMatrix( this.mChain[i-1].getDirectionUV() );
                        relativeHingeRotationAxis = m.timesV3( thisBoneJoint.getHingeRotationAxis() ).normalize();
                    } else {// ...basebone? Need to construct matrix from the relative constraint UV.
                        relativeHingeRotationAxis = this.mBaseboneRelativeConstraintUV;
                    }
                    
                    // ...and transform the hinge rotation axis into the previous bones frame of reference.
                    //Vec3f 
                                        
                    // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                    // Note: The returned vector is normalised.                 
                    thisBoneOuterToInnerUV = thisBoneOuterToInnerUV.projectOnPlane( relativeHingeRotationAxis );
                                        
                    // NOTE: Constraining about the hinge reference axis on this forward pass leads to poor solutions... so we won't.                                       
                }
                    
                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
                // so we can set the new inner joint location to be the end joint location of this bone plus the
                // outer-to-inner direction unit vector multiplied by the length of the bone.
                var newStartLocation = thisBone.getEndLocation().plus( thisBoneOuterToInnerUV.times( thisBoneLength ) );

                // Set the new start joint location for this bone
                thisBone.setStartLocation( newStartLocation );

                // If we are not working on the basebone, then we also set the end joint location of
                // the previous bone in the chain (i.e. the bone closer to the base) to be the new
                // start joint location of this bone.
                if (i > 0) this.mChain[i-1].setEndLocation( newStartLocation );
                
            } else { // If we ARE working on the end effector bone...
            
                // Snap the end effector's end location to the target
                thisBone.setEndLocation( target );
                
                // Get the UV between the target / end-location (which are now the same) and the start location of this bone
                var thisBoneOuterToInnerUV = thisBone.getDirectionUV().negated();
                
                // If the end effector is global hinged then we have to snap to it, then keep that
                // resulting outer-to-inner UV in the plane of the hinge rotation axis
                switch ( thisBoneJointType ) {
                    case Fullik.J_BALL:
                        // Ball joints do not get constrained on this forward pass
                        break;                      
                    case Fullik.J_GLOBAL_HINGE:
                        // Global hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane
                        thisBoneOuterToInnerUV = thisBoneOuterToInnerUV.projectOnPlane( thisBoneJoint.getHingeRotationAxis() );
                        break;
                    case Fullik.J_LOCAL_HINGE:
                        // Local hinges get constrained to the hinge rotation axis, but not the reference axis within the hinge plane
                        
                        // Construct a rotation matrix based on the previous bones inner-to-to-inner direction...
                        var m = Fullik.createRotationMatrix( this.mChain[i-1].getDirectionUV() );
                        
                        // ...and transform the hinge rotation axis into the previous bones frame of reference.
                        var relativeHingeRotationAxis = m.timesV3( thisBoneJoint.getHingeRotationAxis() ).normalize();
                                            
                        // Project this bone's outer-to-inner direction onto the plane described by the relative hinge rotation axis
                        // Note: The returned vector is normalised.                 
                        thisBoneOuterToInnerUV = thisBoneOuterToInnerUV.projectOnPlane( relativeHingeRotationAxis );
                        break;
                }
                                                
                // Calculate the new start joint location as the end joint location plus the outer-to-inner direction UV
                // multiplied by the length of the bone.
                var newStartLocation = target.plus( thisBoneOuterToInnerUV.times( thisBoneLength ) );
                
                // Set the new start joint location for this bone to be new start location...
                thisBone.setStartLocation( newStartLocation );

                // ...and set the end joint location of the bone further in to also be at the new start location (if there IS a bone
                // further in - this may be a single bone chain)
                if (i > 0) this.mChain[i-1].setEndLocation( newStartLocation );
                
            }
            
        } // End of forward pass

        // ---------- Backward pass from base to end effector -----------
 
        for ( i = 0; i < this.mNumBones; i++){

            var thisBone = this.mChain[i];
            var thisBoneLength  = thisBone.getLength();

            // If we are not working on the basebone
            if (i != 0){
                // Get the inner-to-outer direction of this bone as well as the previous bone to use as a baseline
                var thisBoneInnerToOuterUV = thisBone.getDirectionUV();
                var prevBoneInnerToOuterUV = this.mChain[i-1].getDirectionUV();
                
                // Dealing with a ball joint?
                var thisBoneJoint = thisBone.getJoint();
                var jointType = thisBoneJoint.getJointType();

                if ( jointType === Fullik.J_BALL ){                   
                    var angleBetweenDegs    = Fullik.getAngleBetweenDegs( prevBoneInnerToOuterUV, thisBoneInnerToOuterUV );
                    var constraintAngleDegs = thisBoneJoint.getBallJointConstraintDegs(); 
                    
                    // Keep this bone direction constrained within the rotor about the previous bone direction
                    if (angleBetweenDegs > constraintAngleDegs){
                        thisBoneInnerToOuterUV = Fullik.getAngleLimitedUnitVectorDegs( thisBoneInnerToOuterUV, prevBoneInnerToOuterUV, constraintAngleDegs );
                    }
                }
                else if ( jointType === Fullik.J_GLOBAL_HINGE ) {                   
                    // Get the hinge rotation axis and project our inner-to-outer UV onto it
                    var hingeRotationAxis  = thisBoneJoint.getHingeRotationAxis();
                    thisBoneInnerToOuterUV = thisBoneInnerToOuterUV.projectOnPlane(hingeRotationAxis);
                    
                    // If there are joint constraints, then we must honour them...
                    var cwConstraintDegs   = -thisBoneJoint.getHingeClockwiseConstraintDegs();
                    var acwConstraintDegs  =  thisBoneJoint.getHingeAnticlockwiseConstraintDegs();

                    if ( !( Fullik.nearEquals( cwConstraintDegs, -Fullik.MAX_ANGLE_DEGS, 0.001 ) ) && !( Fullik.nearEquals( acwConstraintDegs, Fullik.MAX_ANGLE_DEGS, 0.001 ) ) ) {

                        var hingeReferenceAxis =  thisBoneJoint.getHingeReferenceAxis();
                        
                        // Get the signed angle (about the hinge rotation axis) between the hinge reference axis and the hinge-rotation aligned bone UV
                        // Note: ACW rotation is positive, CW rotation is negative.
                        var signedAngleDegs = Fullik.getSignedAngleBetweenDegs( hingeReferenceAxis, thisBoneInnerToOuterUV, hingeRotationAxis );
                        
                        // Make our bone inner-to-outer UV the hinge reference axis rotated by its maximum clockwise or anticlockwise rotation as required
                        if (signedAngleDegs > acwConstraintDegs) thisBoneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, acwConstraintDegs, hingeRotationAxis ).normalised();
                        else if (signedAngleDegs < cwConstraintDegs) thisBoneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, cwConstraintDegs, hingeRotationAxis ).normalised();
                        
                    }
                }
                else if ( jointType === Fullik.J_LOCAL_HINGE ){   
                    // Transform the hinge rotation axis to be relative to the previous bone in the chain
                    var hingeRotationAxis  = thisBoneJoint.getHingeRotationAxis();
                    
                    // Construct a rotation matrix based on the previous bone's direction
                    var m = Fullik.createRotationMatrix( prevBoneInnerToOuterUV );
                    
                    // Transform the hinge rotation axis into the previous bone's frame of reference
                    var relativeHingeRotationAxis  = m.timesV3( hingeRotationAxis ).normalize();
                    
                    
                    // Project this bone direction onto the plane described by the hinge rotation axis
                    // Note: The returned vector is normalised.
                    thisBoneInnerToOuterUV = thisBoneInnerToOuterUV.projectOnPlane( relativeHingeRotationAxis );
                    
                    // Constrain rotation about reference axis if required
                    var cwConstraintDegs   = -thisBoneJoint.getHingeClockwiseConstraintDegs();
                    var acwConstraintDegs  =  thisBoneJoint.getHingeAnticlockwiseConstraintDegs();
                    if ( !( Fullik.nearEquals( cwConstraintDegs, -Fullik.MAX_ANGLE_DEGS, 0.001 ) ) && !( Fullik.nearEquals( acwConstraintDegs, Fullik.MAX_ANGLE_DEGS, 0.001 ) ) ) {

                        // Calc. the reference axis in local space
                        //Vec3f relativeHingeReferenceAxis = mBaseboneRelativeReferenceConstraintUV;//m.times( thisBoneJoint.getHingeReferenceAxis() ).normalise();
                        var relativeHingeReferenceAxis = m.timesV3( thisBoneJoint.getHingeReferenceAxis() ).normalize();
                        
                        // Get the signed angle (about the hinge rotation axis) between the hinge reference axis and the hinge-rotation aligned bone UV
                        // Note: ACW rotation is positive, CW rotation is negative.
                        var signedAngleDegs = Fullik.getSignedAngleBetweenDegs(relativeHingeReferenceAxis, thisBoneInnerToOuterUV, relativeHingeRotationAxis);
                        
                        // Make our bone inner-to-outer UV the hinge reference axis rotated by its maximum clockwise or anticlockwise rotation as required
                        if (signedAngleDegs > acwConstraintDegs) thisBoneInnerToOuterUV = Fullik.rotateAboutAxisDegs( relativeHingeReferenceAxis, acwConstraintDegs, relativeHingeRotationAxis ).normalize();
                        else if (signedAngleDegs < cwConstraintDegs) thisBoneInnerToOuterUV = Fullik.rotateAboutAxisDegs( relativeHingeReferenceAxis, cwConstraintDegs, relativeHingeRotationAxis ).normalize();                            
                        
                    }
                    
                } // End of local hinge section
                
                // At this stage we have a outer-to-inner unit vector for this bone which is within our constraints,
                // so we can set the new inner joint location to be the end joint location of this bone plus the
                // outer-to-inner direction unit vector multiplied by the length of the bone.
                var newEndLocation = thisBone.getStartLocation().plus( thisBoneInnerToOuterUV.times( thisBoneLength ) );

                // Set the new start joint location for this bone
                thisBone.setEndLocation( newEndLocation );

                // If we are not working on the end effector bone, then we set the start joint location of the next bone in
                // the chain (i.e. the bone closer to the target) to be the new end joint location of this bone.
                if (i < (this.mNumBones - 1)) { this.mChain[i+1].setStartLocation( newEndLocation ); }

            } else { // If we ARE working on the basebone...
               
                // If the base location is fixed then snap the start location of the basebone back to the fixed base...
                if (this.mFixedBaseMode){
                    thisBone.setStartLocation( this.mFixedBaseLocation );
                } else { // ...otherwise project it backwards from the end to the start by its length.
                
                    thisBone.setStartLocation( thisBone.getEndLocation().minus( thisBone.getDirectionUV().times( thisBoneLength ) ) );
                }
                
                // If the basebone is unconstrained then process it as usual...
                if ( this.mBaseboneConstraintType === Fullik.BB_NONE ) {
                    // Set the new end location of this bone, and if there are more bones,
                    // then set the start location of the next bone to be the end location of this bone
                    var newEndLocation = thisBone.getStartLocation().plus( thisBone.getDirectionUV().times( thisBoneLength ) );
                    thisBone.setEndLocation( newEndLocation );    
                    
                    if ( this.mNumBones > 1 ) { this.mChain[1].setStartLocation( newEndLocation ); }
                } else {// ...otherwise we must constrain it to the basebone constraint unit vector
                  
                    if ( this.mBaseboneConstraintType === Fullik.BB_GLOBAL_ROTOR ){   
                        // Get the inner-to-outer direction of this bone
                        var thisBoneInnerToOuterUV = thisBone.getDirectionUV();
                                
                        var angleBetweenDegs    = Fullik.getAngleBetweenDegs( this.mBaseboneConstraintUV, thisBoneInnerToOuterUV );
                        var constraintAngleDegs = thisBone.getBallJointConstraintDegs(); 
                    
                        if ( angleBetweenDegs > constraintAngleDegs ){
                            thisBoneInnerToOuterUV = Fullik.getAngleLimitedUnitVectorDegs( thisBoneInnerToOuterUV, this.mBaseboneConstraintUV, constraintAngleDegs );
                        }
                        
                        var newEndLocation = thisBone.getStartLocation().plus( thisBoneInnerToOuterUV.times( thisBoneLength ) );
                        
                        thisBone.setEndLocation( newEndLocation );
                        
                        // Also, set the start location of the next bone to be the end location of this bone
                        if (this.mNumBones > 1) { this.mChain[1].setStartLocation( newEndLocation ); }
                    }
                    else if ( this.mBaseboneConstraintType === Fullik.BB_LOCAL_ROTOR ){
                        // Note: The mBaseboneRelativeConstraintUV is updated in the FullikStructure3D.updateTarget()
                        // method BEFORE this FullikChain3D.updateTarget() method is called. We no knowledge of the
                        // direction of the bone we're connected to in another chain and so cannot calculate this 
                        // relative basebone constraint direction on our own, but the FullikStructure3D does it for
                        // us so we are now free to use it here.
                        
                        // Get the inner-to-outer direction of this bone
                        var thisBoneInnerToOuterUV = thisBone.getDirectionUV();
                                
                        // Constrain about the relative basebone constraint unit vector as neccessary
                        var angleBetweenDegs    = Fullik.getAngleBetweenDegs( this.mBaseboneRelativeConstraintUV, thisBoneInnerToOuterUV);
                        var constraintAngleDegs = thisBone.getBallJointConstraintDegs();
                        if ( angleBetweenDegs > constraintAngleDegs ){
                            thisBoneInnerToOuterUV = Fullik.getAngleLimitedUnitVectorDegs(thisBoneInnerToOuterUV, this.mBaseboneRelativeConstraintUV, constraintAngleDegs);
                        }
                        
                        // Set the end location
                        var newEndLocation = thisBone.getStartLocation().plus( thisBoneInnerToOuterUV.times(thisBoneLength) );                        
                        thisBone.setEndLocation( newEndLocation );
                        
                        // Also, set the start location of the next bone to be the end location of this bone
                        if (this.mNumBones > 1) { this.mChain[1].setStartLocation(newEndLocation); }

                    } else if ( this.mBaseboneConstraintType === Fullik.BB_GLOBAL_HINGE ) {

                        var thisJoint  =  thisBone.getJoint();
                        var hingeRotationAxis  =  thisJoint.getHingeRotationAxis();
                        var cwConstraintDegs   = -thisJoint.getHingeClockwiseConstraintDegs();     // Clockwise rotation is negative!
                        var acwConstraintDegs  =  thisJoint.getHingeAnticlockwiseConstraintDegs();
                        
                        // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
                        var thisBoneInnerToOuterUV = thisBone.getDirectionUV().projectOnPlane(hingeRotationAxis);
                                
                        // If we have a global hinge which is not freely rotating then we must constrain about the reference axis
                        if ( !( Fullik.nearEquals( cwConstraintDegs, Fullik.MAX_ANGLE_DEGS, 0.01 ) ) && !( Fullik.nearEquals( acwConstraintDegs, Fullik.MAX_ANGLE_DEGS, 0.01 ) ) ) {

                            // Grab the hinge reference axis and calculate the current signed angle between it and our bone direction (about the hinge
                            // rotation axis). Note: ACW rotation is positive, CW rotation is negative.
                            var hingeReferenceAxis = thisJoint.getHingeReferenceAxis();
                            var signedAngleDegs    = Fullik.getSignedAngleBetweenDegs(hingeReferenceAxis, thisBoneInnerToOuterUV, hingeRotationAxis);
                            
                            // Constrain as necessary
                            if (signedAngleDegs > acwConstraintDegs) thisBoneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, acwConstraintDegs, hingeRotationAxis ).normalize();
                            else if (signedAngleDegs < cwConstraintDegs) thisBoneInnerToOuterUV = Fullik.rotateAboutAxisDegs(hingeReferenceAxis, cwConstraintDegs, hingeRotationAxis).normalize();                            
                            
                        }
                        
                        // Calc and set the end location of this bone
                        var newEndLocation = thisBone.getStartLocation().plus( thisBoneInnerToOuterUV.times(thisBoneLength) );                        
                        thisBone.setEndLocation( newEndLocation );
                        
                        // Also, set the start location of the next bone to be the end location of this bone
                        if ( this.mNumBones > 1 ) { this.mChain[1].setStartLocation(newEndLocation); }

                    } else if ( this.mBaseboneConstraintType === Fullik.BB_LOCAL_HINGE ){

                        var thisJoint  =  thisBone.getJoint();
                        var hingeRotationAxis  =  this.mBaseboneRelativeConstraintUV;              // Basebone relative constraint is our hinge rotation axis!
                        var cwConstraintDegs   = -thisJoint.getHingeClockwiseConstraintDegs();     // Clockwise rotation is negative!
                        var acwConstraintDegs  =  thisJoint.getHingeAnticlockwiseConstraintDegs();
                        
                        // Get the inner-to-outer direction of this bone and project it onto the global hinge rotation axis
                        var thisBoneInnerToOuterUV = thisBone.getDirectionUV().projectOnPlane(hingeRotationAxis);
                        
                        //If we have a local hinge which is not freely rotating then we must constrain about the reference axis
                        if ( !( Fullik.nearEquals( cwConstraintDegs, Fullik.MAX_ANGLE_DEGS, 0.01 ) ) && !( Fullik.nearEquals( acwConstraintDegs, Fullik.MAX_ANGLE_DEGS, 0.01 ) ) ) {
        
                            // Grab the hinge reference axis and calculate the current signed angle between it and our bone direction (about the hinge
                            // rotation axis). Note: ACW rotation is positive, CW rotation is negative.
                            var hingeReferenceAxis = this.mBaseboneRelativeReferenceConstraintUV; //thisJoint.getHingeReferenceAxis();
                            var signedAngleDegs    = Fullik.getSignedAngleBetweenDegs( hingeReferenceAxis, thisBoneInnerToOuterUV, hingeRotationAxis );
                            
                            // Constrain as necessary
                            if ( signedAngleDegs > acwConstraintDegs ) thisBoneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, acwConstraintDegs, hingeRotationAxis ).normalize();
                            else if (signedAngleDegs < cwConstraintDegs) thisBoneInnerToOuterUV = Fullik.rotateAboutAxisDegs( hingeReferenceAxis, cwConstraintDegs, hingeRotationAxis ).normalize();   

                        }
                        
                        // Calc and set the end location of this bone
                        var newEndLocation = thisBone.getStartLocation().plus( thisBoneInnerToOuterUV.times( thisBoneLength ) );                        
                        thisBone.setEndLocation( newEndLocation );
                        
                        // Also, set the start location of the next bone to be the end location of this bone
                        if ( this.mNumBones > 1 ) { this.mChain[1].setStartLocation( newEndLocation ); }
                    }
                    
                } // End of basebone constraint handling section

            } // End of basebone handling section

        } // End of backward-pass i over all bones

        // Update our last target location
        this.mLastTargetLocation.copy( target );
        //console.log(target)
                
        // DEBUG - check the live chain length and the originally calculated chain length are the same
        /*
        if (Math.abs( this.getLiveChainLength() - mChainLength) > 0.01f)
        {
            System.out.println("Chain length off by > 0.01f");
        }
        */

        var d = Fullik.distanceBetween( this.mChain[this.mNumBones-1].getEndLocation(), target );
        //console.log('final',  d);
        
        // Finally, calculate and return the distance between the current effector location and the target.
        return d; //Fullik.distanceBetween( this.mChain[this.mNumBones-1].getEndLocation(), target );
    },

    updateChainLength : function(){
        // We start adding up the length of the bones from an initial length of zero
        this.mChainLength = 0;

        // Loop over all the bones in the chain, adding the length of each bone to the mChainLength property
        for (var i = 0; i < this.mNumBones; i++){
            this.mChainLength += this.mChain[i].getLength();
        }

    },

    cloneIkChain : function(){
        // How many bones are in this chain?
        var numBones = this.mChain.length;
        
        // Create a new Vector of FullikBone3D objects of that size
        var clonedChain = [];

        // For each bone in the chain being cloned...       
        for (var i = 0; i < numBones; i++){
            // Use the copy constructor to create a new FullikBone3D with the values set from the source FullikBone3D.
            // and add it to the cloned chain.
            //clonedChain.push( new Fullik.Bone( this.mChain[i] ) );

            clonedChain.push( this.mChain[i].clone() );
        }
        //console.log('clone chaine: ' , clonedChain)
        
        return clonedChain;

    }


// end

}
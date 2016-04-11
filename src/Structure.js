
Fullik.Structure = function(  ){

    this.chains = [];
    this.meshChains = [];
    this.targets = [];
    this.mNumChains = 0;

}

Fullik.Structure.prototype = {

    constructor: Fullik.Structure,

    update:function(){

        var c, m, b, t;
        var connectedChainNumber;
        var hostChain, hostBone, constraintType;

        //var i =  this.mNumChains;

        //while(i--){

        for(var i = 0; i< this.mNumChains ; i++){

            c = this.chains[i];
            m = this.meshChains[i];
            t = this.targets[i];

            connectedChainNumber = c.getConnectedChainNumber();

            //this.chains[0].updateTarget( this.targets[0] );

            if (connectedChainNumber === -1) c.updateTarget( t );
            else{
                hostChain = this.chains[connectedChainNumber];
                hostBone  = hostChain.getBone( c.getConnectedBoneNumber() );
                if( hostBone.getBoneConnectionPoint() === Fullik.START ) c.setBaseLocation( hostBone.getStartLocation() );
                else c.setBaseLocation( hostBone.getEndLocation() );

                constraintType = c.getBaseboneConstraintType();
                switch (constraintType){
                    case Fullik.BB_NONE:         // Nothing to do because there's no basebone constraint
                    case Fullik.BB_GLOBAL_ROTOR: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                    case Fullik.BB_GLOBAL_HINGE: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                        break;
                        
                    // If we have a local rotor or hinge constraint then we must calculate the relative basebone constraint before calling updateTarget
                    case Fullik.BB_LOCAL_ROTOR:
                    case Fullik.BB_LOCAL_HINGE:

                    var connectionBoneMatrix = Fullik.createRotationMatrix( hostBone.getDirectionUV() );
                        
                    // We'll then get the basebone constraint UV and multiply it by the rotation matrix of the connected bone 
                    // to make the basebone constraint UV relative to the direction of bone it's connected to.
                    var relativeBaseboneConstraintUV = connectionBoneMatrix.timesV3( c.getBaseboneConstraintUV() ).normalize();
                            
                    // Update our basebone relative constraint UV property
                    c.setBaseboneRelativeConstraintUV( relativeBaseboneConstraintUV );
                        
                        // Updat the relative reference constraint UV if we hav a local hinge
                    if (constraintType === Fullik.BB_LOCAL_HINGE)
                        c.setBaseboneRelativeReferenceConstraintUV( connectionBoneMatrix.timesV3( c.getBone(0).getJoint().getHingeReferenceAxis() ) );
                        
                    break;

                }

                
                c.resetTarget();//
                //hostChain.updateTarget( this.targets[connectedChainNumber] );

                c.updateTarget( t );


            }

            for ( var j = 0; j < c.mNumBones; j++ ) {
                b = c.getBone(j);
                m[j].position.copy( b.getStartLocation() );
                m[j].lookAt( b.getEndLocation() );
            }

        }

    },

    clear:function(){

        var i, j;

        i = this.mNumChains;
        while(i--){
            this.remove(i);
        }

        this.chains = [];
        this.meshChains = [];
        this.targets = [];

    },

    add:function( chain, meshBone, target ){

        this.chains.push( chain ); 
        if( meshBone ) this.meshChains.push( meshBone );  
        this.targets.push( target );  
        this.mNumChains ++;

    },

    remove:function( id ){

        this.chains[id].clear();
        this.chains.splice(id, 1);
        this.meshChains.splice(id, 1);
        this.targets.splice(id, 1);
        this.mNumChains --;

    },

    setFixedBaseMode:function( fixedBaseMode ){
        for ( var i = 0; i < this.mNumChains; i++) {
            this.chains[i].setFixedBaseMode( fixedBaseMode );
        }
    },

    getNumChains:function(){

        return this.mNumChains;

    },

    getChain:function(id){

        return this.chains[id];

    },

    connectChain : function( newChain, existingChainNumber, existingBoneNumber, boneConnectionPoint, meshBone, target ){

        if ( existingChainNumber > this.mNumChains ) return;
        if ( existingBoneNumber > this.chains[existingChainNumber].getNumBones() ) return;

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        var relativeChain = newChain.clone();//new Fullik.Chain( newChain );

        // Connect the copy of the provided chain to the specified chain and bone in this structure
        relativeChain.connectToStructure( this, existingChainNumber, existingBoneNumber );

        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start location of the given bone in the given chain.

        var connectionPoint = boneConnectionPoint || this.getChain(existingChainNumber).getBone( existingBoneNumber ).getBoneConnectionPoint();
        var connectionLocation;

        if ( connectionPoint === Fullik.START ) connectionLocation = this.chains[existingChainNumber].getBone(existingBoneNumber).getStartLocation();
        else connectionLocation = this.chains[existingChainNumber].getBone(existingBoneNumber).getEndLocation();
         

        relativeChain.setBaseLocation( connectionLocation );
        // When we have a chain connected to a another 'host' chain, the chain is which is connecting in
        // MUST have a fixed base, even though that means the base location is 'fixed' to the connection
        // point on the host chain, rather than a static location.
        relativeChain.setFixedBaseMode( true );

        // Translate the chain we're connecting to the connection point
        for ( var i = 0; i < relativeChain.getNumBones(); i++ ){

            var origStart = relativeChain.getBone(i).getStartLocation();
            var origEnd   = relativeChain.getBone(i).getEndLocation();
            
            var translatedStart = origStart.plus(connectionLocation);
            var translatedEnd   = origEnd.plus(connectionLocation);
            
            relativeChain.getBone(i).setStartLocation(translatedStart);
            relativeChain.getBone(i).setEndLocation(translatedEnd);
        }
        
        this.add( relativeChain , meshBone, target );

    },

    
}
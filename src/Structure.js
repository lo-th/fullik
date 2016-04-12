
Fullik.Structure = function( scene ){

    this.chains = [];
    this.meshChains = [];
    this.targets = [];
    this.mNumChains = 0;

    this.scene = scene;

    this.isWithMesh = false;

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
                if( hostBone.getBoneConnectionPoint() === 'start' ) c.setBaseLocation( hostBone.getStartLocation() );
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
                    if (constraintType === Fullik.BB_LOCAL_HINGE )
                        c.setBaseboneRelativeReferenceConstraintUV( connectionBoneMatrix.timesV3( c.getBone(0).getJoint().getHingeReferenceAxis() ) );
                        
                    break;

                }

                
                c.resetTarget();//
                //hostChain.updateTarget( this.targets[connectedChainNumber] );

                c.updateTarget( t );


            }

            // update 3d mesh

            if( this.isWithMesh ){
                for ( var j = 0; j < c.mNumBones; j++ ) {
                    b = c.getBone(j);
                    m[j].position.copy( b.getStartLocation() );
                    m[j].lookAt( b.getEndLocation() );
                }

            }

        }

    },

    clear:function(){

        this.clearAllBoneMesh();

        var i, j;

        i = this.mNumChains;
        while(i--){
            this.remove(i);
        }

        this.chains = [];
        this.meshChains = [];
        this.targets = [];

    },

    add:function( chain, target, meshBone ){

        this.chains.push( chain );
         
        this.targets.push( target ); 
        this.mNumChains ++;

        if( meshBone ) this.addChainMeshs( chain );; 

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

    connectChain : function( newChain, existingChainNumber, existingBoneNumber, boneConnectionPoint, target, meshBone, color ){

        if ( existingChainNumber > this.mNumChains ) return;
        if ( existingBoneNumber > this.chains[existingChainNumber].getNumBones() ) return;

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        var relativeChain = newChain.clone();//new Fullik.Chain( newChain );
        if( color !== undefined ) relativeChain.setColor( color );

        // Connect the copy of the provided chain to the specified chain and bone in this structure
        relativeChain.connectToStructure( this, existingChainNumber, existingBoneNumber );

        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start location of the given bone in the given chain.

        var connectionPoint = boneConnectionPoint || this.getChain( existingChainNumber ).getBone( existingBoneNumber ).getBoneConnectionPoint();
        var connectionLocation;

        if ( connectionPoint === 'start' ) connectionLocation = this.chains[existingChainNumber].getBone(existingBoneNumber).getStartLocation();
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
        
        this.add( relativeChain, target, meshBone );

    },


    // 3D THREE

    addChainMeshs:function( chain, id ){

        this.isWithMesh = true;

        var meshBone = [];
        var lng  = chain.bones.length;
        for(var i = 0; i<lng; i++ ){
            meshBone.push( this.addBoneMesh( chain.bones[i] ) );
        }

        this.meshChains.push( meshBone );

    },

    addBoneMesh:function( bone ){

        var size = bone.mLength;
        var color = bone.color;
        var g = new THREE.CylinderBufferGeometry ( 1, 0.5, size, 4 );
        g.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) )
        g.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, size*0.5 ) );
        var m = new THREE.MeshStandardMaterial();
        m.color.setHex( color );

        var m2 = new THREE.MeshBasicMaterial({ wireframe : true });

        var extraMesh;
        var extraGeo;

        var type = bone.getJoint().type;
        switch(type){
            case Fullik.J_BALL :
                m2.color.setHex(0xFF6600);
                var angle  = bone.getJoint().mRotorConstraintDegs;
                if(angle === 180) break;
                var s = size/4;
                var r = 2;//

                extraGeo = new THREE.CylinderBufferGeometry ( 0, r, s, 6 );
                extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) )
                extraGeo.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, s*0.5 ) );
                extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case Fullik.J_GLOBAL_HINGE :
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * Fullik.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * Fullik.torad;
            var r = 2;
            m2.color.setHex(0xFFFF00);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case Fullik.J_LOCAL_HINGE :
            var r = 2;
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * Fullik.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * Fullik.torad;
            m2.color.setHex(0x00FFFF);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
        }




        var b = new THREE.Mesh( g,  m );
        this.scene.add( b );
        if( extraMesh ) b.add( extraMesh );
        return b;

    },

    clearAllBoneMesh:function(){

        if(!this.isWithMesh) return;

        var i, j, b;

        i = this.meshChains.length;
        while(i--){
            j = this.meshChains[i].length;
            while(j--){
                b = this.meshChains[i][j];
                this.scene.remove( b );
                b.geometry.dispose();
                b.material.dispose();
            }
            this.meshChains[i] = [];
        }
        this.meshChains = [];

    }

}
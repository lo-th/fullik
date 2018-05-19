import { UP, NONE, GLOBAL_ABSOLUTE, LOCAL_RELATIVE, LOCAL_ABSOLUTE, END, START } from '../constants.js';
import { _Math } from '../math/Math.js';
import { V2 } from '../math/V2.js';

function Structure2D ( scene ) {

    //this.UP = new V2( 0, 1 );
    this.mFixedBaseMode = true;

    this.chains = [];
    this.meshChains = [];
    this.targets = [];
    this.mNumChains = 0;

    this.scene = scene;

    this.isWithMesh = false;

}

Object.assign( Structure2D.prototype, {

    isStructure2D: true,

    update:function(){

        var c, m, b, t, pos, pos2, tmp = new THREE.Vector3( );
        var hostChainNumber;
        var hostChain, hostBone, constraintType;

        for( var i = 0; i < this.mNumChains; i++ ){

            c = this.chains[i];
            m = this.meshChains[i];
            t = this.targets[i];

            //console.log(t)

            hostChainNumber = c.getConnectedChainNumber();

            // Get the basebone constraint type of the chain we're working on
            constraintType = c.getBaseboneConstraintType();

            // If this chain is not connected to another chain and the basebone constraint type of this chain is not global absolute
            // then we must update the basebone constraint UV for LOCAL_RELATIVE and the basebone relative constraint UV for LOCAL_ABSOLUTE connection types.
            // Note: For NONE or GLOBAL_ABSOLUTE we don't need to update anything before calling updateTarget().
            if (hostChainNumber !== -1 && constraintType !== GLOBAL_ABSOLUTE) {   
                // Get the bone which this chain is connected to in the 'host' chain
                var hostBone = this.chains[hostChainNumber].getBone( c.getConnectedBoneNumber() );
                
                // If we're connecting this chain to the start location of the bone in the 'host' chain...
                if( c.getBoneConnectionPoint() === START ){
                    // ...set the base location of this bone to be the start location of the bone it's connected to.
                    c.setBaseLocation( hostBone.getStartLocation() );
                } else {
                    // If the bone connection point is BoneConnectionPoint.END...
                   
                    // ...set the base location of the chain to be the end location of the bone we're connecting to.
                    c.setBaseLocation( hostBone.getEndLocation() );
                }
                
                // If the basebone is constrained to the direction of the bone it's connected to...
                var hostBoneUV = hostBone.getDirectionUV();

                if (constraintType === LOCAL_RELATIVE){   

                    // ...then set the basebone constraint UV to be the direction of the bone we're connected to.
                    c.setBaseboneConstraintUV(hostBoneUV);

                } else if (constraintType === LOCAL_ABSOLUTE) {   

                    // Note: LOCAL_ABSOLUTE directions are directions which are in the local coordinate system of the host bone.
                    // For example, if the baseboneConstraintUV is Vec2f(-1.0f, 0.0f) [i.e. left], then the baseboneConnectionConstraintUV
                    // will be updated to be left with regard to the host bone.
                    
                    // Get the angle between UP and the hostbone direction
                    var angleDegs = UP.getSignedAngleDegsTo(hostBoneUV);


                    
                    // ...then apply that same rotation to this chain's basebone constraint UV to get the relative constraint UV... 
                    var relativeConstraintUV = _Math.rotateDegs( c.getBaseboneConstraintUV(), angleDegs );
                    
                    // ...which we then update.
                    c.setBaseboneRelativeConstraintUV(relativeConstraintUV);      

                }
                
                // NOTE: If the basebone constraint type is NONE then we don't do anything with the basebone constraint of the connected chain.
                
            } // End of if chain is connected to another chain section

            //this.chains[0].updateTarget( this.targets[0] );

            /*if (hostChainNumber === -1) c.updateTarget( t );
            else{
                hostChain = this.chains[hostChainNumber];
                hostBone  = hostChain.getBone( c.getConnectedBoneNumber() );
                if( hostBone.getBoneConnectionPoint() === START ) c.setBaseLocation( hostBone.getStartLocation() );
                else c.setBaseLocation( hostBone.getEndLocation() );

                constraintType = c.getBaseboneConstraintType();
                var hostBoneUV = hostBone.getDirectionUV();
                switch (constraintType){
                    case NONE:         // Nothing to do because there's no basebone constraint
                    break;
                        
                    // If we have a local rotor or hinge constraint then we must calculate the relative basebone constraint before calling updateTarget
                    case LOCAL_RELATIVE:

                        c.setBaseboneConstraintUV( hostBoneUV );

                    break;
                    case LOCAL_ABSOLUTE:
                    // Note: LOCAL_ABSOLUTE directions are directions which are in the local coordinate system of the host bone.
                    // For example, if the baseboneConstraintUV is Vec2f(-1.0f, 0.0f) [i.e. left], then the baseboneConnectionConstraintUV
                    // will be updated to be left with regard to the host bone.

                    // Get the angle between UP and the hostbone direction
                    var angleDegs = UP.getSignedAngleDegsTo( hostBoneUV );

                    // ...then apply that same rotation to this chain's basebone constraint UV to get the relative constraint UV... 
                    var relativeConstraintUV = _Math.rotateDegs( thisChain.getBaseboneConstraintUV(), angleDegs);
                        
                    // ...which we then update.
                    c.setBaseboneRelativeConstraintUV( relativeConstraintUV );

                    break;

                }*/

                
            //c.resetTarget();//
                //hostChain.updateTarget( this.targets[hostChainNumber] );

            //c.updateTarget( t );

            if ( !c.mUseEmbeddedTarget ) c.updateTarget( t );
            else c.solveForEmbeddedTarget();


            // update 3d mesh

            if( this.isWithMesh ){
                for ( var j = 0; j < c.mNumBones; j++ ) {
                    b = c.getBone(j);
                    pos = b.getStartLocation();
                    pos2 = b.getEndLocation();
                    m[j].position.set( pos.x, pos.y, 0 );
                    m[j].lookAt( tmp.set( pos2.x, pos2.y, 0 ) );
                }

            }


        }

                

       // }

    },

    setFixedBaseMode: function( b ){

        // Update our flag and set the fixed base mode on the first (i.e. 0th) chain in this structure.
        this.mFixedBaseMode = b; 
        this.chains[0].setFixedBaseMode(this.mFixedBaseMode);

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

        //if( target.isVector3 ) target = new V2(target.x, target.y);
         
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

    /*setFixedBaseMode:function( fixedBaseMode ){
        for ( var i = 0; i < this.mNumChains; i++) {
            this.chains[i].setFixedBaseMode( fixedBaseMode );
        }
    },*/

    getNumChains:function(){

        return this.mNumChains;

    },

    getChain:function(id){

        return this.chains[id];

    },

    connectChain : function( newChain, existingChainNumber, existingBoneNumber, boneConnectionPoint, target, meshBone, color ){

        if ( existingChainNumber > this.mNumChains ) return;
        if ( existingBoneNumber > this.chains[existingChainNumber].getNumBones() ) return;

        newChain.setBoneConnectionPoint( boneConnectionPoint === 'end' ? END : START );

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        var relativeChain = newChain.clone();//new Fullik.Chain( newChain );

        relativeChain.setConnectedChainNumber(existingChainNumber);
        relativeChain.setConnectedBoneNumber(existingBoneNumber);
        //if( color !== undefined ) relativeChain.setColor( color );
        //else color = newChain.color;

        // Connect the copy of the provided chain to the specified chain and bone in this structure
        //relativeChain.connectToStructure( this, existingChainNumber, existingBoneNumber );

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
        //console.log(bone.color)
        var g = new THREE.CylinderBufferGeometry ( 1, 0.5, size, 4 );
        g.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) )
        g.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, size*0.5 ) );
        //var m = new THREE.MeshStandardMaterial({ color:color });
        var m = new THREE.MeshStandardMaterial({ color:color, wireframe:false, shadowSide:false });
        //m.color.setHex( color );

        var m2 = new THREE.MeshBasicMaterial({ wireframe : true });

        var extraMesh;
        var extraGeo;

        /*var type = bone.getJoint().type;
        switch(type){
            case J_BALL :
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
            case J_GLOBAL_HINGE :
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * _Math.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * _Math.torad;
            var r = 2;
            m2.color.setHex(0xFFFF00);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
            case J_LOCAL_HINGE :
            var r = 2;
            var a1 = bone.getJoint().mHingeClockwiseConstraintDegs * _Math.torad;
            var a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * _Math.torad;
            m2.color.setHex(0x00FFFF);
            extraGeo = new THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new THREE.Mesh( extraGeo,  m2 );
            break;
        }*/




        var b = new THREE.Mesh( g,  m );

        b.castShadow = true;
        b.receiveShadow = true;
        
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

} );

export { Structure2D };
import {  NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, J_BALL, J_GLOBAL, J_LOCAL, END, START } from '../constants.js';
import { math } from '../math/Math.js';
import { M3 } from '../math/M3.js';

//import * as THREE from 'three'

export class Structure3D {

    constructor( scene, THREE ) {

        this.THREE = THREE

        this.isStructure3D = true;

        this.fixedBaseMode = true;

        this.chains = [];
        this.meshChains = [];
        this.targets = [];
        this.numChains = 0;

        this.scene = scene || null;

        this.tmpMtx = new M3();

        this.isWithMesh = false;

    }

    update() {

        let chain, mesh, bone, target;
        let hostChainNumber;
        let hostBone, constraintType;

        //let i =  this.numChains;

        //while(i--){

        for( let i = 0; i < this.numChains; i++ ){

            chain = this.chains[i];
            target = this.targets[i];

            hostChainNumber = chain.getConnectedChainNumber();

            if ( hostChainNumber !== -1 ){

                hostBone  = this.chains[ hostChainNumber ].bones[ chain.getConnectedBoneNumber() ];

                chain.setBaseLocation( chain.getBoneConnectionPoint() === START ? hostBone.start : hostBone.end );

                // Now that we've clamped the base location of this chain to the start or end point of the bone in the chain we are connected to, it's
                // time to deal with any base bone constraints...

                constraintType = chain.getBaseboneConstraintType();

                switch (constraintType){

                    case NONE:         // Nothing to do because there's no basebone constraint
                    case GLOBAL_ROTOR: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                    case GLOBAL_HINGE: // Nothing to do because the basebone constraint is not relative to bones in other chains in this structure
                        break;
                        
                    // If we have a local rotor or hinge constraint then we must calculate the relative basebone constraint before calling solveForTarget
                    case LOCAL_ROTOR:
                    case LOCAL_HINGE:

                    //chain.resetTarget(); // ??

                    // Get the direction of the bone this chain is connected to and create a rotation matrix from it.
                    this.tmpMtx.createRotationMatrix( hostBone.getDirectionUV() );
                    //let connectionBoneMatrix = new FIK.M3().createRotationMatrix( hostBone.getDirectionUV() );
                        
                    // We'll then get the basebone constraint UV and multiply it by the rotation matrix of the connected bone 
                    // to make the basebone constraint UV relative to the direction of bone it's connected to.
                    //let relativeBaseboneConstraintUV = connectionBoneMatrix.times( c.getBaseboneConstraintUV() ).normalize();
                    let relativeBaseboneConstraintUV = chain.getBaseboneConstraintUV().clone().applyM3( this.tmpMtx );
                            
                    // Update our basebone relative constraint UV property
                    chain.setBaseboneRelativeConstraintUV( relativeBaseboneConstraintUV );
                        
                    // Update the relative reference constraint UV if we hav a local hinge
                    if (constraintType === LOCAL_HINGE )
                        chain.setBaseboneRelativeReferenceConstraintUV( chain.bones[0].joint.getHingeReferenceAxis().clone().applyM3( this.tmpMtx ) );
                        
                    break;

                }

                
                

            }

            // Finally, update the target and solve the chain

            if ( !chain.useEmbeddedTarget ) chain.solveForTarget( target );
            else chain.solveForEmbeddedTarget();

            // update 3d mesh

            if( this.isWithMesh ){

                mesh = this.meshChains[i];

                for ( let j = 0; j < chain.numBones; j++ ) {
                    bone = chain.bones[j];
                    mesh[j].position.copy( bone.start );
                    mesh[j].lookAt( bone.end );
                }

            }

        }

    }

    clear() {

        this.clearAllBoneMesh();

        let i, j;

        i = this.numChains;
        while(i--){
            this.remove(i);
        }

        this.chains = [];
        this.meshChains = [];
        this.targets = [];

    }

    add( chain, target, meshBone ) {

        this.chains.push( chain );
         
        this.targets.push( target ); 
        this.numChains ++;

        if( meshBone ) this.addChainMeshs( chain );; 

    }

    remove( id ) {

        this.chains[id].clear();
        this.chains.splice(id, 1);
        this.meshChains.splice(id, 1);
        this.targets.splice(id, 1);
        this.numChains --;

    }

    setFixedBaseMode( value ) {

        this.fixedBaseMode = value; 
        let i = this.numChains, host;
        while(i--){
            host = this.chains[i].getConnectedChainNumber();
            if( host===-1 ) this.chains[i].setFixedBaseMode( this.fixedBaseMode );
        }

    }

    getNumChains() {

        return this.numChains;

    }

    getChain(id) {

        return this.chains[id];

    }

    connectChain( Chain, chainNumber, boneNumber, point, target, meshBone, color ) {

        let c = chainNumber;
        let n = boneNumber;

        if ( chainNumber > this.numChains ) return;
        if ( boneNumber > this.chains[chainNumber].numBones ) return;

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        let chain = Chain.clone();//new Fullik.Chain( newChain );
        if( color !== undefined ) chain.setColor( color );

        // Connect the copy of the provided chain to the specified chain and bone in this structure
        //chain.connectToStructure( this, chainNumber, boneNumber );

        chain.setBoneConnectionPoint( point === 'end' ? END : START );
        chain.setConnectedChainNumber( c );
        chain.setConnectedBoneNumber( n );

        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start location of the given bone in the given chain.

        let position = point === 'end' ? this.chains[ c ].bones[ n ].end : this.chains[ c ].bones[ n ].start;
         

        chain.setBaseLocation( position );
        // When we have a chain connected to a another 'host' chain, the chain is which is connecting in
        // MUST have a fixed base, even though that means the base location is 'fixed' to the connection
        // point on the host chain, rather than a static location.
        chain.setFixedBaseMode( true );

        // Translate the chain we're connecting to the connection point
        for ( let i = 0; i < chain.numBones; i++ ){

            chain.bones[i].start.add( position );
            chain.bones[i].end.add( position );

        }
        
        this.add( chain, target, meshBone );

    }


    // 3D THREE

    addChainMeshs( chain, id ) {

        this.isWithMesh = true;

        let meshBone = [];
        let lng  = chain.bones.length;
        for(let i = 0; i < lng; i++ ){
            meshBone.push( this.addBoneMesh( chain.bones[i], i-1, meshBone, chain ));
        }

        this.meshChains.push( meshBone );

    }

    addBoneMesh( bone, prev, ar, chain ) {

        let s = 2, r = 2, a1, a2, axe;
        let size = bone.length;
        let color = bone.color;
        let g = new this.THREE.CylinderBufferGeometry ( 1, 0.5, size, 4 );
        g.rotateX( -Math.PI * 0.5 );
        g.translate( 0, 0, size*0.5 );
        //g.applyMatrix4( new this.THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) )
        //g.applyMatrix4( new this.THREE.Matrix4().makeTranslation( 0, 0, size*0.5 ) );
        let m = new this.THREE.MeshStandardMaterial({ color:color, wireframe:false, shadowSide:this.THREE.DoubleSide });

        let m2 = new this.THREE.MeshBasicMaterial({ wireframe : true });
        //let m4 = new this.THREE.MeshBasicMaterial({ wireframe : true, color:color, transparent:true, opacity:0.3 });

        let extraMesh = null;
        let extraGeo;

        let type = bone.joint.type;
        switch(type){
            case J_BALL :
                m2.color.setHex(0xFF6600);
                let angle = bone.joint.rotor;
             
                if(angle === Math.PI) break;
                s = 2//size/4;
                r = 2;//
                extraGeo = new this.THREE.CylinderBufferGeometry ( 0, r, s, 6,1, true );
                extraGeo.rotateX( -Math.PI * 0.5 );
                extraGeo.translate(  0, 0, s*0.5 );
                //extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) )
                //extraGeo.applyMatrix4( new this.THREE.Matrix4().makeTranslation( 0, 0, s*0.5 ) );
                extraMesh = new this.THREE.Mesh( extraGeo,  m2 );
            break;
            case J_GLOBAL :
            axe =  bone.joint.getHingeRotationAxis();
            a1 = bone.joint.min;
            a2 = bone.joint.max;
            r = 2;
            //console.log('global', a1, a2)
            m2.color.setHex(0xFFFF00);
            extraGeo = new this.THREE.CircleBufferGeometry( r, 12, a1, -a1+a2 );

            
            extraGeo.rotateX( -Math.PI * 0.5 );
            //extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            if( axe.z === 1 ) extraGeo.rotateX( -Math.PI * 0.5 );//extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            if( axe.y === 1 ) {extraGeo.rotateY( -Math.PI * 0.5 );  extraGeo.rotateX( -Math.PI * 0.5 ) }//{extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationY( -Math.PI*0.5 ) );extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );}
            if( axe.x === 1 ) {extraGeo.rotateY( Math.PI * 0.5 );/*extraGeo.applyMatrix4(new this.THREE.Matrix4().makeRotationY( Math.PI*0.5 ));*/}

            extraMesh = new this.THREE.Mesh( extraGeo,  m2 );
            break;
            case J_LOCAL :

            axe =  bone.joint.getHingeRotationAxis();
            a1 = bone.joint.min;
            a2 = bone.joint.max;
            r = 2;
            
            m2.color.setHex(0x00FFFF);
            extraGeo = new this.THREE.CircleBufferGeometry( r, 12, a1, -a1+a2 );
            extraGeo.rotateX( -Math.PI * 0.5 )

           // extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            if( axe.z === 1 ) { extraGeo.rotateY( -Math.PI * 0.5 ); extraGeo.rotateX( Math.PI * 0.5 ); }
            if( axe.x === 1 ) extraGeo.rotateZ( -Math.PI * 0.5 )
            if( axe.y === 1 ) { extraGeo.rotateX( Math.PI * 0.5 ); extraGeo.rotateY( Math.PI * 0.5 ) }

            /*if( axe.z === 1 ) { extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationY( -Math.PI*0.5 ) ); extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( Math.PI*0.5 ) );}
            if( axe.x === 1 ) extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationZ( -Math.PI*0.5 ) );
            if( axe.y === 1 ) { extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( Math.PI*0.5 ) ); extraGeo.applyMatrix4(new this.THREE.Matrix4().makeRotationY( Math.PI*0.5 ));}*/

            extraMesh = new this.THREE.Mesh( extraGeo,  m2 );
            break;
        }

        axe = new this.THREE.AxesHelper(1.5);
        //let bw = new this.THREE.Mesh( g,  m4 );

        let b = new this.THREE.Mesh( g,  m );
        b.add(axe);
        //b.add(bw);
        this.scene.add( b );

        b.castShadow = true;
        b.receiveShadow = true;

        if( prev !== -1 ){
            if( extraMesh !== null ){ 
                if(type!==J_GLOBAL){
                    extraMesh.position.z = chain.bones[prev].length;
                    ar[prev].add( extraMesh );
                } else {
                    b.add( extraMesh );
                }
                
            }
        } else {
             if( extraMesh !== null ) b.add( extraMesh );
        }
       
        return b;

    }

    clearAllBoneMesh() {

        if(!this.isWithMesh) return;

        let i, j, b;

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
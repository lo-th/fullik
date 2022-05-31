import { UP, NONE, GLOBAL_ABSOLUTE, LOCAL_RELATIVE, LOCAL_ABSOLUTE, END, START } from '../constants.js';
import { math } from '../math/Math.js';
import { V2 } from '../math/V2.js';
import { Tools } from './Tools.js';

export class Structure2D {

    constructor( scene, THREE ) {

        this.THREE = THREE

        this.isStructure2D = true;

        this.fixedBaseMode = true;

        this.chains = [];
        this.meshChains = [];
        this.angleChains= [];
        this.targets = [];
        this.numChains = 0;

        this.scene = scene || null;

        this.isWithMesh = false;

    }

    update() {

        //console.log('up')

        let chain, mesh, bone, target, tmp = new this.THREE.Vector3();
        let hostChainNumber;
        let hostChain, hostBone, constraintType;
        let a, angle;

        for( let i = 0; i < this.numChains; i++ ){

            chain = this.chains[i];
            
            target = this.targets[i] || null;

            hostChainNumber = chain.getConnectedChainNumber();

            // Get the basebone constraint type of the chain we're working on
            constraintType = chain.getBaseboneConstraintType();

            // If this chain is not connected to another chain and the basebone constraint type of this chain is not global absolute
            // then we must update the basebone constraint UV for LOCAL_RELATIVE and the basebone relative constraint UV for LOCAL_ABSOLUTE connection types.
            // Note: For NONE or GLOBAL_ABSOLUTE we don't need to update anything before calling solveForTarget().
            if ( hostChainNumber !== -1 && constraintType !== GLOBAL_ABSOLUTE ) {   
                // Get the bone which this chain is connected to in the 'host' chain
                let hostBone = this.chains[ hostChainNumber ].bones[ chain.getConnectedBoneNumber() ];

                chain.setBaseLocation( chain.getBoneConnectionPoint() === START ? hostBone.start : hostBone.end );
               
                
                // If the basebone is constrained to the direction of the bone it's connected to...
                let hostBoneUV = hostBone.getDirectionUV();

                if ( constraintType === LOCAL_RELATIVE ){   

                    // ...then set the basebone constraint UV to be the direction of the bone we're connected to.
                    chain.setBaseboneConstraintUV( hostBoneUV );

                } else if ( constraintType === LOCAL_ABSOLUTE ) {   

                    // Note: LOCAL_ABSOLUTE directions are directions which are in the local coordinate system of the host bone.
                    // For example, if the baseboneConstraintUV is Vec2f(-1.0f, 0.0f) [i.e. left], then the baseboneConnectionConstraintUV
                    // will be updated to be left with regard to the host bone.
                    
                    // Get the angle between UP and the hostbone direction
                    angle = UP.getSignedAngle( hostBoneUV );

                    // ...then apply that same rotation to this chain's basebone constraint UV to get the relative constraint UV... 
                    let relativeConstraintUV = chain.getBaseboneConstraintUV().clone().rotate( angle );
                    
                    // ...which we then update.
                    chain.setBaseboneRelativeConstraintUV( relativeConstraintUV );      

                }
                
                // NOTE: If the basebone constraint type is NONE then we don't do anything with the basebone constraint of the connected chain.
                
            } // End of if chain is connected to another chain section

            // Finally, update the target and solve the chain

            if ( !chain.useEmbeddedTarget ) chain.solveForTarget( target );
            else console.log('embed', chain.solveForEmbeddedTarget());


            // update 3d mesh

            if( this.isWithMesh ){

                mesh = this.meshChains[i];
                angle = this.angleChains[i];

                for ( let j = 0; j < chain.numBones; j++ ) {

                    bone = chain.bones[j];
                    mesh[j].position.set( bone.start.x, bone.start.y, 0 );
                    a = math.unwrapRad( -Math.atan2( bone.start.x - bone.end.x, bone.start.y - bone.end.y ));
                    a = math.unwrapRad( -Math.atan2( bone.end.x - bone.start.x, bone.end.y - bone.start.y ));
                    mesh[j].rotation.z = a
                    angle[j] =  a * math.toDeg;

                    //mesh[j].lookAt( tmp.set( bone.end.x, bone.end.y, 0 ) );
                }

            }


        }

    }

    setFixedBaseMode( value ) {

        // Update our flag and set the fixed base mode on the first (i.e. 0th) chain in this structure.
        this.fixedBaseMode = value; 
        let i = this.numChains, host;
        while(i--){
            host = this.chains[i].getConnectedChainNumber();
            if(host===-1) this.chains[i].setFixedBaseMode( this.fixedBaseMode );
        }
        //this.chains[0].setFixedBaseMode( this.fixedBaseMode );

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
        this.angleChains = [];
        this.targets = [];

    }

    add( chain, target, meshBone ) {

        this.chains.push( chain );
        this.numChains ++;

        //if( target.isVector3 ) target = new V2(target.x, target.y);
         
        if(target) this.targets.push( target ); 
        

        if( meshBone ) this.addChainMeshs( chain );

    }

    remove( id ){

        this.chains[id].clear();
        this.chains.splice(id, 1);
        this.meshChains.splice(id, 1);
        this.angleChains.splice(id, 1);
        this.targets.splice(id, 1);
        this.numChains --;

    }

    /*setFixedBaseMode:function( fixedBaseMode ){
        for ( let i = 0; i < this.numChains; i++) {
            this.chains[i].setFixedBaseMode( fixedBaseMode );
        }
    },*/

    getNumChains() {

        return this.numChains;

    }

    getChain( id ) {

        return this.chains[id];

    }

    connectChain( Chain, chainNumber, boneNumber, point, target, meshBone, color ) {

        let c = chainNumber;
        let n = boneNumber;

        point = point || 'end';

        if ( c > this.numChains ){ Tools.error('Chain not existe !'); return };
        if ( n > this.chains[ c ].numBones ){ Tools.error('Bone not existe !'); return };

        // Make a copy of the provided chain so any changes made to the original do not affect this chain
        let chain = Chain.clone();

        chain.setBoneConnectionPoint( point === 'end' ? END : START );
        chain.setConnectedChainNumber( c );
        chain.setConnectedBoneNumber( n );

        // The chain as we were provided should be centred on the origin, so we must now make it
        // relative to the start or end position of the given bone in the given chain.

        let position = point === 'end' ? this.chains[ c ].bones[ n ].end : this.chains[ c ].bones[ n ].start;

        //if ( connectionPoint === 'start' ) connectionLocation = this.chains[chainNumber].getBone(boneNumber).start;
        //else connectionLocation = this.chains[chainNumber].getBone(boneNumber).end;
         

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
        let angle = [];

        let lng  = chain.bones.length;
        for(let i = 0; i<lng; i++ ){
            meshBone.push( this.addBoneMesh( chain.bones[i] ) );
            angle.push(0);
        }

        this.meshChains.push( meshBone );
        this.angleChains.push( angle );

    }

    addBoneMesh( bone ){

        let size = bone.length;
        let color = bone.color;
        //console.log(bone.color)
        let g = new this.THREE.CylinderBufferGeometry ( 0.5, 1, size, 4 );
        g.translate( 0, size*0.5, 0 );

        let m = new this.THREE.MeshStandardMaterial({ color:color, wireframe:false, shadowSide:this.THREE.DoubleSide });
        let m2 = new this.THREE.MeshBasicMaterial({ wireframe : true });

        let extraMesh;
        let extraGeo;

        /*let type = bone.getJoint().type;
        switch(type){
            case J_BALL :
                m2.color.setHex(0xFF6600);
                let angle  = bone.getJoint().mRotorConstraintDegs;
                if(angle === 180) break;
                let s = size/4;
                let r = 2;//

                extraGeo = new this.THREE.CylinderBufferGeometry ( 0, r, s, 6 );
                extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) )
                extraGeo.applyMatrix4( new this.THREE.Matrix4().makeTranslation( 0, 0, s*0.5 ) );
                extraMesh = new this.THREE.Mesh( extraGeo,  m2 );
            break;
            case J_GLOBAL_HINGE :
            let a1 = bone.getJoint().mHingeClockwiseConstraintDegs * math.torad;
            let a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * math.torad;
            let r = 2;
            m2.color.setHex(0xFFFF00);
            extraGeo = new this.THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new this.THREE.Mesh( extraGeo,  m2 );
            break;
            case J_LOCAL_HINGE :
            let r = 2;
            let a1 = bone.getJoint().mHingeClockwiseConstraintDegs * math.torad;
            let a2 = bone.getJoint().mHingeAnticlockwiseConstraintDegs * math.torad;
            m2.color.setHex(0x00FFFF);
            extraGeo = new this.THREE.CircleGeometry ( r, 12, a1, a1+a2 );
            extraGeo.applyMatrix4( new this.THREE.Matrix4().makeRotationX( -Math.PI*0.5 ) );
            extraMesh = new this.THREE.Mesh( extraGeo,  m2 );
            break;
        }*/




        let b = new this.THREE.Mesh( g,  m );

        b.castShadow = true;
        b.receiveShadow = true;
        
        this.scene.add( b );
        if( extraMesh ) b.add( extraMesh );
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
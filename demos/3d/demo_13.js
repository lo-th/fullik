tell("Demo 13 - Global Hinges With Reference Axis Constraints");



var position = new THREE.Vector3(0,18.258,0);

var vectorsObj = {
        V0:new THREE.Vector3(0,0,9.48),
        V1:new THREE.Vector3(0,0,21),
        V2:new THREE.Vector3(14.2,0,0),
        V3:new THREE.Vector3(25,0,0),
        V4:new THREE.Vector3(0,0,-27.275),//-5.96-21.315
        V5:new THREE.Vector3(8,0,0),
    }

var x = FIK.X_AXE
var y = FIK.Y_AXE
var z = FIK.Z_AXE

var nx = FIK.X_NEG
var ny = FIK.Y_NEG
var nz = FIK.Z_NEG

var chain = new FIK.Chain3D( 0x999999 );

var startLoc = new FIK.V3( 0, 18.258+9.48, 0 );
var endLoc = startLoc.clone();
endLoc.y += 21+14.2+25//9.48//18.258;

var basebone = new FIK.Bone3D( startLoc, endLoc );
chain.addBone( basebone );

//chain.setRotorBaseboneConstraint( 'global', y, 90);
//chain.setHingeBaseboneConstraint( 'global', y, 180,180, z)
var ax = FIK.Z_AXE


chain.addConsecutiveRotorConstrainedBone( y, 27.275, 180 );
//chain.addConsecutiveRotorConstrainedBone( y, 39.2, 180 );
//chain.addConsecutiveRotorConstrainedBone( y, 39.2, 180 );




//chain.addConsecutiveRotorConstrainedBone( y, 14.2, 0 );
//chain.addConsecutiveRotorConstrainedBone( y, 25, 180 );
//chain.addConsecutiveFreelyRotatingHingedBone( y, 9.48, 'local', nx)
//chain.addConsecutiveHingedBone( y, 21, 'local', y, 150, 150, z );
//chain.addConsecutiveHingedBone( y, 21, 'global', z, 150, 150, x );
//chain.addConsecutiveHingedBone( y, 21, 'local', z, 150, 150, perp(ny) );
//chain.addConsecutiveRotorConstrainedBone( y, 21, 0 )

//chain.addConsecutiveHingedBone( FIK.Y_AXE, 21, 'local', FIK.Y_NEG, 150, 150, perp(FIK.Y_NEG) );

//chain.setHingeBaseboneConstraint( 'global', FIK.Z_AXE, 180, 180, FIK.Y_AXE);

//chain.addConsecutiveFreelyRotatingHingedBone(FIK.Y_AXE, 9.48, 'local', FIK.Y_NEG)

//var p = FIK._Math.genPerpendicularVectorQuick( FIK.Y_NEG )


//chain.addConsecutiveHingedBone( FIK.Y_AXE, 14.2, 'global', FIK.Y_NEG, 150, 150, perp(FIK.Y_NEG) );
//chain.addConsecutiveHingedBone( FIK.Y_AXE, 21, 'local', FIK.Y_AXE, 120, 120, FIK.Y_NEG );

/*for (var j = 0; j < 8; j++) {

	//chain.addConsecutiveHingedBone( FIK.Y_NEG, defaultBoneLength, 'global', FIK.Y_AXE, 120, 120, FIK.Y_NEG );
    //chain.addConsecutiveHingedBone( FIK.Y_NEG, defaultBoneLength, 'global', FIK.Y_AXE, 120, 120, FIK.Y_NEG );
    chain.addConsecutiveHingedBone( FIK.Y_NEG, defaultBoneLength, 'local', FIK.Y_AXE, 120, 120, FIK.Y_NEG );
    //else chain.addConsecutiveBone( FIK.Y_NEG, defaultBoneLength )

};*/

solver.add( chain, target, true );


function perp( v ){
	return FIK._Math.genPerpendicularVectorQuick( v )
}
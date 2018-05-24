tell("Demo 12 - Connected Chains with Non-Freely-Rotating Global Hinge Basebone Constraints");

addTarget( new THREE.Vector3(20, 20, 20) );

var chain = new FIK.Chain3D( 0x999999 );

var startLoc = new FIK.V3(0, 0, 40);
var endLoc = startLoc.plus( defaultBoneDirection.multiply(defaultBoneLength) );

var basebone = new FIK.Bone3D( startLoc, endLoc );
chain.addBone( basebone );

for (var j = 0; j < 7; j++) {
    chain.addConsecutiveBone( defaultBoneDirection, defaultBoneLength );
};

solver.add( chain, target, true );

var chain2 = new FIK.Chain3D();
var base = new FIK.Bone3D( new FIK.V3(0, 0, 0), new FIK.V3(15, 0, 0) );
chain2.addBone(base);
chain2.setHingeBaseboneConstraint( 'global', FIK.Y_AXE, 90, 45, FIK.X_AXE);
chain2.addConsecutiveBone( FIK.X_AXE, 15 );
chain2.addConsecutiveBone( FIK.X_AXE, 10 );
chain2.addConsecutiveBone( FIK.X_AXE, 10 );

solver.connectChain( chain2, 0, 3, 'start', targets[1].position, true, 0xFF0000 );
tell("Demo 9 - Global Rotor Constrained Connected Chains");

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
chain2.setRotorBaseboneConstraint( 'global', FIK.X_AXE, 45);
chain2.addConsecutiveBone( FIK.X_AXE, 15 );
chain2.addConsecutiveBone( FIK.X_AXE, 15 );
chain2.addConsecutiveBone( FIK.X_AXE, 15 );

solver.connectChain( chain2, 0, 3, 'start', target, true, 0xFF0000 );

var chain3 = new FIK.Chain3D();
var base = new FIK.Bone3D( new FIK.V3(0, 0, 0), new FIK.V3(0, 15, 0) );
chain3.addBone(base);
chain3.setRotorBaseboneConstraint( 'global', FIK.Y_AXE, 45);
chain3.addConsecutiveBone( FIK.Y_AXE, 15 );
chain3.addConsecutiveBone( FIK.Y_AXE, 15 );
chain3.addConsecutiveBone( FIK.Y_AXE, 15 );

solver.connectChain( chain3, 0, 6, 'start', target, true, 0x00FF00 );
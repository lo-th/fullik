tell("Demo 12 - Connected Chains with Non-Freely-Rotating Global Hinge Basebone Constraints");

addTarget(new THREE.Vector3(20, 20, 20));

var chain = new Fullik.Chain( 0x999999 );

var startLoc = new Fullik.V3(0, 0, 40);
var endLoc = startLoc.plus( defaultBoneDirection.times(defaultBoneLength) );

var basebone = new Fullik.Bone( startLoc, endLoc );
chain.addBone( basebone );

for (var j = 0; j < 7; j++) {
    chain.addConsecutiveBone( defaultBoneDirection, defaultBoneLength );
};

solver.add( chain, target, true );

var chain2 = new Fullik.Chain();
var base = new Fullik.Bone( new Fullik.V3(0, 0, 0), new Fullik.V3(15, 0, 0) );
chain2.addBone(base);
chain2.setHingeBaseboneConstraint( 'global', Y_AXIS, 90, 45, X_AXIS);
chain2.addConsecutiveBone( X_AXIS, 15 );
chain2.addConsecutiveBone( X_AXIS, 10 );
chain2.addConsecutiveBone( X_AXIS, 10 );

solver.connectChain( chain2, 0, 3, 'start', targets[1].position, true, 0xFF0000 );
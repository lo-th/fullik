tell("Demo 11 - Connected Chains with Freely-Rotating Global Hinged Basebone Constraints");

addTarget(new THREE.Vector3(20, 20, 20))

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

// Set this second chain to have a freely rotating global hinge which rotates about the Y axis
// Note: We MUST add the basebone to the chain before we can set the basebone constraint on it.
chain2.setFreelyRotatingGlobalHingedBasebone( Y_AXIS );

chain2.addConsecutiveBone( X_AXIS, 15 );
chain2.addConsecutiveBone( X_AXIS, 15 );
chain2.addConsecutiveBone( X_AXIS, 15 );

solver.connectChain( chain2, 0, 3, 'start', targets[1].position, true, 0xFF0000 );
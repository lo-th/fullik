tell("Demo 9 - Global Rotor Constrained Connected Chains");

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
chain2.setRotorBaseboneConstraint( 'global', X_AXIS, 45);
chain2.addConsecutiveBone( X_AXIS, 15 );
chain2.addConsecutiveBone( X_AXIS, 15 );
chain2.addConsecutiveBone( X_AXIS, 15 );

solver.connectChain( chain2, 0, 3, 'start', target, true, 0xFF0000 );

var chain3 = new Fullik.Chain();
var base = new Fullik.Bone( new Fullik.V3(0, 0, 0), new Fullik.V3(0, 15, 0) );
chain3.addBone(base);
chain3.setRotorBaseboneConstraint( 'global', Y_AXIS, 45);
chain3.addConsecutiveBone( Y_AXIS, 15 );
chain3.addConsecutiveBone( Y_AXIS, 15 );
chain3.addConsecutiveBone( Y_AXIS, 15 );

solver.connectChain( chain3, 0, 6, 'start', target, true, 0x00FF00 );
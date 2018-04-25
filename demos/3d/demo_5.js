tell("Demo 5 - Global Hinges With Reference Axis Constraints");

var chain = new Fullik.Chain( 0x999999 );

var startLoc = new Fullik.V3( 0, 30, -40 );
var endLoc = startLoc.clone();
endLoc.z -= defaultBoneLength;

var basebone = new Fullik.Bone( startLoc, endLoc );
chain.addBone( basebone );

for (var j = 0; j < 8; j++) {

    if (j % 2 == 0) chain.addConsecutiveHingedBone( Y_AXIS.negated(), defaultBoneLength, 'global', Z_AXIS, 120, 120, Y_AXIS.negated() );
    else chain.addConsecutiveBone( Y_AXIS.negated(), defaultBoneLength )

};

solver.add( chain, target, true );
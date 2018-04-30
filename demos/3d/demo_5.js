tell("Demo 5 - Global Hinges With Reference Axis Constraints");

var chain = new FIK.Chain3D( 0x999999 );

var startLoc = new FIK.V3( 0, 30, -40 );
var endLoc = startLoc.clone();
endLoc.y -= defaultBoneLength;

var basebone = new FIK.Bone3D( startLoc, endLoc );
chain.addBone( basebone );

for (var j = 0; j < 8; j++) {

	//chain.addConsecutiveHingedBone( FIK.Y_NEG, defaultBoneLength, 'global', FIK.Y_AXE, 120, 120, FIK.Y_NEG );
    if (j % 2 == 0) chain.addConsecutiveHingedBone( FIK.Y_NEG, defaultBoneLength, 'global', FIK.Z_AXE, 120, 120, FIK.Y_NEG );
    else chain.addConsecutiveBone( FIK.Y_NEG, defaultBoneLength )

};

solver.add( chain, target, true );
tell("Demo 3 - Rotor Constrained Base Bones");

var numChains = 3;
var rotStep = 360 / numChains;
var baseBoneConstraintAngleDegs = 20;
var baseBoneConstraintAxis;
var color = 0xFF0000;

for (var i = 0; i < numChains; i++ ){

    switch (i){
        case 0: color = 0xFF0000; baseBoneConstraintAxis = FIK.X_AXE;  break;
        case 1: color = 0x00FF00; baseBoneConstraintAxis = FIK.Y_AXE;  break;
        case 2: color = 0x0000FF; baseBoneConstraintAxis = FIK.Z_NEG;  break;
    }

    var chain = new FIK.Chain3D( color );

    var startLoc = new FIK.V3(0, 0, -40);
    startLoc = FIK._Math.rotateYDegs( startLoc, rotStep * i );
    var endLoc = startLoc.plus( defaultBoneDirection.multiply(defaultBoneLength * 2));
    //endLoc.z -= defaultBoneLength;

    var basebone = new FIK.Bone3D( startLoc, endLoc );
    chain.addBone( basebone );
    chain.setRotorBaseboneConstraint( 'global', baseBoneConstraintAxis, baseBoneConstraintAngleDegs);

    for (var j = 0; j < 7; j++) {

        chain.addConsecutiveBone( defaultBoneDirection, defaultBoneLength );

    };

    solver.add( chain, target, true );

}
tell("Demo 2 - Rotor / Ball Joint Constrained Bones");

var numChains = 3;
var rotStep = 360 / numChains;
var constraintAngleDegs = 45;
var color = 0xFF0000;

for (var i = 0; i < numChains; i++ ){

    switch (i){
        case 0: color = 0x550000;   break;
        case 1: color = 0x005500; break;
        case 2: color = 0x000055;  break;
    }

    var chain = new FIK.Chain3D( color )

    var startLoc = new FIK.V3(0, 0, -40);
    startLoc = FIK._Math.rotateYDegs( startLoc, rotStep * i );
    var endLoc = startLoc.clone();
    endLoc.z -= defaultBoneLength;

    var basebone = new FIK.Bone3D( startLoc, endLoc );
    chain.addBone( basebone );

    for (var j = 0; j < 7; j++) {

        chain.addConsecutiveRotorConstrainedBone( defaultBoneDirection, defaultBoneLength, constraintAngleDegs );

    };

    solver.add( chain, target, true );

}
tell("Demo 3 - Rotor Constrained Base Bones");

var numChains = 3;
var rotStep = 360 / numChains;
var baseBoneConstraintAngleDegs = 20;
var baseBoneConstraintAxis;
var color = 0xFF0000;

for (var i = 0; i < numChains; i++ ){

    switch (i){
        case 0: color = 0xFF0000; baseBoneConstraintAxis = X_AXIS;  break;
        case 1: color = 0x00FF00; baseBoneConstraintAxis = Y_AXIS;  break;
        case 2: color = 0x0000FF; baseBoneConstraintAxis = Z_AXIS.negated();  break;
    }

    var chain = new Fullik.Chain( color );

    var startLoc = new Fullik.V3(0, 0, -40);
    startLoc = Fullik._Math.rotateYDegs( startLoc, rotStep * i );
    var endLoc = startLoc.plus( defaultBoneDirection.times(defaultBoneLength * 2));
    //endLoc.z -= defaultBoneLength;

    var basebone = new Fullik.Bone( startLoc, endLoc );
    chain.addBone( basebone );
    chain.setRotorBaseboneConstraint( 'global', baseBoneConstraintAxis, baseBoneConstraintAngleDegs);

    for (var j = 0; j < 7; j++) {

        chain.addConsecutiveBone( defaultBoneDirection, defaultBoneLength );

    };

    solver.add( chain, target, true );

}
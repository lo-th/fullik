tell("Demo 1 - Unconstrained bones");

var numChains = 20;

for( var i=0; i<numChains; i++ ){

    var chain = new Fullik.Chain( 0x999999 );

    var startLoc = new Fullik.V3(-40+(i*4),0,40);
    var endLoc = startLoc.plus( defaultBoneDirection.times(defaultBoneLength));

    var basebone = new Fullik.Bone( startLoc, endLoc );
    chain.addBone( basebone );

    for (var j = 0; j < 7; j++) {
        chain.addConsecutiveBone( defaultBoneDirection, defaultBoneLength );
    };

    solver.add( chain, target, true );

}
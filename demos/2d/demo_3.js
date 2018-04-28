tell("Demo 3 - Chain with fixed base and multiple constrained bones.");

var chain = new FIK.Chain2D();
var boneLength = 10;
var basebone = new FIK.Bone2D( new FIK.V2(), new FIK.V2(boneLength, 0) );  
chain.addBone( basebone );

var defaultUV  = new FIK.V2(1, 0);
var numBones   = 15;
var rotStep    = 360 / numBones;

for(var i=0; i<numBones; i++){

    var rotatedUV = FIK._Math.rotateDegs(defaultUV, i * numBones);
    chain.addConsecutiveBone( rotatedUV, boneLength, 60, 60 );

}

// The the chain to have a fixed base location and, finally, add the chain to the structure
chain.setFixedBaseMode(true);

// Finally, add the chain to the structure
solver.add( chain, target, true );
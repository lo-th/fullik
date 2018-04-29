tell("Demo 7 - Varying-offset 'fixed' chains with embedded targets");

addTarget(new THREE.Vector3(-30, 15, 0));
addTarget(new THREE.Vector3(30, 15, 0));

var boneLength = 50;
var startY = -100;

var chain = new FIK.Chain2D();
var basebone = new FIK.Bone2D( new FIK.V2(0, startY), new FIK.V2(0, startY + boneLength) );
basebone.setClockwiseConstraintDegs(65);
basebone.setAnticlockwiseConstraintDegs(65);
chain.addBone( basebone );

// Fix the base bone to its current location, and constrain it to the positive Y-axis
chain.setFixedBaseMode(true);       
chain.setBaseboneConstraintType(FIK.GLOBAL_ABSOLUTE);
chain.setBaseboneConstraintUV(FIK.UP);

// Add second and third bones
chain.addConsecutiveBone(FIK.UP, boneLength);
chain.addConsecutiveBone(FIK.UP, boneLength);

solver.add( chain, target, true );

// ----- Left branch chain -----                
//boneLength = 18;

// Create the base bone and set its colour
basebone = new FIK.Bone2D( new FIK.V2(), new FIK.V2(-boneLength/6, 0) );
// Create the chain and add the basebone to it
var leftChain = new FIK.Chain2D( 0x00ff00 );
leftChain.setBaseboneConstraintType(FIK.LOCAL_RELATIVE);

// Add fifteen bones
leftChain.addBone(basebone);
for (var i = 0; i < 14; i++){   
    leftChain.addConsecutiveBone(FIK.RIGHT, boneLength / 6, 25, 25);
}


// Add the chain to the structure, connecting to the end of bone 0 in chain 0
solver.connectChain( leftChain, 0, 1, 'start', targets[1].position, true );

// ----- Right branch chain -----
            
// Create the base bone
basebone = new FIK.Bone2D( new FIK.V2(), new FIK.V2(boneLength/5, 0) );
basebone.setClockwiseConstraintDegs(60);
basebone.setAnticlockwiseConstraintDegs(60);

// Create the chain and add the basebone to it
var rightChain = new FIK.Chain2D( 0xff0000 );
rightChain.setBaseboneConstraintType(FIK.LOCAL_ABSOLUTE);
rightChain.setBaseboneRelativeConstraintUV(FIK.RIGHT);

// Add ten bones
rightChain.addBone(basebone);
for (var i = 0; i < 14; i++){   
    rightChain.addConsecutiveBone(FIK.RIGHT, boneLength / 5);
}
                

// Add the chain to the structure, connecting to the end of bone 1 in chain 0
solver.connectChain(rightChain, 0, 2, 'start', targets[2].position, true);

var mSmallRotatingTargetLeft  = new FIK.V2(-70., 40);
var mSmallRotatingTargetRight = new FIK.V2( 50, 20);
var mRotatingOffset = new FIK.V2( 0, 0);
var mSmallRotatingOffsetLeft  = new FIK.V2( 25, 0);
var mSmallRotatingOffsetRight = new FIK.V2( 0, 30); 

extraUpdate = function(){

    //if(!mSmallRotatingOffsetLeft && !mSmallRotatingOffsetRight && !mRotatingOffset) return

    mRotatingOffset = FIK._Math.rotateDegs(mRotatingOffset, 1.0);
    var mOrigBaseLocation = solver.chains[0].getBaseLocation()
    solver.chains[0].setBaseLocation( mOrigBaseLocation.plus(mRotatingOffset) );

    // Rotate offsets for left and right chains
    mSmallRotatingOffsetLeft  = FIK._Math.rotateDegs(mSmallRotatingOffsetLeft, -1.0);
    mSmallRotatingOffsetRight = FIK._Math.rotateDegs(mSmallRotatingOffsetRight, 2.0);

    var t1 = mSmallRotatingTargetLeft.plus(mSmallRotatingOffsetLeft);
    var t2 = mSmallRotatingTargetRight.plus(mSmallRotatingOffsetRight);

    targets[1].position.x = t1.x;
    targets[1].position.y = t1.y;

    targets[2].position.x = t2.x;
    targets[2].position.y = t2.y;

    updateTarget(targets[1].position, 1);
    updateTarget(targets[2].position, 2)

}
tell("Demo 6 - Multiple connected chains with LOCAL_ABSOLUTE base-bone constraints.");

var boneLength = 30;
var verticalChain = new FIK.Chain2D();
verticalChain.setBaseboneConstraintType(FIK.GLOBAL_ABSOLUTE);
verticalChain.setBaseboneConstraintUV(FIK.UP);

var basebone = new FIK.Bone2D( new FIK.V2(0,-50), null, FIK.UP, boneLength );
basebone.setClockwiseConstraintDegs(15);
basebone.setAnticlockwiseConstraintDegs(15);

// Add the basebone and two additional bones to the chain
verticalChain.addBone( basebone );
verticalChain.addConsecutiveBone(FIK.UP,  boneLength, 15, 15);
verticalChain.addConsecutiveBone(FIK.UP,  boneLength, 15, 15);


solver.add( verticalChain, target, true );

// ----- Left branch chain -----                
boneLength = 18;

// Create the base bone and set its colour
basebone = new FIK.Bone2D( new FIK.V2(), new FIK.V2(-boneLength, 0) );
basebone.setClockwiseConstraintDegs(15);
basebone.setAnticlockwiseConstraintDegs(15);
// Create the chain and add the basebone to it
var leftChain = new FIK.Chain2D( 0x00ff00 );
leftChain.setBaseboneConstraintType(FIK.LOCAL_ABSOLUTE);
leftChain.setBaseboneConstraintUV(FIK.LEFT);

// Add the basebone to the chain
leftChain.addBone(basebone);

// Add consecutive constrained bones               
leftChain.addConsecutiveBone(FIK.LEFT, boneLength, 90, 90);
leftChain.addConsecutiveBone(FIK.LEFT, boneLength, 90, 90);

// Add the chain to the structure, connecting to the end of bone 0 in chain 0
solver.connectChain( leftChain, 0, 0, 'end', target, true );

// ----- Right branch chain -----
            
// Create the base bone
basebone = new FIK.Bone2D( new FIK.V2(), new FIK.V2(boneLength, 0) );
basebone.setClockwiseConstraintDegs(30);
basebone.setAnticlockwiseConstraintDegs(30);

// Create the chain and add the basebone to it
var rightChain = new FIK.Chain2D( 0xff0000 );
rightChain.setBaseboneConstraintType(FIK.LOCAL_ABSOLUTE);
rightChain.setBaseboneConstraintUV(FIK.RIGHT);

// Add the basebone to the chain
rightChain.addBone(basebone);
                
// Add two consecutive constrained bones to the chain
rightChain.addConsecutiveBone(FIK.RIGHT, boneLength, 90, 90);
rightChain.addConsecutiveBone(FIK.RIGHT, boneLength, 90, 90);

// Add the chain to the structure, connecting to the end of bone 1 in chain 0
solver.connectChain(rightChain, 0, 1, 'end', target, true);
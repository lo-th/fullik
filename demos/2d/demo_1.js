tell("Demo 1 - Chain with fixed base, GLOBAL_ABSOLUTE base-bone constraints, and joint constraints.");

var chain = new FIK.Chain2D();
var boneLength = 40;

var basebone = new FIK.Bone2D( new FIK.V2(0, -boneLength), new FIK.V2(0, 0) );
basebone.setClockwiseConstraintDegs(25);
basebone.setAnticlockwiseConstraintDegs(90);     
chain.addBone( basebone );

// Fix the base bone to its current location, and constrain it to the positive Y-axis
chain.setFixedBaseMode( true );       
chain.setBaseboneConstraintType( FIK.GLOBAL_ABSOLUTE );
chain.setBaseboneConstraintUV( new FIK.V2(0, 1) );

// Create and add the second bone - 50 clockwise, 90 anti-clockwise
chain.addConsecutiveBone(new FIK.V2(0, 1), boneLength, 50, 90);

// Create and add the third bone - 75 clockwise, 90 anti-clockwise
chain.addConsecutiveBone(new FIK.V2(0, 1), boneLength, 75, 90);

// Finally, add the chain to the structure
solver.add( chain, target, true );
tell("Demo 9 - Chain with fixed base and world space (GLOBAL) bone constaints.");

var chain = new FIK.Chain2D();
var boneLength = 40;
var basebone = new FIK.Bone2D( new FIK.V2(0, -boneLength), new FIK.V2(0, 0) );
basebone.setClockwiseConstraintDegs(90);
basebone.setAnticlockwiseConstraintDegs(90); 
chain.addBone( basebone );
// Fix the base bone to its current location, and constrain it to the positive Y-axis
chain.setFixedBaseMode(true);       
chain.setBaseboneConstraintType(FIK.GLOBAL_ABSOLUTE);
chain.setBaseboneConstraintUV( new FIK.V2(0, 1) );

chain.addConsecutiveBone(FIK.UP, boneLength);
chain.addConsecutiveBone(FIK.UP, boneLength);

// Create and add the fourth 'gripper' bone - locked in place facing right (i.e. 0 degree movement allowed both clockwise & anti-clockwise)
// Note: The start location of (50.0f, 50.0f) is ignored because we're going to add this to the end of the chain, wherever that may be.
var gripper = new FIK.Bone2D( new FIK.V2(50, 50), null, FIK.RIGHT, boneLength * 0.5, 30, 30, 0xFF0000 );       
gripper.setJointConstraintCoordinateSystem( FIK.J_GLOBAL );
gripper.setGlobalConstraintUV( FIK.RIGHT );       
chain.addConsecutiveBone( gripper );

// Finally, add the chain to the structure
solver.add( chain, target, true );
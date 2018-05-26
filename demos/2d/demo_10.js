tell("Demo 10 - leg test.");

var chain = new FIK.Chain2D();
var basebone = new FIK.Bone2D( new FIK.V2(0, 0), new FIK.V2(0, -20) );
//basebone.setClockwiseConstraintDegs(180);
//basebone.setAnticlockwiseConstraintDegs(180); 
chain.addBone( basebone );
// Fix the base bone to its current location, and constrain it to the positive Y-axis
chain.setFixedBaseMode(true);       
//chain.setBaseboneConstraintType(FIK.GLOBAL_ABSOLUTE);
//chain.setBaseboneConstraintUV( new FIK.V2(0, 1) );

chain.addConsecutiveBone(FIK.DOWN, 20, 170, 0);
//chain.addConsecutiveBone(FIK.UP, 21, 150, 150);
//chain.addConsecutiveBone(FIK.UP, 14.2);

// Create and add the fourth 'gripper' bone - locked in place facing right (i.e. 0 degree movement allowed both clockwise & anti-clockwise)
// Note: The start location of (50.0f, 50.0f) is ignored because we're going to add this to the end of the chain, wherever that may be.
/*var gripper = new FIK.Bone2D( new FIK.V2(50, 50), null, FIK.RIGHT, boneLength * 0.5, 30, 30, 0xFF0000 );       
gripper.setJointConstraintCoordinateSystem( FIK.J_GLOBAL );
gripper.setGlobalConstraintUV( FIK.RIGHT );       
chain.addConsecutiveBone( gripper );*/

// Finally, add the chain to the structure
solver.add( chain, target, true );

extraUpdate = function(){

	var bones = solver.chains[0].bones;

	var r = FIK._Math.findAngle(bones[0], bones[1]);
	r *= FIK._Math.toDeg;

	tell( "ANGLE:" + r );





}
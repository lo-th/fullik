tell("Demo 0 - Human bones");

addTarget(new THREE.Vector3(-30, 15, 0));
addTarget(new THREE.Vector3(30, 15, 0));
addTarget(new THREE.Vector3(-8, -40, 0));
addTarget(new THREE.Vector3( 8, -40, 0));

var startLoc = new FIK.V3();

var chain, basebone;

// 0 spine

chain = new FIK.Chain3D( 0xFFFF00 );
basebone = new FIK.Bone3D( startLoc, new FIK.V3( 0, 2, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( Y_AXIS, 5, 30 );
chain.addConsecutiveRotorConstrainedBone( Y_AXIS, 5, 30 );
chain.addConsecutiveRotorConstrainedBone( Y_AXIS, 5, 30 );
chain.addConsecutiveRotorConstrainedBone( Y_AXIS, 5, 30 );

solver.add( chain, targets[0].position, true );

// 1 left arm

chain = new FIK.Chain3D();
basebone = new FIK.Bone3D( new FIK.V3( 0, 20, 0 ), new FIK.V3( -5, 20, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( X_AXIS.negated(), 10, 90 );
chain.addConsecutiveHingedBone( X_AXIS.negated(), 10, 'global', Y_AXIS, 90, 120, X_AXIS.negated() );
//chain.addConsecutiveHingedBone( X_AXIS.negated(), 10, FIK.J_GLOBAL_HINGE, Y_AXIS, 90, 90, Z_AXIS );
//chain.addConsecutiveBone( X_AXIS.negated(), 10 );
//chain.addConsecutiveBone( X_AXIS.negated(), 10 );
//chain.addConsecutiveBone( X_AXIS.negated(), 5 );

chain.setRotorBaseboneConstraint( 'local', X_AXIS.negated(), 10 );
solver.connectChain( chain, 0, 3, 'end', targets[1].position, true, 0x44FF44 );

// 2 right arm

chain = new FIK.Chain3D();
basebone = new FIK.Bone3D( new FIK.V3( 0, 20, 0 ), new FIK.V3( -5, 20, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( X_AXIS, 10, 90 );
chain.addConsecutiveHingedBone( X_AXIS.negated(), 10, 'global', Y_AXIS, 90, 120, X_AXIS );
//chain.addConsecutiveBone( X_AXIS, 10 );
//chain.addConsecutiveBone( X_AXIS, 10 );
//chain.addConsecutiveBone( X_AXIS, 5 );

chain.setRotorBaseboneConstraint( 'local', X_AXIS, 10 );
solver.connectChain( chain, 0, 3, 'end', targets[2].position, true, 0x4444FF );


// 5 left leg

chain = new FIK.Chain3D();
basebone = new FIK.Bone3D( new FIK.V3( 0, 0, 0 ), new FIK.V3( -4, 0, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( Y_AXIS.negated(), 15, 90 );
chain.addConsecutiveHingedBone( Y_AXIS.negated(), 15, 'local', Y_AXIS, 1, 120, Z_AXIS );
//chain.addConsecutiveBone( Y_AXIS.negated(), 15 );
//chain.addConsecutiveBone( Y_AXIS.negated(), 15  );

chain.setRotorBaseboneConstraint( 'local', X_AXIS.negated(), 10 );
solver.connectChain( chain, 0, 0, 'start', targets[3].position, true, 0x44FF44 );


// 5 left right

chain = new FIK.Chain3D();
basebone = new FIK.Bone3D( new FIK.V3( 0, 0, 0 ), new FIK.V3( 4, 0, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( Y_AXIS.negated(), 15, 90 );
chain.addConsecutiveHingedBone( Y_AXIS.negated(), 15, 'local', Z_AXIS.negated(), 1, 120, Z_AXIS.negated() );
//chain.addConsecutiveBone( Y_AXIS.negated(), 15 );
//chain.addConsecutiveBone( Y_AXIS.negated(), 15  );

chain.setRotorBaseboneConstraint( 'local', X_AXIS, 10 );
solver.connectChain( chain, 0, 0, 'start', targets[4].position, true, 0x4444FF );
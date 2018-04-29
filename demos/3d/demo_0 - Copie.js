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
chain.addConsecutiveRotorConstrainedBone( FIK.Y_AXE, 5, 30 );
chain.addConsecutiveRotorConstrainedBone( FIK.Y_AXE, 5, 30 );
chain.addConsecutiveRotorConstrainedBone( FIK.Y_AXE, 5, 30 );
chain.addConsecutiveRotorConstrainedBone( FIK.Y_AXE, 5, 30 );

solver.add( chain, targets[0].position, true );

// 1 left arm

chain = new FIK.Chain3D();
basebone = new FIK.Bone3D( new FIK.V3( 0, 20, 0 ), new FIK.V3( -5, 20, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( FIK.X_NEG, 10, 90 );
chain.addConsecutiveHingedBone( FIK.X_NEG, 10, 'global', FIK.Y_AXE, 90, 120, FIK.X_NEG );
//chain.addConsecutiveHingedBone( FIK.X_NEG, 10, FIK.J_GLOBAL_HINGE, FIK.Y_AXE, 90, 90, FIK.Z_AXE );
//chain.addConsecutiveBone( FIK.X_NEG, 10 );
//chain.addConsecutiveBone( FIK.X_NEG, 10 );
//chain.addConsecutiveBone( FIK.X_NEG, 5 );

chain.setRotorBaseboneConstraint( 'local', FIK.X_NEG, 10 );
solver.connectChain( chain, 0, 3, 'end', targets[1].position, true, 0x44FF44 );

// 2 right arm

chain = new FIK.Chain3D();
basebone = new FIK.Bone3D( new FIK.V3( 0, 20, 0 ), new FIK.V3( -5, 20, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( FIK.X_AXE, 10, 90 );
chain.addConsecutiveHingedBone( FIK.X_NEG, 10, 'global', FIK.Y_AXE, 90, 120, FIK.X_AXE );
//chain.addConsecutiveBone( FIK.X_AXE, 10 );
//chain.addConsecutiveBone( FIK.X_AXE, 10 );
//chain.addConsecutiveBone( FIK.X_AXE, 5 );

chain.setRotorBaseboneConstraint( 'local', FIK.X_AXE, 10 );
solver.connectChain( chain, 0, 3, 'end', targets[2].position, true, 0x4444FF );


// 5 left leg

chain = new FIK.Chain3D();
basebone = new FIK.Bone3D( new FIK.V3( 0, 0, 0 ), new FIK.V3( -4, 0, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( FIK.Y_AXE.negated(), 15, 90 );
chain.addConsecutiveHingedBone( FIK.Y_AXE.negated(), 15, 'local', FIK.Y_AXE, 1, 120, FIK.Z_AXE );
//chain.addConsecutiveBone( FIK.Y_AXE.negated(), 15 );
//chain.addConsecutiveBone( FIK.Y_AXE.negated(), 15  );

chain.setRotorBaseboneConstraint( 'local', FIK.X_NEG, 10 );
solver.connectChain( chain, 0, 0, 'start', targets[3].position, true, 0x44FF44 );


// 5 left right

chain = new FIK.Chain3D();
basebone = new FIK.Bone3D( new FIK.V3( 0, 0, 0 ), new FIK.V3( 4, 0, 0 ) );
chain.addBone( basebone );
chain.addConsecutiveRotorConstrainedBone( FIK.Y_AXE.negated(), 15, 90 );
chain.addConsecutiveHingedBone( FIK.Y_AXE.negated(), 15, 'local', FIK.Z_NEG, 1, 120, FIK.Z_NEG );
//chain.addConsecutiveBone( FIK.Y_AXE.negated(), 15 );
//chain.addConsecutiveBone( FIK.Y_AXE.negated(), 15  );

chain.setRotorBaseboneConstraint( 'local', FIK.X_AXE, 10 );
solver.connectChain( chain, 0, 0, 'start', targets[4].position, true, 0x4444FF );
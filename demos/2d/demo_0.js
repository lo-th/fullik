tell("Demo 0 - stress test.");

var n = 60;
var pi = Math.PI;
var numBones = 20;
var x, y, r = 100, r2 = 95;
var v1, v2, uv

for( var j=0; j < n; j++ ){

	x = Math.cos( 2 * j * pi / n ); 
	y = Math.sin( 2 * j * pi / n );

	v1 = new FIK.V2( x*r, y*r );
	v2 = new FIK.V2( x*r2, y*r2 );


	var chain = new FIK.Chain2D( FIK._Math.rand(0x555555, 0xFFFFFF) );
	var boneLength = 5;
	var basebone = new FIK.Bone2D( v1, v2 );  
	chain.addBone( basebone );

	uv  = v2.minus( v1 ).normalize();

	for(var i=0; i<numBones; i++){

	    chain.addConsecutiveBone( uv, boneLength, 60, 60 );

	}

	// The the chain to have a fixed base location and, finally, add the chain to the structure
	chain.setFixedBaseMode(true);

	// Finally, add the chain to the structure
	solver.add( chain, target, true );

}
tell("Demo 8 - Multiple nested chains in a semi-random configuration");

solver.add( createRandomChain(), target, true );
var chainsInStructure = 0;
        
var maxChains = 3;
for ( var i = 0; i < maxChains; i++)
{   
    /*var tempChain = createRandomChain();
    tempChain.setBaseboneConstraintType(FIK.BB_LOCAL_RELATIVE);
    tempChain.setBaseboneConstraintUV(FIK.UP);*/
    
    solver.connectChain( createRandomChain(), FIK._Math.randInt(0, chainsInStructure), FIK._Math.randInt(0, 4), 'start', target, true );
    chainsInStructure++
}

function createRandomChain(){

    var boneLength           = 20;
    var boneLengthRatio      = 0.8;      
    var constraintAngleDegs  = 20;
    var constraintAngleRatio = 1.4; 
                
    // ----- Vertical chain -----
    var chain = new FIK.Chain2D( FIK._Math.rand(0x999999, 0xFFFFFF) );
    chain.setFixedBaseMode( true );   
    
    var basebone = new FIK.Bone2D( new FIK.V2(), null, FIK.UP, boneLength);
    basebone.setClockwiseConstraintDegs(constraintAngleDegs);
    basebone.setAnticlockwiseConstraintDegs(constraintAngleDegs);
    chain.setBaseboneConstraintType(FIK.BB_LOCAL_RELATIVE);
    chain.addBone(basebone);    
    
    var numBones = 6;
    var perturbLimit = 0.4;
    for (var i = 0; i < numBones; i++){

        boneLength          *= boneLengthRatio;
        constraintAngleDegs *= constraintAngleRatio;
        var perturbVector  = new FIK.V2( FIK._Math.rand(-perturbLimit, perturbLimit), FIK._Math.rand(-perturbLimit, perturbLimit) );
        
        chain.addConsecutiveBone( FIK.UP.plus(perturbVector), boneLength, constraintAngleDegs, constraintAngleDegs );

    }
    
    return chain;
}
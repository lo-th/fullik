<p align="center"><a href="http://lo-th.github.io/fullik/"><img src="http://lo-th.github.io/fullik/assets/logo.svg"/></a></p>

<p align="center">javascript fast iterative solver for Inverse Kinematics on three.js<br><br>
is a conversion from java to <a href="https://github.com/FedUni/caliko">Caliko libs</a>, Caliko library is an implementation<br>
of the <a href="http://www.andreasaristidou.com/FABRIK.html">FABRIK</a> inverse kinematics algorithm by Dr. Andreas Aristidou<br><br></p>

<p align="center"><a href="http://lo-th.github.io/fullik/">LAUNCH DEMO</a></p>

<p align="center">
Note: Fullik is now FIK<br>
new Fullik.Bone() -> new FIK.Bone3D()<br>
new Fullik.Bone() -> new FIK.Bone3D()<br>
new Fullik.Chain() -> new FIK.Chain3D()<br>
new Fullik.Structure() -> new FIK.Structure3D()<br>
</p>

## Usage

```js
const { Structure3D } = require('FIK');
const scene = new THREE.Scene();

const solver = Structure3D(scene);

const n = {
     mesh : new THREE.Mesh( new THREE.SphereBufferGeometry( 0.1, 6, 4 ),  new THREE.MeshStandardMaterial({color:0xFFFF00, wireframe:true }) ),
    control : new THREE.TransformControls( camera, renderer.domElement ),
}

function updateSolver() {
    solver.update();
}

scene.add(n.mesh);
scene.add(n.control);

n.control.addEventListener('change', updateSolver);

n.position = n.mesh.position; //  publishes x, y, z to the engine...

```

From [Demo 2](https://github.com/lo-th/fullik/blob/gh-pages/demos/3d/demo_2.js)

```js
var numChains = 3;
var rotStep = 360 / numChains;
var constraintAngleDegs = 45;
var color = 0xFF0000;

for (var i = 0; i < numChains; i++ ){

    switch (i){
        case 0: color = 0x550000;   break;
        case 1: color = 0x005500; break;
        case 2: color = 0x000055;  break;
    }

    var chain = new FIK.Chain3D( color )

    var startLoc = new FIK.V3(0, 0, -40);
    startLoc = FIK._Math.rotateYDegs( startLoc, rotStep * i );
    var endLoc = startLoc.clone();
    endLoc.z -= defaultBoneLength;

    var basebone = new FIK.Bone3D( startLoc, endLoc );
    chain.addBone( basebone );

    for (var j = 0; j < 7; j++) {

        chain.addConsecutiveRotorConstrainedBone( defaultBoneDirection, defaultBoneLength, constraintAngleDegs );

    };

    solver.add( chain, target, true );

}
```

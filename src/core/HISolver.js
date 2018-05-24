//import { NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, J_BALL, J_GLOBAL, J_LOCAL } from '../constants.js';
import { _Math } from '../math/Math.js';
import { V3 } from '../math/V3.js';
import { V2 } from '../math/V2.js';
import { Structure3D } from './Structure3D.js';
import { Structure2D } from './Structure2D.js';
import { Chain3D } from './Chain3D.js';
import { Chain2D } from './Chain2D.js';
import { Bone3D } from './Bone3D.js';
import { Bone2D } from './Bone2D.js';


function HISolver(){

	this.startBones = null;
	this.endBones = null;

    this.target = null;
    this.goal = null;
    this.swivelAngle = 0;

    this.iteration = 40;

    this.thresholds = { position:0.1, rotation:0.1 };

    this.solver = null;
    this.chain = null;

}

Object.assign( HISolver.prototype, {

	isIKSolver: true,

} );

export { HISolver };
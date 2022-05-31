//import { NONE, GLOBAL_ROTOR, GLOBAL_HINGE, LOCAL_ROTOR, LOCAL_HINGE, J_BALL, J_GLOBAL, J_LOCAL } from '../constants.js';

import { V3 } from '../math/V3.js';
import { V2 } from '../math/V2.js';
import { Structure3D } from '../core/Structure3D.js';
import { Chain3D } from '../core/Chain3D.js';
import { Bone3D } from '../core/Bone3D.js';

export class IKSolver {

    constructor( o ) {

        this.isIKSolver = true;
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

}
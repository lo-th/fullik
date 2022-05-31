//import './polyfills.js';

import { math } from './math/Math.js';
import { V2 } from './math/V2.js';
import { V3 } from './math/V3.js';
import { M3 } from './math/M3.js';

import { Joint3D } from './core/Joint3D.js';
import { Bone3D } from './core/Bone3D.js';
import { Chain3D } from './core/Chain3D.js';
import { Structure3D } from './core/Structure3D.js';

import { Joint2D } from './core/Joint2D.js';
import { Bone2D } from './core/Bone2D.js';
import { Chain2D } from './core/Chain2D.js';
import { Structure2D } from './core/Structure2D.js';

import { IKSolver } from './solver/IKSolver.js';
import { HISolver } from './solver/HISolver.js';

import { REVISION, X_AXE, Y_AXE, Z_AXE, X_NEG, Y_NEG, Z_NEG, UP, DOWN, LEFT, RIGHT } from './constants.js';

export const FIK = {

	REVISION : REVISION,

	X_AXE : X_AXE,
	Y_AXE : Y_AXE,
	Z_AXE : Z_AXE,
	X_NEG : X_NEG,
	Y_NEG : Y_NEG,
	Z_NEG : Z_NEG,
	UP : UP,
	DOWN : DOWN,
	LEFT : LEFT,
	RIGHT : RIGHT,

	math:math,
	V2:V2,
	V3:V3,
	M3:M3,

	Bone3D:Bone3D,
	Chain3D:Chain3D,
	Joint3D:Joint3D,
	Structure3D:Structure3D,

	Bone2D:Bone2D,
	Chain2D:Chain2D,
	Joint2D:Joint2D,
	Structure2D:Structure2D,

	IKSolver:IKSolver,
	HISolver:HISolver,

}
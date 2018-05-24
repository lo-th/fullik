/*
 * A list of constants built-in for
 * the Fik engine.
 */
import { V3 } from './math/V3.js';
import { V2 } from './math/V2.js';
import { M3 } from './math/M3.js';

export var REVISION = '1.3.3';

export var PRECISION = 0.001;
export var PRECISION_DEG = 0.01;
export var MAX_VALUE = Infinity;

export var PI = Math.PI;
export var TORAD = Math.PI / 180;
export var TODEG = 180 / Math.PI;

// chain Basebone Constraint Type

export var NONE = 1; // No constraint
// 3D
export var GLOBAL_ROTOR = 2;// World-space rotor constraint
export var GLOBAL_HINGE = 3;// World-space hinge constraint
export var LOCAL_ROTOR = 4;// Rotor constraint in the coordinate space of (i.e. relative to) the direction of the connected bone
export var LOCAL_HINGE = 5;// Hinge constraint in the coordinate space of (i.e. relative to) the direction of the connected bone

// 2D
export var GLOBAL_ABSOLUTE = 6; // Constrained about a world-space direction
export var LOCAL_RELATIVE = 7; // Constrained about the direction of the connected bone
export var LOCAL_ABSOLUTE = 8; // Constrained about a direction with relative to the direction of the connected bone

// joint Type
export var J_BALL = 10;
export var J_LOCAL = 11;
export var J_GLOBAL = 12;

export var START = 20;
export var END = 21;

// Define world-space axis

export var X_AXE = new V3( 1, 0, 0 );
export var Y_AXE = new V3( 0, 1, 0 );
export var Z_AXE = new V3( 0, 0, 1 );

export var X_NEG = new V3( -1, 0, 0 );
export var Y_NEG = new V3( 0, -1, 0 );
export var Z_NEG = new V3( 0, 0, -1 );

// Define world-space 2D cardinal axes

export var UP = new V2( 0, 1 );
export var DOWN = new V2( 0, -1 );
export var LEFT = new V2( -1, 0 );
export var RIGHT = new V2( 1, 0 );

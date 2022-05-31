/*
 * A list of constants built-in for
 * the Fik engine.
 */
import { V3 } from './math/V3.js';
import { V2 } from './math/V2.js';
import { M3 } from './math/M3.js';

export const REVISION = '1.4.0';

export const PRECISION = 0.001;
export const PRECISION_DEG = 0.01;
export const MAX_VALUE = Infinity;

// chain Basebone Constraint Type

export const NONE = 1; // No constraint
// 3D
export const GLOBAL_ROTOR = 2;// World-space rotor constraint
export const GLOBAL_HINGE = 3;// World-space hinge constraint
export const LOCAL_ROTOR = 4;// Rotor constraint in the coordinate space of (i.e. relative to) the direction of the connected bone
export const LOCAL_HINGE = 5;// Hinge constraint in the coordinate space of (i.e. relative to) the direction of the connected bone

// 2D
export const GLOBAL_ABSOLUTE = 6; // Constrained about a world-space direction
export const LOCAL_RELATIVE = 7; // Constrained about the direction of the connected bone
export const LOCAL_ABSOLUTE = 8; // Constrained about a direction with relative to the direction of the connected bone

// joint Type
export const J_BALL = 10;
export const J_LOCAL = 11;
export const J_GLOBAL = 12;

export const START = 20;
export const END = 21;

// Define world-space axis

export const X_AXE = new V3( 1, 0, 0 );
export const Y_AXE = new V3( 0, 1, 0 );
export const Z_AXE = new V3( 0, 0, 1 );

export const X_NEG = new V3( -1, 0, 0 );
export const Y_NEG = new V3( 0, -1, 0 );
export const Z_NEG = new V3( 0, 0, -1 );

// Define world-space 2D cardinal axes

export const UP = new V2( 0, 1 );
export const DOWN = new V2( 0, -1 );
export const LEFT = new V2( -1, 0 );
export const RIGHT = new V2( 1, 0 );

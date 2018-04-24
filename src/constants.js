/*
 * A list of constants built-in for
 * the Fik engine.
 */

export var REVISION = '1.3.3';

// joint Type
export var J_BALL = 10;
export var J_GLOBAL_HINGE = 11;
export var J_LOCAL_HINGE = 12;

// chain Basebone Constraint Type

export var BB_NONE = 1; // No constraint
// 3D
export var BB_GLOBAL_ROTOR = 2;// World-space rotor constraint
export var BB_GLOBAL_HINGE = 3;// World-space hinge constraint
export var BB_LOCAL_ROTOR = 4;// Rotor constraint in the coordinate space of (i.e. relative to) the direction of the connected bone
export var BB_LOCAL_HINGE = 5;// Hinge constraint in the coordinate space of (i.e. relative to) the direction of the connected bone
// 2D
export var BB_GLOBAL_ABSOLUTE = 6; // Constrained about a world-space direction
export var BB_LOCAL_RELATIVE = 7; // Constrained about the direction of the connected bone
export var BB_LOCAL_ABSOLUTE = 8; // Constrained about a direction with relative to the direction of the connected bone

export var START = 20;
export var END = 21;
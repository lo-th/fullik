import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

function babelCleanup() {

	const doubleSpaces = / {2}/g;

	return {

		transform( code ) {

			code = code.replace( doubleSpaces, '\t' );

			return {
				code: code,
				map: null
			};

		}

	};

}


function header() {

	return {

		renderChunk( code ) {

			return `/**
 * @license
 * Copyright 2010-2022 fik.js Authors
 * SPDX-License-Identifier: MIT
 */
${ code }`;

		}

	};

}



const babelrc = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				// the supported browsers of the three.js browser bundle
				// https://browsersl.ist/?q=%3E0.3%25%2C+not+dead
				targets: '>1%',
				loose: true,
				bugfixes: true,
			}
		]
	],
	plugins: [
	    [
	        "@babel/plugin-proposal-class-properties",
	        {
	        	"loose": true
	        }
	    ]
	]
};

export default [
    {
		input: 'src/FIK.js',
		plugins: [
			header()
		],
		output: [
			{
				format: 'esm',
				file: 'build/fik.module.js'
			}
		]
	},
	{
		input: 'src/FIK.js',
		plugins: [
			babel( {
				babelHelpers: 'bundled',
				compact: false,
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
			header()
		],
		output: [
			{
				format: 'umd',
				name: 'FIK',
				file: 'build/fik.js',
				indent: '\t'
			}
		]
	},
	{
		input: 'src/FIK.js',
		plugins: [
			babel( {
				babelHelpers: 'bundled',
				babelrc: false,
				...babelrc
			} ),
			babelCleanup(),
			terser(),
			header()
		],
		output: [
			{
				format: 'umd',
				name: 'FIK',
				file: 'build/fik.min.js'
			}
		]
	}
	
];


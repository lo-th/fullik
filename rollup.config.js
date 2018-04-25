export default {
	input: 'src/Fullik.js',
	
	// sourceMap: true,
	output: [
		{
			format: 'umd',
			name: 'FIK',
			file: 'build/fik.js',
			indent: '\t'
		},
		{
			format: 'es',
			file: 'build/fik.module.js',
			indent: '\t'
		}
	]
};

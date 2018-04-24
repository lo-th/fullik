export default {
	input: 'src/Fullik.js',
	
	// sourceMap: true,
	output: [
		{
			format: 'umd',
			name: 'Fullik',
			file: 'build/Fullik.js',
			indent: '\t'
		},
		{
			format: 'es',
			file: 'build/Fullik.module.js',
			indent: '\t'
		}
	]
};

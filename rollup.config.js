export default {
	input: 'src/Fullik.js',
	
	// sourceMap: true,
	output: [
		{
			format: 'umd',
			name: 'Fullik',
			file: 'build/fullik.js',
			indent: '\t'
		},
		{
			format: 'es',
			file: 'build/fullik.module.js',
			indent: '\t'
		}
	]
};

const [scriptConfig, moduleConfig] = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = [
	{
		...scriptConfig,
		entry: {
			'js/editor': path.resolve(process.cwd(), 'resources/js', 'editor.js')
		}
	},
	{
		...moduleConfig,
		entry: {
			'js/color-scheme': path.resolve(process.cwd(), 'resources/js', 'color-scheme.js')
		}
	}
];
